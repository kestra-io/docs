import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("astro:env/client", () => ({ API_URL: "https://api.test/v1" }))

const fetchMock = vi.fn()
const json = (body: unknown) =>
    new Response(JSON.stringify(body), {
        status: 200,
        headers: { "content-type": "application/json" },
    })

beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
    vi.resetModules()
})

afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
})

const load = async (env: { PROD?: boolean; SSR?: boolean } = {}) => {
    vi.stubEnv("PROD", env.PROD ?? true)
    vi.stubEnv("SSR", env.SSR ?? true)
    return await import("./fetch")
}

describe("$fetchApiCached during a production build", () => {
    it("fetches a URL once and shares the parsed body across callers", async () => {
        fetchMock.mockImplementation(() => Promise.resolve(json({ n: 1 })))
        const { $fetchApiCached } = await load()

        const [a, b] = await Promise.all([
            $fetchApiCached("/plugins/subgroups"),
            $fetchApiCached("/plugins/subgroups"),
        ])
        await $fetchApiCached("/plugins/subgroups")

        expect(a).toEqual({ n: 1 })
        expect(b).toEqual({ n: 1 })
        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.calls[0][0]).toBe("https://api.test/v1/plugins/subgroups")
    })

    it("keeps distinct URLs and header sets apart", async () => {
        fetchMock.mockImplementation(() => Promise.resolve(json({})))
        const { $fetchApiCached, $fetchCached } = await load()

        await $fetchApiCached("/a")
        await $fetchApiCached("/b")
        await $fetchApiCached("/a", { headers: { accept: "text/plain" } })
        await $fetchCached("https://api.github.com/x")

        expect(fetchMock).toHaveBeenCalledTimes(4)
    })

    it("does not memoize non-GET requests", async () => {
        fetchMock.mockImplementation(() => Promise.resolve(json({})))
        const { $fetchApiCached } = await load()

        await $fetchApiCached("/search", { method: "POST", body: "{}" })
        await $fetchApiCached("/search", { method: "POST", body: "{}" })

        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("retries a 5xx but not a 4xx", async () => {
        vi.useFakeTimers()
        try {
            const { $fetchApiCachedWithRetry } = await load()

            fetchMock.mockResolvedValue(new Response("nope", { status: 404 }))
            const notFound = $fetchApiCachedWithRetry("/missing")
            notFound.catch(() => {}) // observed below; avoid an unhandled rejection
            await vi.runAllTimersAsync()
            await expect(notFound).rejects.toThrow("404")
            // A 4xx is a stable answer: one attempt, no backoff.
            expect(fetchMock).toHaveBeenCalledTimes(1)

            fetchMock.mockReset()
            fetchMock
                .mockResolvedValueOnce(new Response("down", { status: 503 }))
                .mockResolvedValueOnce(json({ ok: true }))
            const recovered = $fetchApiCachedWithRetry("/flaky-5xx")
            await vi.runAllTimersAsync()
            await expect(recovered).resolves.toEqual({ ok: true })
            expect(fetchMock).toHaveBeenCalledTimes(2)
        } finally {
            vi.useRealTimers()
        }
    })

    it("retries after a failure instead of replaying it", async () => {
        fetchMock
            .mockImplementationOnce(() => Promise.reject(new Error("down")))
            .mockImplementation(() => Promise.resolve(json({ ok: true })))
        const { $fetchApiCached } = await load()

        await expect($fetchApiCached("/flaky")).rejects.toThrow("down")
        expect(await $fetchApiCached("/flaky")).toEqual({ ok: true })
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })
})

describe("$fetchApiCached outside a production build", () => {
    it("fetches every time in the browser bundle", async () => {
        fetchMock.mockImplementation(() => Promise.resolve(json({})))
        const { $fetchApiCached } = await load({ SSR: false })

        await $fetchApiCached("/a")
        await $fetchApiCached("/a")

        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("fetches every time in the Cloudflare worker", async () => {
        vi.stubGlobal("navigator", { userAgent: "Cloudflare-Workers" })
        fetchMock.mockImplementation(() => Promise.resolve(json({})))
        const { $fetchApiCached } = await load()

        await $fetchApiCached("/a")
        await $fetchApiCached("/a")

        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("fetches every time in dev", async () => {
        fetchMock.mockImplementation(() => Promise.resolve(json({})))
        const { $fetchApiCached } = await load({ PROD: false })

        await $fetchApiCached("/a")
        await $fetchApiCached("/a")

        expect(fetchMock).toHaveBeenCalledTimes(2)
    })
})
