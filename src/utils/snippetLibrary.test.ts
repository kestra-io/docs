import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

// Enforces the catalog invariants from CONTENT_REUSE.md: every snippet is
// cataloged, every cataloged snippet exists, and every snippet has at least
// one consumer page (an orphan snippet is dead weight nobody can trust).

const SNIPPETS_DIR = path.resolve("src/contents/docs/_snippets")
const DOCS_DIR = path.resolve("src/contents/docs")

function walk(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name)
        return entry.isDirectory() ? walk(full) : [full]
    })
}

const snippetFiles = walk(SNIPPETS_DIR)
    .map((f) => path.relative(SNIPPETS_DIR, f))
    .filter((f) => f !== "README.md")

const docPages = walk(DOCS_DIR).filter(
    (f) => /\.mdx?$/.test(f) && !f.startsWith(SNIPPETS_DIR + path.sep),
)
const docsContent = docPages.map((f) => fs.readFileSync(f, "utf8")).join("\n")

const catalog = fs.readFileSync(path.join(SNIPPETS_DIR, "README.md"), "utf8")

describe("snippet library integrity", () => {
    it("has at least one snippet (sanity)", () => {
        expect(snippetFiles.length).toBeGreaterThan(0)
    })

    it.each(snippetFiles)("%s has a catalog entry in _snippets/README.md", (file) => {
        expect(catalog).toContain(`\`${file}\``)
    })

    it.each(snippetFiles)("%s has at least one consumer page", (file) => {
        const consumerRef = file.endsWith(".md")
            ? `::snippet{name="${file.replace(/\.md$/, "")}"}`
            : `file=src/contents/docs/_snippets/${file}`
        expect(docsContent, `no page consumes ${file} via ${consumerRef}`).toContain(consumerRef)
    })

    it("every ::snippet reference in the docs resolves to a snippet file", () => {
        const refs = [...docsContent.matchAll(/::snippet\{name="([^"]+)"\}/g)].map((m) => m[1])
        expect(refs.length).toBeGreaterThan(0)
        for (const name of refs) {
            const file = path.join(SNIPPETS_DIR, `${name}.md`)
            expect(fs.existsSync(file), `::snippet{name="${name}"} has no file at ${file}`).toBe(true)
        }
    })

    it("every catalogued snippet path in README points to a real file", () => {
        const cataloged = [...catalog.matchAll(/\| `([^`]+\.(?:md|sh|ya?ml))` \|/g)].map((m) => m[1])
        expect(cataloged.length).toBeGreaterThan(0)
        for (const file of cataloged) {
            expect(
                fs.existsSync(path.join(SNIPPETS_DIR, file)),
                `catalog lists ${file} but the file does not exist`,
            ).toBe(true)
        }
    })

    it("snippet markdown uses site-absolute links, never relative ones", () => {
        for (const file of snippetFiles.filter((f) => f.endsWith(".md"))) {
            const body = fs.readFileSync(path.join(SNIPPETS_DIR, file), "utf8")
            const relativeLinks = [...body.matchAll(/\]\((\.\.?\/[^)]*)\)/g)].map((m) => m[1])
            expect(relativeLinks, `${file} contains relative links: ${relativeLinks}`).toEqual([])
        }
    })
})
