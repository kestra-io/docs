export default function generateId({ entry }: { entry: string }) {
    return entry === "index.md" ? "<index>" : entry
        .replace(/\.md$/, '')
        .replace(/^\d+\./, '')
        .replace(/\/\d+\./g, '/')
        .replace(/\/index$/, '');
}