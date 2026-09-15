// Underscore-prefixed so Astro does not build this as the /api/github.test
// route and try to import vitest while prerendering.
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("astro:env/server", () => ({ DISABLE_GITHUB: false }))

const $fetchCached = vi.fn()
const $fetchCachedRaw = vi.fn()
vi.mock("~/utils/fetch", () => ({ $fetchCached, $fetchCachedRaw }))

const contributorsResponse = (count: number) =>
    new Response(null, {
        status: 200,
        headers: {
            Link: `<https://api.github.com/x?page=${count}>; rel="last"`,
        },
    })

beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, "error").mockImplementation(() => {})
})

describe("getValues", () => {
    it("returns the full payload when both upstream calls resolve", async () => {
        $fetchCachedRaw.mockResolvedValue(contributorsResponse(742))
        $fetchCached.mockResolvedValue({
            stargazers_count: 1,
            watchers_count: 2,
            open_issues_count: 3,
            forks: 4,
            network_count: 5,
            subscribers_count: 6,
            size: 7,
        })
        const { getValues } = await import("./github")

        expect(await getValues()).toEqual({
            stargazers: 1,
            watchers: 2,
            issues: 3,
            forks: 4,
            network: 5,
            subscribers: 6,
            size: 7,
            contributors: 742,
        })
    })

    // The route is prerendered: a 504 here used to abort the whole build.
    it("keeps the resolved contributor count when repo metadata fails", async () => {
        $fetchCachedRaw.mockResolvedValue(contributorsResponse(742))
        $fetchCached.mockRejectedValue(new Error("Fetch error: 504"))
        const { getValues } = await import("./github")

        expect(await getValues()).toEqual({
            stargazers: 0,
            watchers: 0,
            issues: 0,
            forks: 0,
            network: 0,
            subscribers: 0,
            size: 0,
            contributors: 742,
        })
    })

    it("falls back to zeroes when the contributors call fails", async () => {
        $fetchCachedRaw.mockRejectedValue(new Error("Fetch error: 504"))
        const { getValues } = await import("./github")

        expect((await getValues()).contributors).toBe(0)
        expect($fetchCached).not.toHaveBeenCalled()
    })
})
