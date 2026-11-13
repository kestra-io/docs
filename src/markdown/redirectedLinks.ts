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
import { resolveRedirect, type RedirectRule } from "~/utils/redirects"

export type LiteralRedirect = RedirectRule & { from: string }

const KESTRA_ORIGIN = "https://kestra.io"

// The redirect files are flat lists of `- regexp: "..."` / `to: "..."` pairs
// with double-quoted scalars. Reading them by line keeps the YAML library out
// of the client bundle, where this module also runs during hydration.
export function parseRedirectRules(raw: string): RedirectRule[] {
    const rules: RedirectRule[] = []
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
// The regexp itself is kept and matched as the middleware would, so an exact
// rule (`/docs/x/?$`) never catches `/docs/x/child`. A rule pointing back at
// its own path is a fallback for dead children of a live page: applied to a
// link, it would rewrite a page that renders.
export function toLiteralRedirects(rules: RedirectRule[]): LiteralRedirect[] {
    const literals: LiteralRedirect[] = []
    for (const { regexp, to } of rules) {
        if (to.includes("$")) continue
        let path = regexp.replace(/^\^/, "").replace(/\$$/, "")
        path = path.replace(/(\(\/\.\*\)\?|\(\.\*\)\?|\(\.\*\)|\.\*|\/\?)$/, "")
        path = path.replace(/\\\./g, ".")
        if (/[()[\]*?+|{}^$\\]/.test(path) || !path.startsWith("/")) continue
        const from = path.replace(/\/$/, "")
        if (from === to.replace(/[?#].*$/, "").replace(/\/$/, "")) continue
        literals.push({ from, regexp, to })
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
        const next = resolveRedirect(current, redirects)
        if (next === null || next === current) break
        current = next
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
    let nextSuffix = suffix
    if (pathname.startsWith("/docs/") || pathname === "/docs") {
        // The middleware strips trailing slashes for every route (`trailingSlash: "never"`),
        // so `/docs/x/` is rewritten to `/docs/x` even when no rule matches.
        next = resolveLiteralRedirect(
            pathname.replace(/\/$/, "") || "/docs",
            redirects,
        )
        // A rule can target a section of its page: its fragment wins over the link's own,
        // the link's query string is kept.
        const hashAt = next.indexOf("#")
        if (hashAt !== -1) {
            const query = suffix.replace(/#.*$/, "")
            nextSuffix = query + next.slice(hashAt)
            next = next.slice(0, hashAt)
        }
    } else if (pathname.startsWith("/plugins/")) {
        // Plugin URLs are lowercase and never carry the `.md` some plugin
        // READMEs link with; both are 301s in the plugin router.
        next = pathname.replace(/\.md$/, "").replace(/\/$/, "").toLowerCase()
    }

    return next === pathname && nextSuffix === suffix
        ? href
        : prefix + next + nextSuffix
}

/** `walkTokens` hook for marked: rewrites redirected internal links in place. */
export function rewriteLinkTokens(token: { type: string; href?: string }) {
    if (token.type === "link" && typeof token.href === "string") {
        token.href = rewriteRedirectedHref(token.href)
    }
}
