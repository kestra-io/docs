import path from "node:path"
import generateId from "../../utils/generateId"

type SourceFile = { basename?: string; dirname?: string }

const splitHash = (url: string): [string, string] => {
    const hashIndex = url.indexOf("#")
    return hashIndex === -1 ? [url, ""] : [url.slice(0, hashIndex), url.slice(hashIndex)]
}

/**
 * Resolves a relative markdown link (`./x.md`, `../x/index.md`) written in a
 * docs source file into the path the site serves it at.
 *
 * Page URLs never end with a slash and an `index.md` is served at its
 * directory's URL, which two cases of the naive resolution got wrong:
 * `./index.md` from a leaf file and `../index.md` from anywhere resolved to
 * `.` or `..`, i.e. the directory URL with a trailing slash — a 301 on every
 * such link. Those now resolve to the directory segment explicitly.
 */
export function resolveRelativeDocLink(rawUrl: string, file: SourceFile): string {
    if (!rawUrl.startsWith(".")) return rawUrl

    let [url, hash] = splitHash(rawUrl)
    const isIndexFile = Boolean(file.basename && file.basename.startsWith("index."))

    const indexLink = url.match(/^((?:\.\.\/)+|\.\/)index\.mdx?$/)
    if (indexLink && file.dirname && !(isIndexFile && indexLink[1] === "./")) {
        const ups = indexLink[1] === "./" ? 0 : indexLink[1].length / 3
        let dir = file.dirname
        for (let i = 0; i < ups; i++) dir = path.dirname(dir)
        // An index page's URL is its directory; a leaf page's URL sits one
        // level below, inside it.
        const climb = isIndexFile ? ups : ups + 1
        return "../".repeat(climb) + generateId({ entry: path.basename(dir) }) + hash
    }

    if (isIndexFile) {
        // From an index page the directory itself is the current URL: a `./`
        // link targets a child, so prepend the directory name...
        if (url.startsWith("./") && file.dirname) {
            url = path.join(path.basename(file.dirname), url.slice(2))
        }
        // ...and a `../` link targets a sibling of the directory.
        if (url.startsWith("../")) {
            url = "./" + url.slice(3)
        }
    }

    return generateId({ entry: url }) + hash
}
