import { defineCFMiddleware } from "./worker.types"

export const CONSENT_REGION_COOKIE = "kestra_region"

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

// Per-visitor value — this response must never be cached, or one
// visitor's region cookie could leak to another.
export const setConsentRegionCookie = defineCFMiddleware(async (_url, next, request) => {
    const nextResponse = await next()
    const response = new Response(nextResponse.body, nextResponse)

    // .append(), not .set() — Set-Cookie is multi-valued and .set() would
    // clobber any other middleware's cookie.
    response.headers.append(
        "Set-Cookie",
        `${CONSENT_REGION_COOKIE}=${resolveRegion(request)}; Path=/; Max-Age=86400; SameSite=Lax`,
    )

    return response
})
