import type { Nodes, Parent, RootContent } from "mdast"
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { unified } from "unified"
import { SKIP, visit } from "unist-util-visit"

type Attributes = Record<string, string>

interface MdxToMarkdownOptions {
    /** Component name to the markdown that replaces it and its content. */
    replacements?: Record<string, string | ((attributes: Attributes) => string)>
    /** Image path as written in the MDX, to the URL it is served at. */
    images?: Record<string, string>
}

/** A `{ value, label }` entry in a `stats` expression. */
const STAT = /value:\s*"([^"]*)",\s*label:\s*"([^"]*)"/g

/** Markdown written before a wrapper's content. */
function opening({ title, label, status, stats = "" }: Attributes) {
    const heading = title ?? label ?? status
    const items = [...stats.matchAll(STAT)].map(([, v, l]) => `- **${v}** ${l}`)
    return [heading && `**${heading}**`, items.join("\n")]
}

/** Markdown written after a wrapper's content. */
function closing({ caption, quote, quoteBy, storyHref }: Attributes) {
    const by = quoteBy && storyHref ? `[${quoteBy}](${storyHref})` : quoteBy
    return [
        caption && `_${caption}_`,
        quote && `> ${quote}${by ? `\n> — ${by}` : ""}`,
    ]
}

/**
 * Strips the component wrappers from the guide's MDX and writes their `title`,
 * `stats`, `caption` and `quote` attributes back as markdown.
 */
export function mdxToMarkdown(
    body: string,
    { replacements = {}, images = {} }: MdxToMarkdownOptions = {},
): string {
    const processor = unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(remarkGfm, { tablePipeAlign: false })
        .use(remarkStringify, { bullet: "-", emphasis: "_", rule: "-" })
    const tree = processor.parse(body)

    visit(tree, (node: Nodes, index, parent: Parent | undefined) => {
        if (node.type === "image") node.url = images[node.url] ?? node.url
        if (!parent || index === undefined || !node.type.startsWith("mdx"))
            return
        const {
            name,
            attributes = [],
            children = [],
        } = node as Partial<MdxJsxFlowElement | MdxJsxTextElement>
        const props: Attributes = Object.fromEntries(
            attributes.map((a) => [
                "name" in a ? a.name : "",
                typeof a.value === "string" ? a.value : (a.value?.value ?? ""),
            ]),
        )
        const replacement = name ? replacements[name] : undefined
        const html = (value?: string) =>
            value ? [{ type: "html", value } as RootContent] : []
        const nodes = !node.type.startsWith("mdxJsx")
            ? [] // imports and expressions
            : replacement !== undefined
                ? html(
                    typeof replacement === "function"
                        ? replacement(props)
                        : replacement,
                )
                : name === "a"
                    ? [{ type: "link", url: props.href, children } as RootContent]
                    : [
                        ...opening(props).flatMap(html),
                        ...children,
                        ...closing(props).flatMap(html),
                    ]
        parent.children.splice(index, 1, ...nodes)
        return [SKIP, index]
    })

    return (
        processor
            .stringify(tree)
            // Conventional `---` delimiter rows; intraword `_` needs no escape.
            .replace(/^\|[-:| ]+\|$/gm, (row) => row.replace(/-+/g, "---"))
            .replace(/(\w)\\_(?=\w)/g, "$1_")
    )
}
