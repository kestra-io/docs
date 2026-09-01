import { describe, expect, it } from "vitest"
import type { GitHubRelease } from "~/utils/fetchChangelogVersions"
import {
    renderChangelogIndexMarkdown,
    renderReleaseMarkdown,
} from "~/utils/changelogMarkdown"

// Shaped like the GitHub releases payload after fetchMajorReleases(): the body is
// already Markdown with commit links rewritten.
const release = (over: Partial<GitHubRelease> = {}): GitHubRelease => ({
    tag_name: "v1.3.35",
    name: "v1.3.35",
    body: "## Changelog\n\n### 🐛 Bug Fixes",
    published_at: "2026-08-25T09:12:33Z",
    draft: false,
    prerelease: false,
    ...over,
})

describe("renderReleaseMarkdown", () => {
    it("prefixes the release body with the release name as an h1", () => {
        expect(renderReleaseMarkdown(release())).toBe(
            "# v1.3.35\n\n## Changelog\n\n### 🐛 Bug Fixes",
        )
    })

    it("falls back to the tag when the release has no name", () => {
        const md = renderReleaseMarkdown(release({ name: undefined }))
        expect(md.startsWith("# v1.3.35\n\n")).toBe(true)
    })

    it("does not emit 'undefined' when the body is missing", () => {
        const md = renderReleaseMarkdown(
            release({ body: undefined as unknown as string }),
        )
        expect(md).toBe("# v1.3.35\n\n")
    })
})

describe("renderChangelogIndexMarkdown", () => {
    it("links every release to its page with the publication date", () => {
        const md = renderChangelogIndexMarkdown([
            release(),
            release({ tag_name: "v1.0.57", name: "v1.0.57" }),
        ])

        expect(md).toContain(
            "- [v1.3.35](https://kestra.io/docs/changelog/v1.3.35) — 2026-08-25",
        )
        expect(md).toContain(
            "- [v1.0.57](https://kestra.io/docs/changelog/v1.0.57) — 2026-08-25",
        )
        expect(md.startsWith("# Release Notes\n")).toBe(true)
    })

    it("omits the separator when a release has no publication date", () => {
        const md = renderChangelogIndexMarkdown([
            release({ published_at: undefined as unknown as string }),
        ])

        expect(md).toContain(
            "- [v1.3.35](https://kestra.io/docs/changelog/v1.3.35)\n",
        )
        expect(md).not.toContain("—")
    })

    it("still renders a usable page when the release list is empty", () => {
        const md = renderChangelogIndexMarkdown([])
        expect(md).toContain("# Release Notes")
        expect(md).not.toContain("- [")
    })
})
