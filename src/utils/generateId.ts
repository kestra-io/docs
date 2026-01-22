export default function generateId({ entry }: { entry: string }) {
    const entryPath = entry.startsWith("../docs") ? entry.slice(7) : entry
    return entryPath === "index.md" || entryPath === "index.mdx"
        ? "<index>"
        : entryPath
              .replace(/\.mdx?$/, "")
              .replace(/^\d+\./, "")
              .replace(/\/\d+\./g, "/")
              .replace(/\/index$/, "")
}