export const fence = (lang: string, code: string) => `\`\`\`${lang}\n${code}\n\`\`\``

const cell = (text: string) => text.replaceAll("|", "\\|")

export const table = (head: readonly string[], rows: readonly (readonly string[])[]) =>
    [
        `| ${head.join(" | ")} |`,
        `| ${head.map(() => "---").join(" | ")} |`,
        ...rows.map((row) => `| ${row.map(cell).join(" | ")} |`),
    ].join("\n")

export const groupedTable = (
    head: readonly string[],
    groups: readonly { title: string; rows: readonly { cells: readonly string[] }[] }[],
) =>
    groups
        .map((group) =>
            [
                group.title ? `**${group.title}**\n` : "",
                table(
                    head,
                    group.rows.map((row) => row.cells),
                ),
            ]
                .filter(Boolean)
                .join("\n"),
        )
        .join("\n\n")
