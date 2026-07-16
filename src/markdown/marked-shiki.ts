import { Marked } from "marked"
import { markedHighlight } from "marked-highlight"
import { bundledLanguages, codeToHtml } from "shiki"

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
                const normalized = (lang ?? "").trim().toLowerCase()
                const supported = normalized in bundledLanguages
                const html = await codeToHtml(code, {
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