const MAX_HEADINGS = 12

const FENCE = /^ {0,3}(`{3,}|~{3,})/

const plainText = (markdown: string) =>
    markdown
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[*_`]/g, "")
        .trim()

export function markdownHeadings(body = "") {
    const headings: string[] = []
    let fence: string | undefined
    for (const line of body.split("\n")) {
        const marker = line.match(FENCE)?.[1]
        if (marker) {
            if (!fence) fence = marker
            else if (marker[0] === fence[0] && marker.length >= fence.length) {
                fence = undefined
            }
            continue
        }
        const heading = !fence && line.match(/^##\s+(.+)$/)?.[1]
        if (heading) headings.push(plainText(heading))
        if (headings.length === MAX_HEADINGS) break
    }
    return headings
}
