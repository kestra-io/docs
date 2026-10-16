// Plain markdown from the guide's MDX, for the /resources/migration/vra.md
// endpoint. The body keeps its prose, lists and tables; the component
// wrappers around them are dropped, and what a wrapper carried in its
// attributes is written back as markdown: a `title`, `label` or `status`
// becomes a bold line, `stats` a list, a `caption` an italic line and a
// `quote` a blockquote after the wrapped content. Named components can be
// replaced outright, for instance the calculators by a line pointing to the
// web page.

export type Attributes = Record<string, string>
export type Replacement = string | ((attributes: Attributes) => string)

export interface MdxToMarkdownOptions {
    /** Component name to what replaces its tag; its closing tag is dropped. */
    replacements?: Record<string, Replacement>
    /** Relative image path, as written in the MDX, to the URL it is served at. */
    images?: Record<string, string>
}

const EXPRESSION = "\\{(?:[^{}]|\\{(?:[^{}]|\\{[^{}]*\\})*\\})*\\}"

const JSX_TAG = new RegExp(
    `<\\/?([A-Z][A-Za-z0-9.]*)((?:\\s+[A-Za-z:-]+(?:=(?:"[^"]*"|'[^']*'|${EXPRESSION}))?)*)\\s*\\/?>`,
    "g",
)

const ATTRIBUTE = new RegExp(
    `([A-Za-z:-]+)(?:=(?:"([^"]*)"|'([^']*)'|(${EXPRESSION})))?`,
    "g",
)

// `[{ value: "30×", label: "faster delivery" }, …]` from a `stats` expression.
const STAT = /value:\s*"([^"]*)",\s*label:\s*"([^"]*)"/g

function parseAttributes(source: string): Attributes {
    const attributes: Attributes = {}
    for (const match of source.matchAll(ATTRIBUTE)) {
        const [, name, double, single, expression] = match
        attributes[name] = double ?? single ?? expression ?? ""
    }
    return attributes
}

// What the opening tag becomes.
function opening(attributes: Attributes): string {
    const lines: string[] = []
    const heading =
        attributes.title ?? attributes.label ?? attributes.status
    if (heading) lines.push(`**${heading}**`)
    if (attributes.stats) {
        const stats = [...attributes.stats.matchAll(STAT)].map(
            ([, value, label]) => `- **${value}** ${label}`,
        )
        if (stats.length > 0) lines.push("", ...stats)
    }
    return lines.join("\n")
}

// What follows the wrapped content, written at the closing tag.
function closing(attributes: Attributes): string {
    const lines: string[] = []
    if (attributes.caption) lines.push(`_${attributes.caption}_`)
    if (attributes.quote) {
        const by = attributes.quoteBy
            ? attributes.storyHref
                ? `[${attributes.quoteBy}](${attributes.storyHref})`
                : attributes.quoteBy
            : ""
        lines.push(`> ${attributes.quote}`, ...(by ? [`> — ${by}`] : []))
    }
    return lines.join("\n")
}

export function mdxToMarkdown(
    body: string,
    { replacements = {}, images = {} }: MdxToMarkdownOptions = {},
): string {
    // Open wrappers, innermost last, so a closing tag can write what its
    // opening tag deferred.
    const open: { name: string; trailer: string }[] = []

    return (
        body
            .replace(/^(?:import|export)\s.*$/gm, "")
            .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
            .replace(/<\/?Fragment(?:\s[^>]*)?>/g, "")
            .replace(/<\/?mark>/g, "")
            .replace(JSX_TAG, (tag, name: string, source: string) => {
                if (tag.startsWith("</")) {
                    if (name in replacements) return ""
                    let trailer = ""
                    while (open.length > 0) {
                        const wrapper = open.pop()!
                        if (wrapper.name === name) {
                            trailer = wrapper.trailer
                            break
                        }
                    }
                    return trailer
                }
                const attributes = parseAttributes(source)
                const selfClosing = tag.endsWith("/>")
                if (name in replacements) {
                    const replacement = replacements[name]
                    return typeof replacement === "function"
                        ? replacement(attributes)
                        : replacement
                }
                if (!selfClosing) {
                    open.push({ name, trailer: closing(attributes) })
                }
                return opening(attributes)
            })
            .replace(/<a href="([^"]+)">([^<]*)<\/a>/g, "[$2]($1)")
            .replace(/\]\((\.\/[^)]+)\)/g, (match, path: string) =>
                path in images ? `](${images[path]})` : match,
            )
            .replace(/\n{3,}/g, "\n\n")
            .trim() + "\n"
    )
}
