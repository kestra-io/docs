import { describe, it, expect } from "vitest"
import { parseRequestedVersion, resolveVersionState } from "~/utils/plugins/versionState"

describe("parseRequestedVersion", () => {
    it("extracts a vX.Y.Z segment and strips it from the canonical path", () => {
        const r = parseRequestedVersion(
            ["plugin-fs", "v2.6.0", "io.kestra.plugin.fs.ftp.upload"],
            "/plugins/plugin-fs/v2.6.0/io.kestra.plugin.fs.ftp.upload",
        )
        expect(r.version).toBe("2.6.0")
        expect(r.splitRouteSlug).toEqual(["plugin-fs", "io.kestra.plugin.fs.ftp.upload"])
        expect(r.canonicalPathname).toBe("/plugins/plugin-fs/io.kestra.plugin.fs.ftp.upload")
    })

    it("treats a URL with no version segment as unversioned (canonical = pathname)", () => {
        const r = parseRequestedVersion(
            ["plugin-fs", "io.kestra.plugin.fs.ftp.upload"],
            "/plugins/plugin-fs/io.kestra.plugin.fs.ftp.upload",
        )
        expect(r.version).toBeUndefined()
        expect(r.splitRouteSlug).toEqual(["plugin-fs", "io.kestra.plugin.fs.ftp.upload"])
        expect(r.canonicalPathname).toBe("/plugins/plugin-fs/io.kestra.plugin.fs.ftp.upload")
    })

    it("handles a version segment at the plugin root (no trailing path)", () => {
        const r = parseRequestedVersion(["plugin-fs", "v2.6.0"], "/plugins/plugin-fs/v2.6.0")
        expect(r.version).toBe("2.6.0")
        expect(r.splitRouteSlug).toEqual(["plugin-fs"])
        expect(r.canonicalPathname).toBe("/plugins/plugin-fs")
    })

    it("does not treat a non-version second segment (a subgroup) as a version", () => {
        const r = parseRequestedVersion(["plugin-fs", "ftp"], "/plugins/plugin-fs/ftp")
        expect(r.version).toBeUndefined()
        expect(r.splitRouteSlug).toEqual(["plugin-fs", "ftp"])
    })

    it("requires the full vX.Y.Z shape (a partial 'v2.6' is not a version)", () => {
        expect(parseRequestedVersion(["p", "v2.6"], "/plugins/p/v2.6").version).toBeUndefined()
        expect(parseRequestedVersion(["p", "2.6.0"], "/plugins/p/2.6.0").version).toBeUndefined()
    })
})

describe("resolveVersionState", () => {
    it("flags an older version as archived", () => {
        const s = resolveVersionState(
            parseRequestedVersion(["plugin-fs", "v2.6.0"], "/plugins/plugin-fs/v2.6.0"),
            "2.10.0",
        )
        expect(s.isArchived).toBe(true)
        expect(s.isLatestRequested).toBe(false)
    })

    it("flags the latest version as latest-requested (caller should canonical-redirect)", () => {
        const s = resolveVersionState(
            parseRequestedVersion(["plugin-fs", "v2.10.0"], "/plugins/plugin-fs/v2.10.0"),
            "2.10.0",
        )
        expect(s.isLatestRequested).toBe(true)
        expect(s.isArchived).toBe(false)
        expect(s.canonicalPathname).toBe("/plugins/plugin-fs")
    })

    it("is neither archived nor latest-requested when no version is in the URL", () => {
        const s = resolveVersionState(
            parseRequestedVersion(["plugin-fs"], "/plugins/plugin-fs"),
            "2.10.0",
        )
        expect(s.isArchived).toBe(false)
        expect(s.isLatestRequested).toBe(false)
    })

    it("treats a versioned URL as archived when the latest is unknown (releases fetch failed)", () => {
        const s = resolveVersionState(
            parseRequestedVersion(["plugin-fs", "v2.6.0"], "/plugins/plugin-fs/v2.6.0"),
            undefined,
        )
        expect(s.isArchived).toBe(true)
        expect(s.isLatestRequested).toBe(false)
    })
})
