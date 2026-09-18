// Plugin pages render markdown that comes from the API — property descriptions
// from the JSON schema, the plugin's own long description, blueprint bodies.
// Those texts carry internal links written when a doc page lived elsewhere, and
// the site only fixes them at request time with a 301. Every such link is one
// redirect hop for the reader and one redirected inlink for crawlers, so the
// markdown renderer rewrites them to the current URL before the anchor is built.
//
// The rules come from the same file the middleware uses for 404s. Only rules
// that are a literal path (optionally followed by a wildcard suffix) are
// applied here: a rule such as `/docs/(.*)variables` is meant for a request
// that already 404'd, and applied to live links it would rewrite valid pages.
import docsRedirectsRaw from "~/contents/redirects/docs.yml?raw"

export type LiteralRedirect = { from: string; to: string }

const KESTRA_ORIGIN = "https://kestra.io"

// The redirect files are flat lists of `- regexp: "..."` / `to: "..."` pairs
// with double-quoted scalars. Reading them by line keeps the YAML library out
// of the client bundle, where this module also runs during hydration.
export function parseRedirectRules(raw: string): { regexp: string; to: string }[] {
    const rules: { regexp: string; to: string }[] = []
    let pending: string | undefined
    for (const line of raw.split("\n")) {
        const regexp = line.match(/^-\s*regexp:\s*(".*")\s*$/)
        if (regexp) {
            pending = JSON.parse(regexp[1])
            continue
        }
        const to = line.match(/^\s+to:\s*(".*")\s*$/)
        if (to && pending !== undefined) {
            rules.push({ regexp: pending, to: JSON.parse(to[1]) })
            pending = undefined
        }
    }
    return rules
}

// Keeps a rule only when its regexp is a literal path, with or without the
// `(/.*)?`, `(.*)?`, `.*` or `/?` tail and the `^`/`$` anchors the file uses.
export function toLiteralRedirects(rules: { regexp: string; to: string }[]): LiteralRedirect[] {
    const literals: LiteralRedirect[] = []
    for (const { regexp, to } of rules) {
        if (to.includes("$")) continue
        let path = regexp.replace(/^\^/, "").replace(/\$$/, "")
        path = path.replace(/(\(\/\.\*\)\?|\(\.\*\)\?|\(\.\*\)|\.\*|\/\?)$/, "")
        path = path.replace(/\\\./g, ".")
        if (/[()[\]*?+|{}^$\\]/.test(path) || !path.startsWith("/")) continue
        literals.push({ from: path.replace(/\/$/, ""), to })
    }
    return literals
}

const DOCS_REDIRECTS: LiteralRedirect[] = toLiteralRedirects(
    parseRedirectRules(docsRedirectsRaw),
)

export function resolveLiteralRedirect(
    pathname: string,
    redirects: LiteralRedirect[] = DOCS_REDIRECTS,
): string {
    let current = pathname
    // A rule can point at a path another rule has since moved again.
    for (let hop = 0; hop < 3; hop++) {
        const rule = redirects.find(
            ({ from }) => current === from || current.startsWith(from + "/"),
        )
        if (!rule) break
        current = rule.to
    }
    return current
}

/**
 * Rewrites an internal `/docs/...` or `/plugins/...` href — root-relative or
 * absolute on kestra.io — to the URL the site would 301 it to. Anything else
 * is returned untouched.
 */
export function rewriteRedirectedHref(
    href: string,
    redirects: LiteralRedirect[] = DOCS_REDIRECTS,
): string {
    const absolute = href.startsWith(KESTRA_ORIGIN + "/")
    const rootRelative = href.startsWith("/") && !href.startsWith("//")
    if (!absolute && !rootRelative) return href

    const prefix = absolute ? KESTRA_ORIGIN : ""
    const rest = href.slice(prefix.length)
    const suffixStart = rest.search(/[?#]/)
    const pathname = suffixStart === -1 ? rest : rest.slice(0, suffixStart)
    const suffix = suffixStart === -1 ? "" : rest.slice(suffixStart)

    let next = pathname
    if (pathname.startsWith("/docs/") || pathname === "/docs") {
        // The middleware strips trailing slashes for every route.
        next = resolveLiteralRedirect(pathname.replace(/\/$/, "") || "/docs", redirects)
    } else if (pathname.startsWith("/plugins/")) {
        // Plugin URLs are lowercase and never carry the `.md` some plugin
        // READMEs link with; both are 301s in the plugin router.
        next = pathname.replace(/\.md$/, "").replace(/\/$/, "").toLowerCase()
    }

    return next === pathname ? href : prefix + next + suffix
}

/** `walkTokens` hook for marked: rewrites redirected internal links in place. */
export function rewriteLinkTokens(token: { type: string; href?: string }) {
    if (token.type === "link" && typeof token.href === "string") {
        token.href = rewriteRedirectedHref(token.href)
    }
}
