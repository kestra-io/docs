// Underscore-prefixed so Astro does not build this as an /api/openapi/...
// route and try to import vitest while prerendering.
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("astro:env/client", () => ({ API_URL: "https://api.kestra.io/v1" }))

beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("GET /api/openapi/[version]/[edition].yml", () => {
    it("rejects an edition other than oss or ee", async () => {
        const { GET } = await import("./[edition].yml")
        const response = await GET({ params: { version: "1.3", edition: "bogus" } } as never)
        expect(response.status).toBe(404)
    })

    it("rejects a version that isn't major.minor", async () => {
        const { GET } = await import("./[edition].yml")
        const response = await GET({ params: { version: "1.3.0", edition: "ee" } } as never)
        expect(response.status).toBe(404)
    })

    it("proxies the upstream spec with an immutable edge cache", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response("openapi: 3.0.1", { status: 200 }))
        vi.stubGlobal("fetch", fetchMock)
        const { GET } = await import("./[edition].yml")

        const response = await GET({ params: { version: "1.3", edition: "ee" } } as never)

        expect(response.status).toBe(200)
        expect(await response.text()).toBe("openapi: 3.0.1")
        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.kestra.io/v1/docs/kestra-ee.yml/versions/1.3.0",
            { cf: { cacheTtl: 86400, cacheEverything: true } },
        )
        vi.unstubAllGlobals()
    })

    it("returns 404 when the upstream 404s", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })))
        const { GET } = await import("./[edition].yml")

        const response = await GET({ params: { version: "0.10", edition: "ee" } } as never)
        expect(response.status).toBe(404)
        vi.unstubAllGlobals()
    })

    it("returns 502 rather than 500 when the upstream errors", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })))
        const { GET } = await import("./[edition].yml")

        const response = await GET({ params: { version: "1.3", edition: "ee" } } as never)
        expect(response.status).toBe(502)
        vi.unstubAllGlobals()
    })

    it("returns 502, not an unhandled rejection, when fetch itself throws", async () => {
        // DNS/connect-reset/subrequest-limit reject the promise rather than
        // resolving with a bad status — without the try/catch this propagates
        // out of the handler instead of degrading to a proxy error.
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")))
        const { GET } = await import("./[edition].yml")

        const response = await GET({ params: { version: "1.3", edition: "ee" } } as never)
        expect(response.status).toBe(502)
        vi.unstubAllGlobals()
    })
})
