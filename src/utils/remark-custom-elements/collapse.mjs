export function collapse(data, attributes, node) {
    data.hName = "details"
    const summaryText = attributes.title ?? "Details"
    data.hProperties = { class: "doc-collapse" }
    node.children = [
        {
            type: "summary",
            data: {
                hName: "summary",
                hProperties: {},
            },
            children: [{ type: "text", value: summaryText }],
        },
        ...(node.children ?? []),
    ]
}