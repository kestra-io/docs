import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { DOCS_LATEST_OVERRIDE } from "~/utils/versionedDocs"

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }))
vi.mock("~/utils/fetch", () => ({ $fetchApiCached: fetchMock }))

beforeEach(() => {
    fetchMock.mockReset()
    vi.resetModules()
    vi.useFakeTimers()
})

afterEach(() => {
    vi.useRealTimers()
})

describe("getLatestDocVersion", () => {
    it("fetches and memoizes the latest version on success", async () => {
        fetchMock.mockResolvedValue({ version: "1.3.34" })
        const { getLatestDocVersion } = await import("./docVersionsFetch")

        expect(await getLatestDocVersion()).toBe("1.3")
        await getLatestDocVersion()
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("caches a cold-start failure so a sustained outage isn't refetched on every call", async () => {
        fetchMock.mockRejectedValue(new Error("network down"))
        const { getLatestDocVersion } = await import("./docVersionsFetch")

        expect(await getLatestDocVersion()).toBeUndefined()
        expect(await getLatestDocVersion()).toBeUndefined()
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("keeps a stale value on a later failure instead of dropping it", async () => {
        fetchMock.mockResolvedValueOnce({ version: "1.3.34" })
        const { getLatestDocVersion } = await import("./docVersionsFetch")
        await getLatestDocVersion()

        vi.advanceTimersByTime(11 * 60 * 1000) // past the 10-minute TTL
        fetchMock.mockRejectedValueOnce(new Error("network down"))

        expect(await getLatestDocVersion()).toBe("1.3")
    })

    it("retries a failure sooner than a fresh success (short negative-cache TTL)", async () => {
        fetchMock.mockRejectedValueOnce(new Error("network down"))
        const { getLatestDocVersion } = await import("./docVersionsFetch")
        expect(await getLatestDocVersion()).toBeUndefined()

        vi.advanceTimersByTime(61 * 1000) // past the 60s failure TTL, well under the 10-minute success TTL
        fetchMock.mockResolvedValueOnce({ version: "1.3.34" })

        expect(await getLatestDocVersion()).toBe("1.3")
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("parses a pre-release tag into its MAJOR.MINOR label", async () => {
        fetchMock.mockResolvedValue({ version: "2.0.0-rc10" })
        const { getLatestDocVersion } = await import("./docVersionsFetch")

        expect(await getLatestDocVersion()).toBe("2.0")
    })

    it("returns undefined for a malformed payload without throwing", async () => {
        fetchMock.mockResolvedValue({})
        const { getLatestDocVersion } = await import("./docVersionsFetch")

        expect(await getLatestDocVersion()).toBeUndefined()
    })
})

describe("getDocsLatestVersion", () => {
    // Asserted against DOCS_LATEST_OVERRIDE rather than a literal so these hold
    // whether or not a version is pinned: the invariant is `override ?? api`.
    it("prefers the pinned docs-latest over the GA release the API reports", async () => {
        fetchMock.mockResolvedValue({ version: "1.3.34" })
        const { getDocsLatestVersion } = await import("./docVersionsFetch")

        expect(await getDocsLatestVersion()).toBe(DOCS_LATEST_OVERRIDE ?? "1.3")
    })

    it("needs no API call to answer while a version is pinned", async () => {
        fetchMock.mockRejectedValue(new Error("down"))
        const { getDocsLatestVersion } = await import("./docVersionsFetch")

        // Unpinned this is undefined; pinned, an outage can't blank docs-latest.
        expect(await getDocsLatestVersion()).toBe(DOCS_LATEST_OVERRIDE)
    })
})

describe("getKnownDocVersions", () => {
    it("fetches and memoizes the known versions on success", async () => {
        fetchMock.mockResolvedValue([{ version: "1.3.0" }, { version: "1.2.0" }])
        const { getKnownDocVersions } = await import("./docVersionsFetch")

        expect(await getKnownDocVersions()).toEqual({ versions: ["1.3", "1.2"], ok: true })
        await getKnownDocVersions()
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("reports not-ok with empty versions on a cold-start failure", async () => {
        fetchMock.mockRejectedValue(new Error("network down"))
        const { getKnownDocVersions } = await import("./docVersionsFetch")

        expect(await getKnownDocVersions()).toEqual({ versions: [], ok: false })
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("reports not-ok while serving stale data on a later failure", async () => {
        fetchMock.mockResolvedValueOnce([{ version: "1.2.0" }])
        const { getKnownDocVersions } = await import("./docVersionsFetch")
        await getKnownDocVersions()

        vi.advanceTimersByTime(11 * 60 * 1000) // past the 10-minute TTL
        fetchMock.mockRejectedValueOnce(new Error("network down"))

        expect(await getKnownDocVersions()).toEqual({ versions: ["1.2"], ok: false })
    })

    it("retries a failure sooner than a fresh success (short negative-cache TTL)", async () => {
        fetchMock.mockRejectedValueOnce(new Error("network down"))
        const { getKnownDocVersions } = await import("./docVersionsFetch")
        expect(await getKnownDocVersions()).toEqual({ versions: [], ok: false })

        vi.advanceTimersByTime(61 * 1000) // past the 60s failure TTL, well under the 10-minute success TTL
        fetchMock.mockResolvedValueOnce([{ version: "1.2.0" }])

        expect(await getKnownDocVersions()).toEqual({ versions: ["1.2"], ok: true })
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })
})
