import type { APIRoute } from "astro"

export const prerender = false

const HUBSPOT_PORTAL_ID = "27220195"
const HUBSPOT_SUBMIT_BASE =
    "https://api.hsforms.com/submissions/v3/integration/submit"
const FORM_GUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function json(data: unknown, status: number) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    })
}

export const POST: APIRoute = async ({ request }) => {
    let payload: any

    try {
        payload = await request.json()
    } catch {
        return json({ message: "Invalid request body." }, 400)
    }

    const { formId, fields, context } = payload ?? {}

    if (typeof formId !== "string" || !FORM_GUID_RE.test(formId)) {
        return json({ message: "Invalid or missing formId." }, 400)
    }

    if (!Array.isArray(fields)) {
        return json({ message: "Invalid or missing fields." }, 400)
    }

    const safeContext =
        context && typeof context === "object" ? { ...context } : {}

    const clientIp =
        (typeof safeContext.ipAddress === "string" && safeContext.ipAddress) ||
        request.headers.get("CF-Connecting-IP") ||
        request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
        ""

    if (clientIp) {
        safeContext.ipAddress = clientIp
    }

    const body = {
        fields,
        context: safeContext,
    }

    let upstream: Response

    try {
        upstream = await fetch(
            `${HUBSPOT_SUBMIT_BASE}/${HUBSPOT_PORTAL_ID}/${formId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            },
        )
    } catch (error) {
        console.error("HubSpot proxy upstream request failed:", error)
        return json(
            {
                message:
                    "We couldn't reach our forms service. Please try again in a moment.",
            },
            502,
        )
    }

    const responseBody = await upstream.text()

    return new Response(responseBody, {
        status: upstream.status,
        headers: {
            "Content-Type":
                upstream.headers.get("Content-Type") || "application/json",
        },
    })
}
