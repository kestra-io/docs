// @ts-check
/**
 * Enforces link hygiene across all .md and .mdx files in src/contents/:
 *
 * 1. Absolute internal links — files inside src/contents/docs/ must not use
 *    absolute paths like /docs/some-page. Use relative links instead so that
 *    broken targets are caught at build time rather than surfacing as 404s at
 *    runtime.
 *
 * 2. Broken relative links — relative links that include a .md or .mdx
 *    extension must resolve to a real file on disk.
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

// Absolute-path prefixes that belong to content managed in this repo.
// Links using these in docs pages should be relative links instead.
const INTERNAL_CONTENT_PREFIXES = [
    "/docs/",
    "/blog/",
    "/tutorial-videos/",
    "/customer-stories/",
]

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
    return (
        url.startsWith("/") &&
        INTERNAL_CONTENT_PREFIXES.some((p) => url.startsWith(p))
    )
}

/**
 * True if the URL is a relative link that explicitly references a .md/.mdx
 * file (possibly followed by a fragment). These must resolve to a real file.
 */
function isRelativeMarkdownLink(url) {
    return (
        !url.startsWith("/") &&
        !isExternal(url) &&
        /\.mdx?(?:#[^#]*)?$/.test(url)
    )
}

/** Resolve a relative link URL to an absolute file path. */
function resolveRelativeLink(url, fromFile) {
    const withoutFragment = url.replace(/#.*$/, "")
    const withoutQuery = withoutFragment.split("?")[0]
    return path.resolve(path.dirname(fromFile), withoutQuery)
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

        // Rule 1: docs pages must use relative links, not absolute internal paths.
        if (isDocsFile && isAbsoluteInternalContent(url)) {
            errors.push(
                `${relPath}\n    absolute internal link: "${url}"\n    → convert to a relative path so broken links are caught at build time`,
            )
        }

        // Rule 2: relative .md/.mdx links must point to existing files.
        if (isRelativeMarkdownLink(url)) {
            const resolved = resolveRelativeLink(url, filePath)
            if (!fs.existsSync(resolved)) {
                errors.push(
                    `${relPath}\n    broken relative link: "${url}"\n    → resolves to ${path.relative(rootDir, resolved)} (file not found)`,
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
