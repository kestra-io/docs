import type { APIRoute } from "astro"
import { HUBSPOT_PRIVATE_APP_TOKEN } from "astro:env/server"
import { resolveHqRouting } from "~/utils/hubspotRouting"

export const prerender = false

const HUBSPOT_PORTAL_ID = "27220195"
const HUBSPOT_SUBMIT_BASE =
    "https://api.hsforms.com/submissions/v3/integration/submit"
const FORM_GUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const UPSTREAM_TIMEOUT_MS = 8_000
const ROUTING_BUDGET_MS = 2_000

function json(data: unknown, status: number) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    })
}

function fieldValue(fields: unknown[], name: string) {
    const field = fields.find(
        (candidate) => (candidate as { name?: unknown })?.name === name,
    ) as { value?: unknown } | undefined
    return typeof field?.value === "string" ? field.value : undefined
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
        request.headers.get("CF-Connecting-IP") ||
        request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
        (typeof safeContext.ipAddress === "string" && safeContext.ipAddress) ||
        ""

    if (clientIp) {
        safeContext.ipAddress = clientIp
    }

    const body = {
        fields,
        context: safeContext,
    }

    const submit = fetch(
        `${HUBSPOT_SUBMIT_BASE}/${HUBSPOT_PORTAL_ID}/${formId}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        },
    )

    const routing = resolveHqRouting({
        token: HUBSPOT_PRIVATE_APP_TOKEN,
        email: fieldValue(fields, "email"),
        employees: fieldValue(fields, "number_of_employees"),
        submitted: submit.then(
            (response) => response.ok,
            () => false,
        ),
    })

    let upstream: Response
    let responseBody: string

    try {
        upstream = await submit
        responseBody = await upstream.text()
    } catch (error) {
        console.error("HubSpot proxy upstream request failed:", error)
        const timedOut = (error as Error)?.name === "TimeoutError"
        return json(
            {
                message:
                    "We couldn't reach our forms service. Please try again in a moment.",
                submitted: timedOut ? null : false,
            },
            timedOut ? 504 : 502,
        )
    }

    let parsed: Record<string, unknown> = {}
    try {
        const candidate = JSON.parse(responseBody)
        if (candidate && typeof candidate === "object") parsed = candidate
    } catch {
        parsed = {}
    }

    if (!upstream.ok) {
        return json({ ...parsed, submitted: false }, upstream.status)
    }

    const resolved = await Promise.race([
        routing,
        new Promise<undefined>((resolve) =>
            setTimeout(() => resolve(undefined), ROUTING_BUDGET_MS),
        ),
    ])

    return json(
        { ...parsed, submitted: true, ...(resolved && { routing: resolved }) },
        200,
    )
}
