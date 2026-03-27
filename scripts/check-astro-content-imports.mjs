// @ts-check
// oxlint-disable no-console
/**
 * Checks that no non-prerendered page (or any of its dependencies) imports
 * runtime values from "astro:content". Such imports cause Astro to bundle all
 * collection data into a .mjs file for runtime, which is undesirable.
 *
 * Only `import type { ... } from "astro:content"` is allowed.
 *
 * Usage: node scripts/check-astro-content-imports.mjs
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const srcDir = path.join(rootDir, "src")
const pagesDir = path.join(srcDir, "pages")

/**
 * All ~/something paths resolve under src/
 * @param {string} importPath
 */
function resolveAlias(importPath) {
    if (importPath.startsWith("~/")) {
        return path.join(srcDir, importPath.slice(2))
    }
    return null
}

/**
 * Resolve an import specifier to an absolute file path, or null if it cannot
 * be resolved (e.g. node_modules, virtual modules like "astro:content").
 * @param {string} specifier
 * @param {string} fromFile
 */
function resolveImport(specifier, fromFile) {
    // Virtual modules, bare specifiers (node_modules), and data URIs — skip
    if (!specifier.startsWith(".") && !specifier.startsWith("~/")) {
        return null
    }

    const base =
        resolveAlias(specifier) ??
        path.resolve(path.dirname(fromFile), specifier)

    // Try the path as-is first, then with common extensions
    const candidates = [
        base,
        ...["ts", "js", "mjs", "cjs", "astro", "vue", "tsx", "jsx"].map(
            (ext) => `${base}.${ext}`,
        ),
        // Also try index files for directory imports
        ...["ts", "js", "mjs", "astro"].map((ext) =>
            path.join(base, `index.${ext}`),
        ),
    ]

    for (const candidate of candidates) {
        try {
            const stat = fs.statSync(candidate)
            if (stat.isFile()) return candidate
        } catch {
            // not found, try next
        }
    }

    return null
}

/**
 * Extract the portion of a file that may contain import statements.
 * - .astro  → frontmatter only (between the two --- fences)
 * - .vue    → content of <script> and <script setup> blocks
 * - others  → full file
 * @param {string} filePath
 * @param {string} raw  Full file content
 * @returns {string}    Script content to scan for imports
 */
function extractScriptContent(filePath, raw) {
    if (filePath.endsWith(".astro")) {
        const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
        return m ? m[1] : ""
    }

    if (filePath.endsWith(".vue")) {
        const blocks = []
        const re = /<script(\s[^>]*)?>(\s*[\s\S]*?)<\/script[^>]*>/gi
        let m
        while ((m = re.exec(raw)) !== null) {
            blocks.push(m[2])
        }
        return blocks.join("\n")
    }

    return raw
}

/**
 * Return all import/export-from specifiers found in a script content string,
 * together with the full statement text (for type-import detection).
 *
 * Handles multi-line imports such as:
 *   import {
 *     getCollection,
 *   } from "astro:content"
 *
 * @param {string} content
 */
function findImportSpecifiers(content) {
    const results = []

    // Matches: import ... from "specifier"
    // The [^;]* handles multi-line import lists without crossing statement
    // boundaries (semicolons), preventing greedy over-matching.
    const importRe = /\bimport\s+([^;]*?)\bfrom\s+["']([^"']+)["']/g
    let m
    while ((m = importRe.exec(content)) !== null) {
        results.push({ specifier: m[2], statement: m[0] })
    }

    // Matches re-exports: export { ... } from "specifier"
    const reExportRe = /\bexport\s+\{[^}]*\}\s*from\s+["']([^"']+)["']/g
    while ((m = reExportRe.exec(content)) !== null) {
        results.push({ specifier: m[1], statement: m[0] })
    }

    // Also match side-effect imports: import "specifier"
    const sideEffect = /\bimport\s+["']([^"']+)["']/g
    while ((m = sideEffect.exec(content)) !== null) {
        results.push({ specifier: m[1], statement: m[0] })
    }

    return results
}

/**
 * Returns true if the import statement is a pure type import, i.e.
 * `import type { … } from "…"` — these have no runtime effect and are safe.
 *
 * Note: `import { type Foo } from "…"` (inline type modifier) still triggers
 * module evaluation in some bundlers, so we treat it conservatively as a
 * potential runtime import.
 * @param {string} statement  Full import statement text
 */
function isTypeOnlyImport(statement) {
    return /^\s*import\s+type[\s{*]/.test(statement)
}

// ─── Traversal ────────────────────────────────────────────────────────────────

/** Files already fully explored (avoid re-checking shared dependencies). */
const visited = new Set()

let hasWarnings = false

/**
 * Recursively check a file and all its local dependencies.
 * @param {string} filePath  Absolute path to the file being checked.
 * @param {string[]} chain   Import chain leading to this file (for reporting).
 */
function checkFile(filePath, chain) {
    if (visited.has(filePath)) return
    visited.add(filePath)

    let raw
    try {
        raw = fs.readFileSync(filePath, "utf-8")
    } catch {
        return // unreadable — skip silently
    }

    const content = extractScriptContent(filePath, raw)
    const imports = findImportSpecifiers(content)

    for (const { specifier, statement } of imports) {
        if (specifier === "astro:content") {
            if (!isTypeOnlyImport(statement)) {
                const fullChain = [...chain, filePath]
                    .map((f) => path.relative(rootDir, f))
                    .join("\n      → ")
                console.warn(
                    `WARNING: non-type import from "astro:content" detected`,
                )
                console.warn(`  via: ${fullChain}`)
                console.warn(`  import: ${statement.trim()}\n`)
                hasWarnings = true
            }
            // Either way, don't try to resolve "astro:content" as a file
            continue
        }

        const resolved = resolveImport(specifier, filePath)
        if (resolved) {
            checkFile(resolved, [...chain, filePath])
        }
    }
}

// ─── Entry point ─────────────────────────────────────────────────────────────
/**
 *
 * @param {string} dir
 * @returns {string[]}  List of page file paths
 */
function collectPages(dir) {
    const pages = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            pages.push(...collectPages(full))
        } else if (/\.(astro|ts|js|mjs)$/.test(entry.name)) {
            pages.push(full)
        }
    }
    return pages
}
/**
 * Returns true if the given page file explicitly opts out of prerendering via
 * `export const prerender = false`, meaning that runtime imports from
 * "astro:content" are allowed.
 * @param {string} filePath
 * @returns {boolean}  True if the page is not prerendered.
 */
function isNotPrerendered(filePath) {
    try {
        const raw = fs.readFileSync(filePath, "utf-8")
        return /export\s+const\s+prerender\s*=\s*false/.test(raw)
    } catch {
        return false
    }
}

const pages = collectPages(pagesDir).filter(isNotPrerendered)

console.log(
    `Scanning ${pages.length} non-prerendered page(s) in src/pages and their dependencies…\n`,
)

for (const page of pages) {
    checkFile(page, [])
}

if (hasWarnings) {
    console.error(
        `\nFAIL: non-type import(s) from "astro:content" found in non-prerendered pages.\n` +
            `      Replace them with "import type { … }" or move them to prerendered pages.`,
    )
    process.exit(1)
} else {
    console.log(
        `OK: no non-type imports from "astro:content" found in src/pages or their dependencies.`,
    )
}
