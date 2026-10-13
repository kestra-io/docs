export const CONSENT_REGION_ATTR = "data-kestra-region"

// Mirrors the client-side Intl "Europe" check, computed from Cloudflare's
// edge geo data instead — authoritative, not spoofable by the client.
const resolveRegion = (request: Request): "eu" | "row" => {
    // Request.cf's default generic type omits `timezone`, but incoming
    // requests are always IncomingRequestCfProperties, which has it.
    const cf = request.cf as IncomingRequestCfProperties | undefined
    const timezone = cf?.timezone

    // Fail-safe: missing/unrecognized geo defaults to "eu" — a false
    // positive costs a banner impression; a false negative risks GDPR.
    if (!timezone) return "eu"

    return timezone.indexOf("Europe") === 0 ? "eu" : "row"
}

// Bakes the region into <html> instead of Set-Cookie, which Cloudflare's Cache
// API refuses to store (see the `put()` call in worker.ts).
//
// Deliberately NOT a middleware: the middleware chain only runs on an edge-cache
// miss, and its output is what gets stored. Injecting there would bake the first
// miss visitor's region into the cached copy of every plugin/blueprint page for
// the whole TTL and serve it to everyone else hitting that PoP — an EU visitor
// could inherit `row`, i.e. `granted` consent defaults and no banner. Applying
// the rewrite outside the cache boundary instead (on both the hit and the miss
// response) keeps the cached body region-agnostic and gives every visitor the
// region resolved from their own request.
export const withConsentRegion = (response: Response, request: Request): Response => {
    if (!response.headers.get("content-type")?.startsWith("text/html")) {
        return response
    }

    const region = resolveRegion(request)
    const rewritten = new HTMLRewriter()
        .on("html", {
            element(el) {
                el.setAttribute(CONSENT_REGION_ATTR, region)
            },
        })
        .transform(response)

    // This body now varies per visitor, so it must never be stored by a shared
    // cache: on the hit path it carries the `s-maxage` the edge-cache path set,
    // which a proxy downstream would otherwise honour and replay to visitors in
    // another region. The copy kept in the Workers cache is cloned before this
    // runs and keeps its `s-maxage`.
    const out = new Response(rewritten.body, rewritten)
    out.headers.set("Cache-Control", "private, max-age=0, must-revalidate")

    return out
}
