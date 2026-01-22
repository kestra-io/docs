export function NextLink(data, _attributes, node, _file) {
    const children = node.children || []
    data.hName = "div"
    data.hProperties = {
        class: ["text-end mt-3 mb-3 ks-doc-next-link"],
    }
    node.children = [
        {
            type: "element",
            data: {
                hName: "div",
                hProperties: {
                    class: ["btn btn-outline-primary btn-chevron-right"],
                },
            },
            children,
        },
    ]
}