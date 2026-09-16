import { Marked, type Tokens } from "marked"
import { markedHighlight } from "marked-highlight"

const LIGHT_THEME = "github-light-default"
const DARK_THEME = "github-dark-default"

let instance: Marked | undefined
let plainInstance: Marked | undefined

const escapeHtml = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** Dedicated `Marked` instance that highlights fenced code blocks with Shiki. */
export function getMarked() {
    if (instance) {
        return instance
    }

    instance = new Marked(
        markedHighlight({
            async: true,
            async highlight(code, lang) {
                // Dynamic import, and the only way in: a static one would pull
                // the core, the themes and the grammars into every route.
                const { getHighlighterCore, resolveLanguage } = await import(
                    "~/components/plugins/schema/shikiToolset"
                )
                // Languages the toolset doesn't carry render as plain text.
                const resolved = resolveLanguage(lang)
                const highlighter = await getHighlighterCore(
                    resolved ? [resolved] : [],
                )
                // Re-check rather than trust `resolved`: the grammar's chunk
                // can fail to load, and codeToHtml throws on an unloaded lang.
                const loaded =
                    resolved && highlighter.getLoadedLanguages().includes(resolved)
                const html = highlighter.codeToHtml(code, {
                    lang: loaded ? resolved : "text",
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

/** `Marked` instance that leaves fences as escaped plain text, so markdown can
 * render before Shiki lands and be upgraded in place afterwards. */
export function getPlainMarked() {
    plainInstance ??= new Marked({
        renderer: {
            code({ text }: Tokens.Code) {
                return `<pre class="shiki-fallback"><code>${escapeHtml(text)}</code></pre>`
            },
        },
    })

    return plainInstance
}

/** Kicks off the toolset fetch from a module that knows it will highlight, so
 * the round trips overlap hydration instead of starting after it. */
export function warmHighlighter(langs?: Iterable<string>) {
    void import("~/components/plugins/schema/shikiToolset")
        .then((toolset) => toolset.warmHighlighterCore(langs))
        .catch((error) => {
            console.error("Shiki toolset failed to preload:", error)
        })
}
