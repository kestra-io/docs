import { readFileSync } from "node:fs"
import type { Link, Parent, PhrasingContent, Root, Text } from "mdast"
import type { Plugin } from "unified"
import { SKIP, visit } from "unist-util-visit"
import type { VFile } from "vfile"

const GLOSSARY_URL = "/docs/glossary"
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
const SPAN = /<span id="([^"]+)"><\/span>/g
// Not inside a word, a hyphenated identifier (task-runner) or a dotted or slashed name (values.yaml, worker.running.count).
const BEFORE = "(?<![\\p{L}\\p{N}_-]|[\\p{L}\\p{N}][./])"
const AFTER = "(?![\\p{L}\\p{N}_-]|[./][\\p{L}\\p{N}])"
// Bare words used as often for other products' contexts, events and apps; "execution context" and "external events" still link.
const AMBIGUOUS_ALIASES = new Set(["context", "contexts", "event", "events", "app"])
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

// "Slack app" or "Kubernetes instance" is another product's noun; a sentence-initial "The task" and "Kestra instance" are not.
const OTHER_PRODUCT_BEFORE = /[^.!?:\s]\s+([A-Z][\w.-]*)\s+$/
const PREVIOUS_WORD = /([\p{L}\p{N}_-]+)\s+$/u
const NEXT_WORD = /^\s+([\p{L}\p{N}_-]+)/u
const EXCLUDED_PHRASES = new Set([
    "for instance",
    "spot instance",
    "spot instances",
    "compute instance",
    "compute instances",
    "service instance",
    "service instances",
    "instance id",
    "instance ids",
    "high concurrency",
])

const isOtherSense = (before: string, word: string, after: string) => {
    const product = OTHER_PRODUCT_BEFORE.exec(before)?.[1]
    if (product && product !== "Kestra") return true
    const previous = PREVIOUS_WORD.exec(before)?.[1]
    const next = NEXT_WORD.exec(after)?.[1]
    return [previous && `${previous} ${word}`, next && `${word} ${next}`].some(
        (phrase) => phrase && EXCLUDED_PHRASES.has(phrase.toLowerCase()),
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
                const key = alias.toLowerCase()
                if (!AMBIGUOUS_ALIASES.has(key)) this.byAlias.set(key, entry)
            }
        }
        const aliases = [...this.byAlias.keys()].sort(
            (a, b) => b.length - a.length,
        )
        this.pattern = new RegExp(
            `${BEFORE}(?:${aliases.map(escapeRegExp).join("|")})${AFTER}`,
            "giu",
        )
    }

    link(node: Text, linked: Set<string>): PhrasingContent[] | undefined {
        const out: PhrasingContent[] = []
        let cursor = 0
        for (const match of node.value.matchAll(this.pattern)) {
            const entry = this.byAlias.get(match[0].toLowerCase())
            if (!entry || linked.has(entry.anchor)) continue
            const end = match.index + match[0].length
            if (isOtherSense(node.value.slice(0, match.index), match[0], node.value.slice(end))) {
                continue
            }
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
                data: { hProperties: { className: ["ks-glossary-link"] } },
                children: [{ type: "text", value: match[0] }],
            }
            out.push(link)
            cursor = end
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

export function checkGlossary(markdown: string, terms: GlossaryTerm[], source: string) {
    if (terms.length === 0) {
        throw new Error(`No glossary entries were found in ${source}; its entry format may have changed.`)
    }
    const spans = new Set([...markdown.matchAll(SPAN)].map((match) => match[1]))
    const missing = terms.filter((entry) => !spans.has(entry.anchor)).map((entry) => entry.anchor)
    if (missing.length > 0) {
        throw new Error(`Glossary entries in ${source} have no matching <span id>: ${missing.join(", ")}.`)
    }
}

// Read once per process, so a glossary edit needs a dev-server restart to reach other pages.
const loadGlossary = (glossaryFile: string) => {
    const markdown = readFileSync(glossaryFile, "utf8")
    const terms = parseGlossary(markdown)
    checkGlossary(markdown, terms, glossaryFile)
    return terms
}

const isTableHeader = (node: { type: string }, index?: number, parent?: Parent) =>
    node.type === "tableRow" && parent?.type === "table" && index === 0

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
