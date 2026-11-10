import { beforeEach, describe, expect, it, vi } from "vitest"

const { execFileSync } = vi.hoisted(() => ({ execFileSync: vi.fn() }))
vi.mock("child_process", () => ({ execFileSync }))

const ROOT = "/repo"
const LOG = [
    "@@2026-09-11T16:45:41+02:00",
    "",
    "src/contents/docs/a/index.md",
    "src/contents/docs/b/index.md",
    "",
    "@@2026-09-09T17:09:05+05:30",
    "",
    "src/contents/docs/a/index.md",
    "src/contents/blogs/post/index.md",
    "",
].join("\n")

const gitMock = (log = LOG) =>
    execFileSync.mockImplementation((_cmd: string, args: string[]) =>
        args[0] === "rev-parse" ? `${ROOT}\n` : log,
    )

beforeEach(() => {
    execFileSync.mockReset()
    vi.resetModules()
    vi.spyOn(process, "cwd").mockReturnValue(ROOT)
})

describe("gitLastModified", () => {
    it("takes the newest commit that touched the file", async () => {
        gitMock()
        const { gitLastModified } = await import("./sitemap")
        expect(gitLastModified("src/contents/docs/a/index.md")?.toISOString()).toBe(
            "2026-09-11T14:45:41.000Z",
        )
        expect(gitLastModified("src/contents/blogs/post/index.md")?.toISOString()).toBe(
            "2026-09-09T11:39:05.000Z",
        )
    })

    it("spawns git once for the whole build instead of once per file", async () => {
        gitMock()
        const { gitLastModified } = await import("./sitemap")
        gitLastModified("src/contents/docs/a/index.md")
        gitLastModified("src/contents/docs/b/index.md")
        gitLastModified("src/contents/blogs/post/index.md")
        const spawned = execFileSync.mock.calls.map(([, args]) => args as string[])
        const logs = spawned.filter((args) => args.includes("log"))
        expect(logs).toHaveLength(1)
        expect(spawned.filter((args) => args[0] === "rev-parse")).toHaveLength(1)
        // Rename detection reads blobs (a lazy download on a blobless clone) and
        // quoted paths would not match the keys callers look up.
        expect(logs[0]).toContain("--no-renames")
        expect(logs[0]).toContain("core.quotePath=false")
    })

    it("resolves absolute paths against the repository root", async () => {
        gitMock()
        const { gitLastModified } = await import("./sitemap")
        expect(gitLastModified(`${ROOT}/src/contents/docs/b/index.md`)).not.toBeNull()
    })

    it("returns null for untracked files", async () => {
        gitMock()
        const { gitLastModified } = await import("./sitemap")
        expect(gitLastModified("src/contents/docs/missing.md")).toBeNull()
    })

    it("skips files under a commit whose date can't be parsed", async () => {
        gitMock(["@@not-a-date", "", "src/contents/docs/a/index.md", ""].join("\n"))
        const { gitLastModified } = await import("./sitemap")
        expect(gitLastModified("src/contents/docs/a/index.md")).toBeNull()
    })

    it("returns null when git is unavailable", async () => {
        execFileSync.mockImplementation(() => {
            throw new Error("git: not found")
        })
        const { gitLastModified } = await import("./sitemap")
        expect(gitLastModified("src/contents/docs/a/index.md")).toBeNull()
    })
})
