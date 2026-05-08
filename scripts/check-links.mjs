// @ts-check
/**
 * Enforces link hygiene across all .md and .mdx files in src/contents/:
 *
 * 1. Absolute internal links — files inside src/contents/docs/ must not use
 *    absolute paths like /docs/some-page. Use relative links instead so that
 *    broken targets are caught at build time rather than surfacing as 404s at
 *    runtime.
 *
 * 2. Broken relative links (explicit extension) — relative links with a .md
 *    or .mdx extension must resolve to a real file on disk.
 *
 * 3. Broken relative links (extensionless) — relative links with no file
 *    extension (e.g. ../08.architecture or ../07.triggers/) must resolve to a
 *    real file or directory index on disk.
 *
 * 4. Broken absolute internal links — absolute paths into known content
 *    sections (e.g. /docs/some-page in a blog post) must resolve to a real
 *    page on disk, accounting for the numeric directory prefixes Astro strips
 *    from URLs.
 *
 * Usage: node scripts/check-links.mjs
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const contentsDir = path.join(rootDir, "src", "contents")
const docsDir = path.join(contentsDir, "docs")

/**
 * Maps URL path prefix → absolute path to the content directory that serves
 * it. Astro strips numeric directory prefixes (e.g. "05.") when building
 * URLs, so /docs/workflow-components routes to docs/05.workflow-components/.
 *
 * NOTE: blog posts live in src/contents/blogs/ but are served under /blogs/.
 */
const CONTENT_SECTIONS = new Map([
    ["/docs/", path.join(contentsDir, "docs")],
    ["/blogs/", path.join(contentsDir, "blogs")],
    ["/tutorial-videos/", path.join(contentsDir, "tutorial-videos")],
    ["/customer-stories/", path.join(contentsDir, "customer-stories")],
])

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Collect all .md/.mdx files under a directory, recursively. */
function collectFiles(dir) {
    const files = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            files.push(...collectFiles(full))
        } else if (/\.(md|mdx)$/.test(entry.name)) {
            files.push(full)
        }
    }
    return files
}

/**
 * Extract link targets from markdown content.
 * Strips frontmatter and fenced code blocks first to avoid false positives.
 * @param {string} raw
 * @returns {string[]}
 */
function extractLinkTargets(raw) {
    // Strip YAML frontmatter
    let content = raw.replace(/^---[\s\S]*?\n---\n?/, "")

    // Strip fenced code blocks (``` and ~~~)
    content = content.replace(/^`{3,}[\s\S]*?^`{3,}/gm, "")
    content = content.replace(/^~{3,}[\s\S]*?^~{3,}/gm, "")

    // Strip inline code spans to avoid matching URLs inside backticks
    content = content.replace(/`[^`\n]+`/g, "")

    const targets = []

    // Inline links: [text](url) or [text](url "title")
    const inlineRe = /\[(?:[^\]\\]|\\.)*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
    let m
    while ((m = inlineRe.exec(content)) !== null) {
        targets.push(m[1])
    }

    // Reference-style link definitions: [id]: url
    const refRe = /^\s*\[[^\]]+\]:\s+(\S+)/gm
    while ((m = refRe.exec(content)) !== null) {
        targets.push(m[1])
    }

    return targets
}

/** True if the URL is clearly external or non-navigable. */
function isExternal(url) {
    return /^(https?:|mailto:|ftp:|data:|#)/.test(url)
}

/** True if the URL is an absolute path into a known content section. */
function isAbsoluteInternalContent(url) {
    if (!url.startsWith("/")) return false
    for (const prefix of CONTENT_SECTIONS.keys()) {
        if (url.startsWith(prefix)) return true
    }
    return false
}

/**
 * True if the URL is a relative link with an explicit .md/.mdx extension.
 * These must resolve to a real file on disk.
 */
function isRelativeMarkdownLink(url) {
    return (
        !url.startsWith("/") &&
        !isExternal(url) &&
        /\.mdx?(?:#[^#]*)?$/.test(url)
    )
}

/**
 * True if the URL is a relative link with no file extension (or only a
 * trailing slash), meaning it targets a directory index or bare page slug.
 * Known static-asset extensions are excluded to avoid false positives.
 */
function isRelativeExtensionlessLink(url) {
    if (url.startsWith("/") || isExternal(url)) return false
    const clean = url.replace(/#.*$/, "").replace(/\?.*$/, "")
    if (!clean || clean === ".") return false
    // Already handled by isRelativeMarkdownLink
    if (/\.mdx?$/.test(clean)) return false
    // Skip links to static assets
    if (/\.(png|jpe?g|gif|svg|webp|ico|pdf|json|ya?ml|zip|tar|gz|woff2?|ttf|eot|mp[34]|wav|csv|xml)$/i.test(clean)) return false
    // Only proceed if the last segment has no dot (extensionless) or URL ends with /
    const lastSegment = clean.split("/").filter(Boolean).pop() ?? ""
    return clean.endsWith("/") || !lastSegment.includes(".")
}

/** Resolve a relative URL to an absolute filesystem path, stripping fragments. */
function resolveRelativePath(url, fromFile) {
    const clean = url.replace(/#.*$/, "").replace(/\?.*$/, "")
    return path.resolve(path.dirname(fromFile), clean)
}

/**
 * Given a base path (no extension), try the common candidates in order and
 * return the first that exists, or null.
 */
function findFile(base) {
    const candidates = [
        path.join(base, "index.md"),
        path.join(base, "index.mdx"),
        base + ".md",
        base + ".mdx",
    ]
    for (const c of candidates) {
        if (fs.existsSync(c)) return c
    }
    return null
}

// Cache readdirSync results to avoid repeated syscalls for the same directory.
const _dirCache = new Map()
function cachedReaddir(dir) {
    if (!_dirCache.has(dir)) {
        try {
            _dirCache.set(dir, fs.readdirSync(dir, { withFileTypes: true }))
        } catch {
            _dirCache.set(dir, [])
        }
    }
    return _dirCache.get(dir)
}

/** Strip the leading numeric prefix Astro removes from directory names (e.g. "05."). */
function stripNumericPrefix(name) {
    return name.replace(/^\d+\./, "")
}

// Cache resolved absolute URLs to avoid repeated work across files.
const _absoluteCache = new Map()

/**
 * Resolve an absolute internal URL (e.g. /docs/workflow-components/tasks) to
 * its file path on disk, accounting for Astro's numeric-prefix stripping.
 * Returns the resolved path string, or null if it does not exist.
 */
function resolveAbsoluteInternalLink(url) {
    const clean = url
        .replace(/#.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\/$/, "")

    if (_absoluteCache.has(clean)) return _absoluteCache.get(clean)

    let sectionDir = null
    let urlPath = ""
    for (const [prefix, dir] of CONTENT_SECTIONS) {
        if (clean.startsWith(prefix)) {
            sectionDir = dir
            urlPath = clean.slice(prefix.length)
            break
        }
    }
    if (!sectionDir) {
        _absoluteCache.set(clean, null)
        return null
    }

    if (!urlPath) {
        const result = findFile(sectionDir)
        _absoluteCache.set(clean, result)
        return result
    }

    const segments = urlPath.split("/").filter(Boolean)
    let current = sectionDir

    for (const segment of segments) {
        const entries = cachedReaddir(current)
        const match = entries.find(
            (e) => stripNumericPrefix(e.name) === segment,
        )
        if (!match) {
            _absoluteCache.set(clean, null)
            return null
        }
        current = path.join(current, match.name)
    }

    // current may be a directory (needs index file) or a direct file
    const result = fs.existsSync(current) && fs.statSync(current).isDirectory()
        ? findFile(current)
        : fs.existsSync(current)
          ? current
          : null

    _absoluteCache.set(clean, result)
    return result
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const errors = []
const allFiles = collectFiles(contentsDir)

console.log(`Scanning ${allFiles.length} content file(s)…\n`)

for (const filePath of allFiles) {
    let raw
    try {
        raw = fs.readFileSync(filePath, "utf-8")
    } catch {
        continue
    }

    const relPath = path.relative(rootDir, filePath)
    const isDocsFile = filePath.startsWith(docsDir + path.sep)
    const targets = extractLinkTargets(raw)

    for (const url of targets) {
        if (isExternal(url)) continue

        if (isAbsoluteInternalContent(url)) {
            if (isDocsFile) {
                // Rule 1: docs pages must use relative links, not absolute paths.
                errors.push(
                    `${relPath}\n    absolute internal link: "${url}"\n    → convert to a relative path so broken links are caught at build time`,
                )
            } else {
                // Rule 4: absolute links in non-docs files must resolve to a real page.
                if (resolveAbsoluteInternalLink(url) === null) {
                    errors.push(
                        `${relPath}\n    broken absolute link: "${url}"\n    → no matching page found on disk`,
                    )
                }
            }
        }

        // Rule 2: relative .md/.mdx links must point to existing files.
        if (isRelativeMarkdownLink(url)) {
            const resolved = resolveRelativePath(url, filePath)
            if (!fs.existsSync(resolved)) {
                errors.push(
                    `${relPath}\n    broken relative link: "${url}"\n    → resolves to ${path.relative(rootDir, resolved)} (file not found)`,
                )
            }
        }

        // Rule 3: extensionless relative links must resolve to a file or index.
        if (isRelativeExtensionlessLink(url)) {
            const base = resolveRelativePath(url, filePath)
            if (findFile(base) === null) {
                errors.push(
                    `${relPath}\n    broken relative link: "${url}"\n    → no file or index found at ${path.relative(rootDir, base)}`,
                )
            }
        }
    }
}

if (errors.length > 0) {
    console.error(`FAIL: ${errors.length} link issue(s) found:\n`)
    for (const e of errors) {
        console.error(`  ✗ ${e}\n`)
    }
    process.exit(1)
} else {
    console.log(
        `OK: no link issues found across ${allFiles.length} content file(s).`,
    )
}
