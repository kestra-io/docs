export type RedirectRule = { regexp: string; to: string }

/**
 * Resolve a 404'd pathname against an ordered rule list, first match wins.
 *
 * The substitution is a `String.replace` of the matched span, not a whole-path
 * rewrite: a rule whose regexp matches only a prefix leaves the rest of the
 * pathname appended to `to`. Rules meant as catch-alls therefore have to be
 * anchored (`^...$`), otherwise `/docs/a/` -> `/docs/b` turns `/docs/a/child`
 * into `/docs/bchild`.
 */
export const resolveRedirect = (
    pathname: string,
    rules: RedirectRule[],
): string | null => {
    for (const rule of rules) {
        const regexp = new RegExp(rule.regexp)
        if (pathname.match(regexp)) {
            return pathname.replace(regexp, rule.to)
        }
    }

    return null
}
