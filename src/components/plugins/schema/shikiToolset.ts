import type {HighlighterCore} from "shiki/core"

// Everything Shiki is behind `import()`: a static import here puts the core,
// the themes and every grammar in the static closure of each importing route.
const LANG_LOADERS = {
    yaml: () => import("shiki/langs/yaml.mjs"),
    python: () => import("shiki/langs/python.mjs"),
    javascript: () => import("shiki/langs/javascript.mjs"),
    bash: () => import("shiki/langs/bash.mjs"),
    json: () => import("shiki/langs/json.mjs"),
    // Rest of what API-sourced markdown uses (plugin docs, blueprint
    // descriptions). TypeScript (~190 KB) is deliberately left out.
    sql: () => import("shiki/langs/sql.mjs"),
    java: () => import("shiki/langs/java.mjs"),
    groovy: () => import("shiki/langs/groovy.mjs"),
    hcl: () => import("shiki/langs/hcl.mjs"),
    dockerfile: () => import("shiki/langs/dockerfile.mjs"),
    properties: () => import("shiki/langs/properties.mjs"),
    ini: () => import("shiki/langs/ini.mjs"),
    xml: () => import("shiki/langs/xml.mjs"),
    shellsession: () => import("shiki/langs/shellsession.mjs"),
    terraform: () => import("shiki/langs/terraform.mjs"),
} as const

export type ShikiLanguage = keyof typeof LANG_LOADERS

// Shiki registers a grammar's aliases along with it, so loading per fence
// language means resolving them here instead.
const LANG_ALIASES: Record<string, ShikiLanguage> = {
    yml: "yaml",
    py: "python",
    js: "javascript",
    sh: "bash",
    shell: "bash",
    zsh: "bash",
    console: "shellsession",
    docker: "dockerfile",
    tf: "terraform",
    tfvars: "terraform",
}

export const ALL_LANGUAGES = Object.keys(LANG_LOADERS) as ShikiLanguage[]

/** Fence language to a grammar this toolset can load, or undefined for plain text. */
export function resolveLanguage(lang?: string | null): ShikiLanguage | undefined {
    const normalized = (lang ?? "").trim().toLowerCase()
    const resolved = Object.hasOwn(LANG_ALIASES, normalized)
        ? LANG_ALIASES[normalized]!
        : normalized
    return Object.hasOwn(LANG_LOADERS, resolved)
        ? (resolved as ShikiLanguage)
        : undefined
}

let corePromise: Promise<HighlighterCore> | undefined
const langPromises = new Map<ShikiLanguage, Promise<unknown>>()

async function createCore() {
    const [core, engine, light, dark] = await Promise.all([
        import("shiki/core"),
        import("shiki/engine/javascript"),
        import("shiki/themes/github-light-default.mjs"),
        import("shiki/themes/github-dark-default.mjs"),
    ])
    // The JavaScript regex engine, not the default Oniguruma WASM one, which
    // workerd refuses to compile ("Wasm code generation disallowed by embedder").
    return core.createHighlighterCore({
        themes: [light.default, dark.default],
        langs: [],
        engine: engine.createJavaScriptRegexEngine(),
    })
}

function loadLanguage(highlighter: HighlighterCore, lang: string) {
    const resolved = resolveLanguage(lang)
    if (!resolved) {
        return Promise.resolve()
    }
    let pending = langPromises.get(resolved)
    if (!pending) {
        pending = LANG_LOADERS[resolved]().then((module) =>
            highlighter.loadLanguage(module.default),
        )
        langPromises.set(resolved, pending)
    }
    return pending
}

/** Shared highlighter with `langs` registered; unknown ones are skipped, so
 * callers fall back to plain text rather than throwing. */
export async function getHighlighterCore(
    langs: Iterable<string> = ALL_LANGUAGES,
): Promise<HighlighterCore> {
    corePromise ??= createCore()
    const highlighter = await corePromise
    await Promise.all(
        [...langs].map((lang) => loadLanguage(highlighter, lang)),
    )
    return highlighter
}
