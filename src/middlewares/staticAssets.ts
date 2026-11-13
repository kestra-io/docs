// Extensions of the files this site actually ships (public/, dist/client and
// the .md / .txt / .xml endpoints). Requests for them skip the HTML
// middlewares and the edge cache in worker.ts.
//
// Deliberately an allowlist: a generic "ends with .something" test also
// matches pages. Plugin element pages end with a fully qualified class name
// (`/plugins/core/flow/io.kestra.plugin.core.flow.subflow`) and release pages
// with a version (`/docs/changelog/v1.3.39`), so that test sent ~2 000 SSR
// pages around the CSP/security headers and the edge cache — a full render on
// every hit.
const STATIC_ASSET_EXTENSIONS = new Set([
    // scripts & styles
    "js",
    "mjs",
    "cjs",
    "css",
    "map",
    "wasm",
    // text & data
    "json",
    "xml",
    "txt",
    "md",
    "yml",
    "yaml",
    "csv",
    "webmanifest",
    "pdf",
    "zip",
    // images
    "svg",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "avif",
    "ico",
    // fonts
    "woff",
    "woff2",
    "ttf",
    "otf",
    "eot",
    // media
    "mp4",
    "m4v",
    "webm",
    "mp3",
    "ogg",
    "wav",
])

export function isStaticAssetPath(pathname: string): boolean {
    const match = /\.([a-zA-Z0-9]+)$/.exec(pathname)
    return match !== null && STATIC_ASSET_EXTENSIONS.has(match[1].toLowerCase())
}
