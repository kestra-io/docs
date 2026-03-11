import type { APIRoute } from "astro"

export const prerender = false

const handler: APIRoute = async ({ request }) => {
    const method = request.method
    const requestUrl = new URL(request.url)
    const createdAt = new Date().toISOString()

    let responseData: Record<string, unknown> = {
        title: "Success",
        method: method,
        params: Object.fromEntries(requestUrl.searchParams),
        code: 200,
        createdAt: createdAt,
        body: "Request processed successfully",
    }

    switch (method) {
        case "GET":
            return new Response(JSON.stringify(responseData), { status: 200 })
        case "POST": {
            const body = await request.json().catch(() => null)
            return new Response(
                JSON.stringify({ ...responseData, code: 201, body }),
                { status: 201 },
            )
        }
        default:
            return new Response(
                JSON.stringify({
                    ...responseData,
                    title: "Method Not Allowed",
                    code: 405,
                    body: "The requested method is not allowed for this endpoint.",
                }),
                { status: 405 },
            )
    }
}

export const GET = handler
export const POST = handler
export const ALL = handler
