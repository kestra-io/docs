export const prerender = false

import type { APIRoute } from "astro"
import * as envField from "astro:env/server"

/**
 * Crawlers that build training corpora or AI search indexes. They ignore
 * `noindex` (meta and header alike) and honour robots.txt only, so it is the
 * single lever we have over them.
 *
 * User-triggered fetchers (`ChatGPT-User`, `Perplexity-User`) are deliberately
 * absent: those are a person explicitly asking about the page in front of them,
 * including on a version they actually run.
 */
const AI_CRAWLERS = [
    "GPTBot",
    "OAI-SearchBot",
    "ClaudeBot",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "Bytespider",
    "meta-externalagent",
]

/**
 * Docs of past releases live under version-shaped prefixes (`/docs/1.3/...`,
 * plus the `.md` variant of every one of them). They already carry `noindex` +
 * `X-Robots-Tag`, which keeps them out of Google — but that does nothing for the
 * crawlers above, and the `.md` passthrough hands them clean markdown of
 * superseded documentation. Blocked so assistants don't answer old-version
 * behaviour as if it were current, which is not correctable after the fact.
 *
 * robots.txt has no character classes, so the version shape is enumerated as
 * `/docs/<digit>.` prefixes. That matches `/docs/1.3/...` and `/docs/1.3/x.md`;
 * no real docs slug starts with a digit followed by a dot.
 *
 * Deliberately NOT added to the `User-agent: *` group: Googlebot has to keep
 * crawling these URLs to see the `noindex` we want it to obey.
 */
const VERSIONED_DOCS_DISALLOW = Array.from(
    { length: 10 },
    (_, digit) => `Disallow: /docs/${digit}.`,
).join("\n")

export const GET: APIRoute = async () => {
    const disabled = import.meta.env.DEV || envField.PREVIEW

    // Shared by every group. A crawler with its own group ignores `User-agent: *`
    // entirely, so these have to be repeated there rather than inherited.
    const commonRules = `Disallow: /t/
Disallow: /flags/
# Block faceted /blueprints navigation (crawler trap: combinatorial
# ?tags=/?tools=/?page=/?size=/?sort= permutations, incl. the old ?clid= bug).
# The clean /blueprints listing and /blueprints/<slug> detail pages have no
# query string, so they stay crawlable and indexable.
Disallow: /blueprints?*
Disallow: /*?tags=
# Build assets — CSS, JS, fonts accessible for robots rendering
Allow: /_astro/
Disallow: /_nuxt/
Disallow: /__nuxt_content/
# Cloudflare image optimization (keep indexable)
Allow: /cdn-cgi/image/
Disallow: /cdn-cgi/
# Block tracking parameters
Disallow: /*?q=
Disallow: /*?search=
Disallow: /*?ref=
Disallow: /*?utm_`

    const aiCrawlerGroup = `${AI_CRAWLERS.map((ua) => `User-agent: ${ua}`).join("\n")}
Disallow: /slack
${commonRules}
# Documentation of past releases — see VERSIONED_DOCS_DISALLOW in robots.txt.ts
${VERSIONED_DOCS_DISALLOW}`

    const result = `# indexing ${disabled ? "disabled" : "enabled"}

User-agent: *
Disallow: ${disabled ? "*" : "/slack"}
${
        disabled
            ? ""
            : `${commonRules}

${aiCrawlerGroup}

`
    }${disabled ? "" : "Sitemap: https://kestra.io/sitemap/index.xml"}`

    return new Response(result, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    })
}
