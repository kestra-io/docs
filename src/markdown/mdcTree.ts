import { Marked, type Token, type Tokens } from "marked"
import { stripFrontmatter } from "~/utils/versionedDocs"

/**
 * Hast-like tree for the MDC markdown dialect used by archived docs, built on
 * `marked` (the renderer the rest of the site already uses).
 */
export interface MdcNode {
    type: string
    tag?: string
    props?: Record<string, unknown>
    children?: MdcNode[]
    value?: string
    /** Pre-rendered Shiki inner HTML for a `pre`, set by the caller. */
    highlightedHtml?: string
}

const element = (
    tag: string,
    props: Record<string, unknown>,
    children: MdcNode[],
): MdcNode => ({ type: "element", tag, props, children })

const textNode = (value: string): MdcNode => ({ type: "text", value })

/** MDC lower-kebab-cases component tags, so `HomePageButtons` → `home-page-buttons`. */
export function kebabCaseTag(tag: string): string {
    return tag.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
}

/**
 * Identity of a component across the forms its name takes — the MDC tag, the
 * JSX tag and the file name. Separator- and case-insensitive because those
 * disagree in practice: `ApiDocee.astro` is imported as `<ApiDocEE/>`, which
 * kebab-cases to `api-doc-ee` but would file-name-match only as `api-docee`.
 */
export function componentKey(name: string): string {
    return name.replace(/[-_]/g, "").toLowerCase()
}

const NAMED_ENTITIES: Record<string, string> = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    hellip: "…", mdash: "—", ndash: "–", rsquo: "’",
    lsquo: "‘", ldquo: "“", rdquo: "”", copy: "©",
}

// The serializer escapes every text node, so entities have to be decoded on the
// way in or `&amp;` in the source would reach the page as `&amp;amp;`.
const ENTITY = /&(#\d+|#[xX][0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g

function decodeEntities(value: string): string {
    return value.replace(ENTITY, (match, ref: string) => {
        if (ref[0] !== "#") return NAMED_ENTITIES[ref] ?? match
        const code =
            ref[1] === "x" || ref[1] === "X"
                ? Number.parseInt(ref.slice(2), 16)
                : Number.parseInt(ref.slice(1), 10)
        return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : match
    })
}

// `{type="warning" .cls #id :buttons='json' flag}` — MDC's attribute block, with
// the class/id shorthands and v-bind (`:`) props both dialects allow.
const MDC_PROP =
    /\.([A-Za-z][\w-]*)|#([A-Za-z][\w-]*)|([:@]?[A-Za-z_][\w.:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s}]+)))?/g

function parseMdcProps(raw: string | undefined): Record<string, unknown> {
    const props: Record<string, unknown> = {}
    if (!raw) return props
    const classes: string[] = []
    for (const match of raw.slice(1, -1).matchAll(MDC_PROP)) {
        if (match[1]) {
            classes.push(match[1])
            continue
        }
        if (match[2]) {
            props.id = match[2]
            continue
        }
        const value = match[4] ?? match[5] ?? match[6]
        props[match[3]] = value === undefined ? true : decodeEntities(value)
    }
    if (classes.length) props.className = classes
    return props
}

const VOID_HTML = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
])

const HTML_TOKEN =
    /<!--[\s\S]*?-->|<\/([A-Za-z][\w:.-]*)\s*>|<([A-Za-z][\w:.-]*)((?:\s+[^\s"'=<>/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g
const HTML_ATTR =
    /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

function parseHtmlAttrs(raw: string | undefined): Record<string, unknown> {
    const props: Record<string, unknown> = {}
    if (!raw?.trim()) return props
    for (const match of raw.matchAll(HTML_ATTR)) {
        const name =
            match[1] === "class" ? "className" : match[1] === "for" ? "htmlFor" : match[1]
        const value = match[2] ?? match[3] ?? match[4]
        props[name] = value === undefined ? true : decodeEntities(value)
    }
    return props
}

/** Push a text node, dropping the empty slices between adjacent tags. */
function pushText(stack: MdcNode[], value: string): void {
    if (value) stack[stack.length - 1].children!.push(textNode(decodeEntities(value)))
}

function closeTag(stack: MdcNode[], tag: string): void {
    for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) {
            stack.length = i
            return
        }
    }
}

/**
 * Fold a raw-HTML chunk into the node stack. Markdown interleaves HTML with
 * markdown blocks, so open and close tags routinely land in different tokens
 * (a `<div>` wrapper around real markdown); one shared stack keeps them nested.
 */
function feedHtml(chunk: string, stack: MdcNode[]): void {
    let last = 0
    HTML_TOKEN.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = HTML_TOKEN.exec(chunk))) {
        pushText(stack, chunk.slice(last, match.index))
        last = match.index + match[0].length
        if (match[0].startsWith("<!--")) continue
        if (match[1]) {
            closeTag(stack, kebabCaseTag(match[1]))
            continue
        }
        const tag = kebabCaseTag(match[2])
        const node = element(tag, parseHtmlAttrs(match[3]), [])
        stack[stack.length - 1].children!.push(node)
        if (!match[4] && !VOID_HTML.has(tag)) stack.push(node)
    }
    pushText(stack, chunk.slice(last))
}

interface MdcToken extends Tokens.Generic {
    tag: string
    props: Record<string, unknown>
}

const MDC_BLOCK_OPEN = /^(:{2,})([A-Za-z][A-Za-z0-9-]*)[ \t]*(\{[^\n]*\})?[ \t]*(?:\r?\n|$)/
const MDC_INLINE = /^:([A-Za-z][A-Za-z0-9-]*)(?:\[([^\]]*)\])?(\{[^\n}]*\})?/

/**
 * Find the fence closing an MDC block, tracking same-length openers so a nested
 * component doesn't end its parent. Returns the body and the consumed length,
 * or null when the block never closes (a leaf directive like `::badge{...}`).
 */
function scanMdcBlock(rest: string, fence: string): { body: string; length: number } | null {
    const lines = rest.split("\n")
    const closing = new RegExp(`^${fence}[ \\t]*\\r?$`)
    const opening = new RegExp(`^${fence}[A-Za-z]`)
    let depth = 0
    let consumed = 0
    for (const [index, line] of lines.entries()) {
        if (closing.test(line)) {
            if (depth === 0) {
                return { body: lines.slice(0, index).join("\n"), length: consumed + line.length + 1 }
            }
            depth--
        } else if (opening.test(line)) {
            depth++
        }
        consumed += line.length + 1
    }
    return null
}

let marked: Marked | undefined

function getMdcMarked(): Marked {
    if (marked) return marked
    marked = new Marked({ gfm: true })
    marked.use({
        extensions: [
            {
                name: "mdcBlock",
                level: "block",
                start: (src: string) => src.match(/^:{2,}[A-Za-z]/m)?.index,
                tokenizer(src: string) {
                    const open = MDC_BLOCK_OPEN.exec(src)
                    if (!open) return undefined
                    const block = scanMdcBlock(src.slice(open[0].length), open[1])
                    return {
                        type: "mdcBlock",
                        raw: src.slice(0, open[0].length + (block?.length ?? 0)),
                        tag: kebabCaseTag(open[2]),
                        props: parseMdcProps(open[3]),
                        tokens: block?.body ? this.lexer.blockTokens(block.body, []) : [],
                    } satisfies MdcToken
                },
                renderer: () => "",
            },
            {
                name: "mdcInline",
                level: "inline",
                // Only after a non-word char, so `https://` and `10:30` stay text.
                start: (src: string) => {
                    const match = src.match(/(^|[^A-Za-z0-9])(:[A-Za-z])/)
                    return match === undefined || match === null
                        ? undefined
                        : match.index! + match[1].length
                },
                tokenizer(src: string) {
                    const match = MDC_INLINE.exec(src)
                    if (!match) return undefined
                    return {
                        type: "mdcInline",
                        raw: match[0],
                        tag: kebabCaseTag(match[1]),
                        props: parseMdcProps(match[3]),
                        tokens: match[2] ? this.lexer.inlineTokens(match[2], []) : [],
                    } satisfies MdcToken
                },
                renderer: () => "",
            },
        ],
    })
    return marked
}

/** Assemble a token list into nodes, threading raw HTML through a shared stack. */
function assemble(tokens: Token[] | undefined): MdcNode[] {
    const root: MdcNode = { type: "root", children: [] }
    const stack = [root]
    for (const token of tokens ?? []) {
        if (token.type === "html") {
            feedHtml((token as Tokens.HTML).text, stack)
            continue
        }
        stack[stack.length - 1].children!.push(...convert(token))
    }
    return root.children!
}

function cellNodes(cell: Tokens.TableCell, tag: string): MdcNode {
    return element(tag, cell.align ? { align: cell.align } : {}, assemble(cell.tokens))
}

function listItemNodes(item: Tokens.ListItem): MdcNode {
    const children = assemble(item.tokens)
    if (!item.task) return element("li", {}, children)
    const checkbox = element(
        "input",
        { type: "checkbox", disabled: true, ...(item.checked ? { checked: true } : {}) },
        [],
    )
    return element("li", { className: "task-list-item" }, [checkbox, textNode(" "), ...children])
}

function convert(token: Token): MdcNode[] {
    const any = token as Tokens.Generic
    switch (token.type) {
        case "space":
        case "def":
            return []
        case "hr":
            return [element("hr", {}, [])]
        case "heading":
            return [element(`h${(token as Tokens.Heading).depth}`, {}, assemble(any.tokens))]
        case "paragraph":
            return [element("p", {}, assemble(any.tokens))]
        case "blockquote":
            return [element("blockquote", {}, assemble(any.tokens))]
        case "text":
            return any.tokens
                ? assemble(any.tokens)
                : [textNode(decodeEntities(any.text as string))]
        case "escape":
            return [textNode(any.text as string)]
        case "codespan":
            return [element("code", {}, [textNode(decodeEntities(any.text as string))])]
        case "code": {
            const code = token as Tokens.Code
            // `lang` carries the whole info string ("yaml title=…"); the fence's
            // language is its first word, defaulting to text like MDC's did.
            const language = (code.lang ?? "").trim().split(/\s+/)[0] || "text"
            return [
                element("pre", { code: `${code.text}\n`, language }, [
                    element("code", {}, [textNode(code.text)]),
                ]),
            ]
        }
        case "list": {
            const list = token as Tokens.List
            const props: Record<string, unknown> =
                list.ordered && list.start && list.start !== 1 ? { start: list.start } : {}
            return [
                element(list.ordered ? "ol" : "ul", props, list.items.map(listItemNodes)),
            ]
        }
        case "table": {
            const table = token as Tokens.Table
            return [
                element("table", {}, [
                    element("thead", {}, [
                        element("tr", {}, table.header.map((c) => cellNodes(c, "th"))),
                    ]),
                    element(
                        "tbody",
                        {},
                        table.rows.map((row) =>
                            element("tr", {}, row.map((c) => cellNodes(c, "td"))),
                        ),
                    ),
                ]),
            ]
        }
        case "strong":
        case "em":
        case "del":
            return [element(token.type, {}, assemble(any.tokens))]
        case "br":
            return [element("br", {}, [])]
        case "link": {
            const link = token as Tokens.Link
            return [
                element(
                    "a",
                    { href: link.href, ...(link.title ? { title: link.title } : {}) },
                    assemble(link.tokens),
                ),
            ]
        }
        case "image": {
            const image = token as Tokens.Image
            return [
                element(
                    "img",
                    {
                        src: image.href,
                        alt: image.text ?? "",
                        ...(image.title ? { title: image.title } : {}),
                    },
                    [],
                ),
            ]
        }
        case "mdcBlock":
        case "mdcInline": {
            const mdc = token as MdcToken
            return [element(mdc.tag, mdc.props, assemble(mdc.tokens))]
        }
        default:
            if (any.tokens) return assemble(any.tokens)
            return typeof any.text === "string" ? [textNode(decodeEntities(any.text))] : []
    }
}

/** Parse an MDC-dialect markdown document (frontmatter stripped) into a node tree. */
export function parseMdcDocument(markdown: string): MdcNode {
    const tokens = getMdcMarked().lexer(stripFrontmatter(markdown))
    return { type: "root", children: assemble(tokens) }
}
