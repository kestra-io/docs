export default function generateId({ entry }: { entry: string }) {
    return entry === "index.md" || entry === "index.mdx" ? "<index>" : entry
        .replace(/\.mdx?$/, '')
        .replace(/^\d+\./, '')
        .replace(/\/\d+\./g, '/')
        .replace(/\/index$/, '');
}