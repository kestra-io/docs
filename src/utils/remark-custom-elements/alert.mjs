export function alert(data, attributes) {
    const type = attributes.type ?? "info"
    data.hName = "div"
    data.hProperties = {
        class: `doc-alert alert alert-${type}`,
        role: "alert",
    }
}