import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
    return new Response(JSON.stringify({ result: "ok" }))
}