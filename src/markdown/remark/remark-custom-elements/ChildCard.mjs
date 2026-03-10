import generateId from "../../../utils/generateId"
import * as fs from "node:fs"
import * as path from "node:path"

const getFrontmatter = (markdown) => {
    const charactersBetweenGroupedHyphens = /^---([\s\S]*?)---/
    const metadataMatched = markdown.match(charactersBetweenGroupedHyphens)
    const metadata = metadataMatched[1]
    const content = markdown.slice(
        (metadataMatched.index ?? 0) + (metadataMatched[0]?.length ?? 0),
    )

    const lines = content.split("\n")
    const firstNonBlankLine = lines.find((line) => line.trim().length > 0)
    const defaultMetadata = {}
    if (firstNonBlankLine) {
        if (firstNonBlankLine.startsWith("# ")) {
            defaultMetadata.title = firstNonBlankLine.replace(/^# /, "").trim()
        } else {
            defaultMetadata.description = firstNonBlankLine
                .replace(/^#+ /, "")
                .trim()
        }
    }

    if (!metadata) {
        return defaultMetadata
    }

    const metadataLines = metadata.split("\n")
    const metadataObject = metadataLines.reduce((accumulator, line) => {
        const [key, ...value] = line.split(":").map((part) => part.trim())

        if (key) accumulator[key] = value[1] ? value.join(":") : value.join("")
        return accumulator
    }, {})

    Object.assign(metadataObject, defaultMetadata)

    return metadataObject
}

export function ChildCard(data, _attributes, node, file) {
    const directory = path.dirname(file.history[0])
    const unfilteredFiles = fs.readdirSync(directory)

    // if unfilteredFiles are directories,
    // resolve they index.md or index.mdx file if they exist
    const resolvedFiles = unfilteredFiles.map((f) => {
        const fullPath = path.join(directory, f)
        if (fs.statSync(fullPath).isDirectory()) {
            const indexMd = path.join(fullPath, "index.md")
            const indexMdx = path.join(fullPath, "index.mdx")
            if (fs.existsSync(indexMd)) {
                return path.join(f, "index.md")
            } else if (fs.existsSync(indexMdx)) {
                return path.join(f, "index.mdx")
            }
        }
        return f
    })

    const files = resolvedFiles.filter(
        (f) =>
            (f.endsWith(".md") || f.endsWith(".mdx")) &&
            f !== path.basename(file.history[0]),
    )
    const richFiles = files.map((f) => ({
        entry: f,
        data: getFrontmatter(fs.readFileSync(path.join(directory, f), "utf-8")),
    }))
    const currentDir = path.basename(directory)
    data.hName = "div"
    data.hProperties = { class: "ks-card-grid" }
    node.children = richFiles.map((richFile) => ({
        type: "element",
        data: {
            hName: "a",
            hProperties: {
                class: "ks-card",
                href: generateId({
                    entry: `./${currentDir}/${richFile.entry}`,
                }),
            },
        },
        children: [
            {
                type: "element",
                data: {
                    hName: "div",
                    hProperties: {
                        class: "ks-card-title",
                    },
                },
                children: [
                    {
                        type: "text",
                        value:
                            richFile.data.title ??
                            richFile.entry.replace(/\.mdx?$/, ""),
                    },
                ],
            },
            {
                type: "element",
                data: {
                    hName: "p",
                    hProperties: {
                        class: "ks-card-text",
                    },
                },
                children: [
                    {
                        type: "text",
                        value: richFile.data.description ?? "",
                    },
                ],
            },
        ],
    }))
}
