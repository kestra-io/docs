import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("astro:env/client", () => ({ API_URL: "https://api.test/v1" }))

const fetchMock = vi.fn()
const json = (body: unknown) =>
    new Response(JSON.stringify(body), {
        status: 200,
        headers: { "content-type": "application/json" },
    })
const failure = (status: number, headers: Record<string, string> = {}) =>
    new Response("upstream down", { status, headers })

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

    it("retries after a failure instead of replaying it", async () => {
        fetchMock
            .mockImplementationOnce(() => Promise.resolve(failure(404)))
            .mockImplementation(() => Promise.resolve(json({ ok: true })))
        const { $fetchApiCached } = await load()

        await expect($fetchApiCached("/flaky")).rejects.toThrow("404")
        expect(await $fetchApiCached("/flaky")).toEqual({ ok: true })
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })
})

describe("transient failures", () => {
    // The retry backoff sleeps, so every case here drives the clock by hand.
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    const settle = async <T,>(promise: Promise<T>) => {
        const outcome = promise.then(
            (value) => ({ value }),
            (error) => ({ error }),
        )
        await vi.runAllTimersAsync()
        return await outcome
    }

    it("retries a 504 and resolves once the upstream recovers", async () => {
        fetchMock
            .mockImplementationOnce(() => Promise.resolve(failure(504)))
            .mockImplementationOnce(() => Promise.resolve(failure(502)))
            .mockImplementation(() => Promise.resolve(json({ ok: true })))
        const { $fetchCached } = await load()

        const outcome = await settle(
            $fetchCached("https://api.github.com/repos/kestra-io/kestra"),
        )

        expect(outcome).toEqual({ value: { ok: true } })
        expect(fetchMock).toHaveBeenCalledTimes(3)
    })

    it("retries a network error", async () => {
        fetchMock
            .mockImplementationOnce(() => Promise.reject(new Error("ECONNRESET")))
            .mockImplementation(() => Promise.resolve(json({ ok: true })))
        const { $fetchApiCached } = await load()

        expect(await settle($fetchApiCached("/flaky"))).toEqual({
            value: { ok: true },
        })
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("gives up after three retries and throws the last error", async () => {
        fetchMock.mockImplementation(() => Promise.resolve(failure(503)))
        const { $fetchApiCached } = await load()

        const outcome = (await settle($fetchApiCached("/down"))) as {
            error: Error
        }

        expect(outcome.error.message).toContain("Fetch error: 503")
        expect(fetchMock).toHaveBeenCalledTimes(4)
    })

    it("does not retry a 4xx the upstream will keep returning", async () => {
        fetchMock.mockImplementation(() => Promise.resolve(failure(404)))
        const { $fetchApiCached } = await load()

        await settle($fetchApiCached("/missing"))

        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("does not replay a POST", async () => {
        fetchMock.mockImplementation(() => Promise.resolve(failure(503)))
        const { $fetchApiCached } = await load()

        await settle($fetchApiCached("/search", { method: "POST", body: "{}" }))

        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("waits out a Retry-After header before the next attempt", async () => {
        fetchMock
            .mockImplementationOnce(() =>
                Promise.resolve(failure(429, { "retry-after": "2" })),
            )
            .mockImplementation(() => Promise.resolve(json({ ok: true })))
        const { $fetchApiCached } = await load()

        const pending = $fetchApiCached("/rate-limited")
        await vi.advanceTimersByTimeAsync(1_999)
        expect(fetchMock).toHaveBeenCalledTimes(1)

        await vi.advanceTimersByTimeAsync(1)
        expect(await pending).toEqual({ ok: true })
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
