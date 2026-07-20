import { defineCFMiddleware } from "./worker.types"

export const CONSENT_REGION_COOKIE = "kestra_region"

// Mirrors the client-side Intl.DateTimeFormat "Europe" check in
// cookieconsent.ts, just computed from Cloudflare's edge-resolved geo data
// (request.cf.timezone) instead of the visitor's own OS clock — same
// classification, but authoritative and not spoofable by the client.
const resolveRegion = (request: Request): "eu" | "row" => {
    // `Request.cf`'s default generic is a union with `RequestInitCfProperties`
    // (for outgoing fetch() calls), which doesn't carry `timezone` — but on an
    // incoming request (this is always the case here) it's really
    // `IncomingRequestCfProperties`.
    const cf = request.cf as IncomingRequestCfProperties | undefined
    const timezone = cf?.timezone

    // Fail-safe: no cf object, empty/unrecognized timezone, Tor exit nodes,
    // etc. all default to "eu" — a false EU positive just costs a banner
    // impression; a false negative risks a Consent Mode/GDPR violation.
    if (!timezone) return "eu"

    return timezone.indexOf("Europe") === 0 ? "eu" : "row"
}

// Per-visitor value — this response must never be Cache-Control'd or stored
// via the Cache API, or a cached response could leak one visitor's region
// cookie to another.
export const setConsentRegionCookie = defineCFMiddleware(async (_url, next, request) => {
    const nextResponse = await next()
    const response = new Response(nextResponse.body, nextResponse)

    // Set-Cookie is multi-valued (Fetch spec) — .append(), not .set(), so
    // this doesn't clobber a Set-Cookie any other middleware/Astro session
    // adds later.
    response.headers.append(
        "Set-Cookie",
        `${CONSENT_REGION_COOKIE}=${resolveRegion(request)}; Path=/; Max-Age=86400; SameSite=Lax`,
    )

    return response
})
