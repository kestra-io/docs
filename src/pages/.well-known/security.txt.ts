import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
    const expires = new Date()
    expires.setUTCFullYear(expires.getUTCFullYear() + 2, 7, 26)
    expires.setUTCHours(0, 0, 0, 0)

    const body = `Contact: https://github.com/kestra-io/kestra/security/advisories/new
Expires: ${expires.toISOString()}
Preferred-Languages: en
Canonical: https://kestra.io/.well-known/security.txt
Policy: https://kestra.io/docs/releases
`

    return new Response(body, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    })
}
