// Plain markdown from the guide's MDX, for the /resources/migration/vra.md
// endpoint. The body keeps its prose, lists and tables; the component
// wrappers around them are dropped, a `title` or `label` on a wrapper becomes
// a bold line, and the calculators become a line pointing to the web page.

const JSX_TAG =
    /<\/?([A-Z][A-Za-z0-9.]*)((?:\s+[A-Za-z:-]+(?:=(?:"[^"]*"|'[^']*'|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}))?)*)\s*\/?>/g

const ATTRIBUTE = (name: string) => new RegExp(`\\s${name}="([^"]*)"`)

export function mdxToMarkdown(
    body: string,
    replacements: Record<string, string> = {},
): string {
    return (
        body
            .replace(/^(?:import|export)\s.*$/gm, "")
            .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
            .replace(/<\/?Fragment(?:\s[^>]*)?>/g, "")
            .replace(JSX_TAG, (tag, name: string, attributes: string) => {
                if (name in replacements) return replacements[name]
                if (tag.startsWith("</")) return ""
                const heading =
                    ATTRIBUTE("title").exec(attributes)?.[1] ??
                    ATTRIBUTE("label").exec(attributes)?.[1]
                return heading ? `**${heading}**` : ""
            })
            .replace(/<a href="([^"]+)">([^<]*)<\/a>/g, "[$2]($1)")
            .replace(/\n{3,}/g, "\n\n")
            .trim() + "\n"
    )
}
