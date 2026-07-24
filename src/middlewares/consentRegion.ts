import { defineCFMiddleware } from "./worker.types"

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

// Bakes the region into <html> instead of Set-Cookie, so the response stays
// edge-cacheable — visitors sharing a PoP just share its cached region.
export const injectConsentRegion = defineCFMiddleware(async (_url, next, request) => {
    const response = await next()

    if (!response.headers.get("content-type")?.startsWith("text/html")) {
        return response
    }

    const region = resolveRegion(request)
    return new HTMLRewriter()
        .on("html", {
            element(el) {
                el.setAttribute(CONSENT_REGION_ATTR, region)
            },
        })
        .transform(response)
})
