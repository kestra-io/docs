import { readFileSync } from "node:fs"
import type { Link, Parent, PhrasingContent, Root, Text } from "mdast"
import type { Plugin } from "unified"
import { SKIP, visit } from "unist-util-visit"
import type { VFile } from "vfile"

export const GLOSSARY_URL = "/docs/glossary"
const DOCS_ROOT = "/src/contents/docs/"
const GLOSSARY_FILE = "glossary/index.md"

export interface GlossaryTerm {
    term: string
    anchor: string
    definition: string
}

interface Options {
    terms?: GlossaryTerm[]
}

const ENTRY = /^\s*- \[([^\]]+)\]\(#([^)]+)\)\s+-\s+(.*)$/
// A term is not a match inside a longer word or a hyphenated identifier (task-runner).
const BOUNDARY = "[\\p{L}\\p{N}_-]"
const SKIPPED_TYPES = new Set([
    "code",
    "inlineCode",
    "heading",
    "link",
    "linkReference",
    "definition",
    "html",
    "image",
    "imageReference",
    "yaml",
    "toml",
    "mdxjsEsm",
    "mdxFlowExpression",
    "mdxTextExpression",
    "mdxJsxTextElement",
])

const plainText = (markdown: string) =>
    markdown
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[`*_]/g, "")
        .trim()

const firstSentence = (text: string) =>
    /^(.+?[.!?])\s+(?=[A-Z])/.exec(text)?.[1] ?? text

export function parseGlossary(markdown: string): GlossaryTerm[] {
    const terms: GlossaryTerm[] = []
    for (const line of markdown.split("\n")) {
        const match = ENTRY.exec(line)
        if (!match) continue
        const [, term, anchor, definition] = match
        terms.push({
            term,
            anchor,
            definition: firstSentence(plainText(definition)),
        })
    }
    return terms
}

// "Time To Live (TTL)" and "Assets & Lineage" each name two things; both spellings link to the entry.
const spellings = (term: string): string[] => {
    const parts = term
        .split(/\s*&\s*|\s*\(|\)\s*/)
        .map((part) => part.trim())
        .filter((part) => part.length > 1)
    return parts.flatMap((part) =>
        /[^s]s$/i.test(part) ? [part, part.slice(0, -1)] : [part, `${part}s`],
    )
}

const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

class Matcher {
    private readonly pattern: RegExp
    private readonly byAlias = new Map<string, GlossaryTerm>()

    constructor(terms: GlossaryTerm[]) {
        for (const entry of terms) {
            for (const alias of spellings(entry.term)) {
                this.byAlias.set(alias.toLowerCase(), entry)
            }
        }
        const aliases = [...this.byAlias.keys()].sort(
            (a, b) => b.length - a.length,
        )
        this.pattern = new RegExp(
            `(?<!${BOUNDARY})(?:${aliases.map(escapeRegExp).join("|")})(?!${BOUNDARY})`,
            "giu",
        )
    }

    link(node: Text, linked: Set<string>): PhrasingContent[] | undefined {
        const out: PhrasingContent[] = []
        let cursor = 0
        for (const match of node.value.matchAll(this.pattern)) {
            const entry = this.byAlias.get(match[0].toLowerCase())
            if (!entry || linked.has(entry.anchor)) continue
            linked.add(entry.anchor)
            if (match.index > cursor) {
                out.push({
                    type: "text",
                    value: node.value.slice(cursor, match.index),
                })
            }
            const link: Link = {
                type: "link",
                url: `${GLOSSARY_URL}#${entry.anchor}`,
                title: entry.definition,
                children: [{ type: "text", value: match[0] }],
            }
            out.push(link)
            cursor = match.index + match[0].length
        }
        if (out.length === 0) return undefined
        if (cursor < node.value.length) {
            out.push({ type: "text", value: node.value.slice(cursor) })
        }
        return out
    }
}

const normalizedPath = (file: VFile) => (file.path ?? "").replaceAll("\\", "/")

// Resolved from the page being rendered rather than from import.meta.url, which Vite rewrites when it bundles the config.
const glossaryFileFor = (file: VFile) => {
    const path = normalizedPath(file)
    const root = path.indexOf(DOCS_ROOT)
    if (root < 0) return undefined
    const glossary = path.slice(0, root + DOCS_ROOT.length) + GLOSSARY_FILE
    return path === glossary ? undefined : glossary
}

const loadGlossary = (glossaryFile: string) => {
    const terms = parseGlossary(readFileSync(glossaryFile, "utf8"))
    if (terms.length === 0) {
        throw new Error(`No glossary entries were found in ${glossaryFile}; its entry format may have changed.`)
    }
    return terms
}

const isTableHeader = (node: { type: string }, index?: number, parent?: Parent) =>
    "tableRow" === node.type && "table" === parent?.type && 0 === index

/** Links the first occurrence of each glossary term on a docs page; headings, code, links and table headers are left alone. */
const remarkGlossaryLinks: Plugin<[Options?], Root> = (options = {}) => {
    const matchers = new Map<string, Matcher>()
    return (tree, file) => {
        const glossaryFile = glossaryFileFor(file)
        if (!glossaryFile) return
        let matcher = matchers.get(glossaryFile)
        if (!matcher) {
            matcher = new Matcher(options.terms ?? loadGlossary(glossaryFile))
            matchers.set(glossaryFile, matcher)
        }
        const linked = new Set<string>()
        visit(tree, (node, index, parent) => {
            if (SKIPPED_TYPES.has(node.type) || isTableHeader(node, index, parent)) {
                return SKIP
            }
            if (node.type !== "text" || !parent || index === undefined) return
            const replacement = matcher.link(node, linked)
            if (!replacement) return
            parent.children.splice(index, 1, ...replacement)
            return index + replacement.length
        })
    }
}

export default remarkGlossaryLinks
