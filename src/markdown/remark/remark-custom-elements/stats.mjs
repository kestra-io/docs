// `:::stats` wraps a list of headline numbers: each item's bold text is the
// number and the rest is its label. Styled as `.doc-stats` in markdown.scss.
export function stats(data) {
    data.hName = "div"
    data.hProperties = { class: "doc-stats" }
}
