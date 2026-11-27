/**
 * The G_AWX variant of /lp/automate-infra: which visitors get it, and which
 * headline they see.
 *
 * The decision has to be made before first paint, so it runs in an inline
 * script on the page (no bundling, no import). These rules are passed to that
 * script as plain strings through `define:vars`, and the same strings drive
 * `resolveAwxVariant` below, which the unit test runs against every G_AWX
 * keyword. Change a rule here and both follow.
 */

export type AwxHeadline =
    "pricing" | "compare" | "tower" | "aap" | "awx" | "orchestrate" | "ui"

/**
 * Ordered: the first rule whose pattern matches the lowercased `utm_term`
 * wins. Pricing and comparison searches name a product too, so they go first;
 * "semaphore ui alternative" is an AWX-alternative search, so `awx` runs
 * before `ui`.
 */
export const AWX_HEADLINE_RULES: readonly (readonly [AwxHeadline, string])[] = [
    ["pricing", "pric|cost|licen[cs]|subscription"],
    ["compare", "\\bvs\\b|versus"],
    ["tower", "tower|automation controller"],
    ["aap", "automation platform|\\baap\\b|red hat ansible"],
    ["awx", "\\bawx\\b|semaphore"],
    ["orchestrate", "orchestrat"],
    ["ui", "\\bgui\\b|\\bui\\b|schedul"],
]

/**
 * Searches that get the variant even without `utm_campaign=g_awx` (another
 * campaign or a hand-tagged link). Plain "ansible" is not enough: the default
 * page already speaks to Ansible users.
 */
export const AWX_TERM_PATTERN =
    "\\bawx\\b|ansible tower|automation controller|ansible automation platform|\\baap\\b"

export const AWX_CAMPAIGN = "g_awx"

/** Headline shown when the visitor gets the variant but no rule matches. */
export const AWX_FALLBACK_HEADLINE: AwxHeadline = "awx"

export function pickAwxHeadline(term: string): AwxHeadline | null {
    const value = term.toLowerCase()
    for (const [key, pattern] of AWX_HEADLINE_RULES) {
        if (new RegExp(pattern).test(value)) return key
    }
    return null
}

/**
 * `null` means the default page. Mirrors the inline script in
 * src/pages/lp/automate-infra.astro.
 */
export function resolveAwxVariant(search: string): AwxHeadline | null {
    const params = new URLSearchParams(search)
    const campaign = (params.get("utm_campaign") || "").toLowerCase()
    const term = (params.get("utm_term") || "").toLowerCase()
    if (campaign !== AWX_CAMPAIGN && !new RegExp(AWX_TERM_PATTERN).test(term)) {
        return null
    }
    return pickAwxHeadline(term) ?? AWX_FALLBACK_HEADLINE
}
