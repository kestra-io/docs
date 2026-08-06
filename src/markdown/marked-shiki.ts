import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import { getHighlighterCore } from "~/components/plugins/schema/shikiToolset"

const LIGHT_THEME = "github-light-default"
const DARK_THEME = "github-dark-default"

let instance: Marked | undefined

/** Dedicated `Marked` instance that highlights fenced code blocks with Shiki. */
export function getMarked() {
    if (instance) {
        return instance
    }

    instance = new Marked(
        markedHighlight({
            async: true,
            async highlight(code, lang) {
                // Use the shared core highlighter (Shiki's JavaScript regex
                // engine) instead of the full `shiki` bundle: the full bundle
                // defaults to the Oniguruma WASM engine, which workerd refuses
                // to compile at runtime ("Wasm code generation disallowed by
                // embedder"), silently breaking every fenced code block in
                // server-rendered markdown. It also keeps the multi-megabyte
                // all-languages build out of the client chunks. Languages not
                // registered in the toolset fall back to plain text.
                const highlighter = await getHighlighterCore()
                const normalized = (lang ?? "").trim().toLowerCase()
                const supported = highlighter
                    .getLoadedLanguages()
                    .includes(normalized)
                const html = highlighter.codeToHtml(code, {
                    lang: supported ? normalized : "text",
                    themes: { light: LIGHT_THEME, dark: DARK_THEME },
                })
                // Strip Shiki's outer `<pre><code>`; marked-highlight adds its own.
                return html
                    .replace(/^<pre\b[^>]*>\s*<code\b[^>]*>/, "")
                    .replace(/<\/code>\s*<\/pre>\s*$/, "")
            },
        }),
    )

    return instance
}