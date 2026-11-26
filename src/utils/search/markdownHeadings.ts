const MAX_HEADINGS = 12

const plainText = (markdown: string) =>
    markdown
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[*_`]/g, "")
        .trim()

export const markdownHeadings = (body = "") =>
    [...body.matchAll(/^##\s+(.+)$/gm)]
        .map((match) => plainText(match[1]))
        .slice(0, MAX_HEADINGS)
