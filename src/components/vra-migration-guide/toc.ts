export interface TocLink {
    text: string
    id: string
    depth: number
}

export interface TocNode {
    id: string
    text: string
    children: TocNode[]
}

const NUMBERED_SUBSECTION = /^\d+\.\d+\.\d+\s/

export function tocLinks(
    headings: { depth: number; slug: string; text: string }[],
): TocLink[] {
    return headings
        .filter(
            (h) =>
                h.depth === 2 ||
                h.depth === 3 ||
                (h.depth === 4 && NUMBERED_SUBSECTION.test(h.text)),
        )
        .map((h) => ({ text: h.text, id: h.slug, depth: h.depth }))
}

export function buildTocTree(links: TocLink[]): TocNode[] {
    const tree: TocNode[] = []
    let group: TocNode | undefined
    let sub: TocNode | undefined
    for (const link of links) {
        const node: TocNode = { id: link.id, text: link.text, children: [] }
        if (link.depth <= 2 || !group) {
            tree.push(node)
            group = node
            sub = undefined
        } else if (link.depth === 3 || !sub) {
            group.children.push(node)
            sub = node
        } else {
            sub.children.push(node)
        }
    }
    return tree
}
