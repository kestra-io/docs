import fs from "node:fs"
import path from "node:path"
import { visit, SKIP } from "unist-util-visit"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkDirective from "remark-directive"
import type { Root, Parent } from "mdast"

export type SnippetOptions = {
    /** Directory holding snippet .md files. Defaults to src/contents/docs/_snippets. */
    snippetsDir?: string
}

// Snippets may include other snippets, but a chain deeper than this is
// almost certainly an accidental cycle.
const MAX_DEPTH = 3

const NAME_PATTERN = /^[a-z0-9][a-z0-9/_-]*$/

/**
 * Expands `::snippet{name="..."}` leaf directives by parsing the referenced
 * Markdown file from the snippets directory and splicing its content into the
 * tree, so downstream plugins (custom elements, code import, link rewrite)
 * process snippet content exactly like page content.
 *
 * Fails the build on unknown or malformed snippet references so broken
 * includes never render as literal directive text.
 */
export default function remarkSnippet(options: SnippetOptions = {}) {
    const snippetsDir = path.resolve(options.snippetsDir || "src/contents/docs/_snippets")
    const parser = unified().use(remarkParse).use(remarkGfm).use(remarkDirective)

    function expand(tree: Root, depth: number) {
        visit(tree, "leafDirective", (node: any, index, parent) => {
            if (node.name !== "snippet" || parent === undefined || index === undefined) return

            const name = node.attributes?.name
            if (!name || !NAME_PATTERN.test(name)) {
                throw new Error(
                    `::snippet requires a name attribute matching ${NAME_PATTERN} (got ${JSON.stringify(name)})`,
                )
            }
            if (depth >= MAX_DEPTH) {
                throw new Error(
                    `Snippet "${name}" exceeds the maximum include depth of ${MAX_DEPTH} — check for a snippet cycle`,
                )
            }

            const filePath = path.join(snippetsDir, `${name}.md`)
            if (path.relative(snippetsDir, filePath).startsWith("..")) {
                throw new Error(`Snippet "${name}" resolves outside the snippets directory`)
            }
            if (!fs.existsSync(filePath)) {
                throw new Error(`Snippet "${name}" not found at ${filePath}`)
            }

            const snippetTree = parser.parse(fs.readFileSync(filePath, "utf8")) as Root
            expand(snippetTree, depth + 1)

            ;(parent as Parent).children.splice(index, 1, ...snippetTree.children)
            // Spliced content is already fully expanded; continue after it.
            return [SKIP, index + snippetTree.children.length]
        })
    }

    return (tree: Root) => expand(tree, 0)
}
