import { describe, expect, it } from "vitest"
import { buildChangelogMarkdown, formatReleaseDate } from "./markdown"
import { buildChangelogEntry } from "./parseRelease"

const ENTRY = buildChangelogEntry({
    tag_name: "v1.3.38",
    published_at: "2026-09-08T12:26:31Z",
    body: `## Changelog

### 🐛 Bug Fixes
**core**
- e84f5d8 reset pagination when returning to a list page (#18953), closes #18953

## Contributors
Loïc Mathieu
`,
})

describe("formatReleaseDate", () => {
    it("renders a long date", () => {
        expect(formatReleaseDate("2026-09-08T12:26:31Z")).toBe("September 8, 2026")
    })
})

describe("buildChangelogMarkdown", () => {
    it("renders each release with its groups and links", () => {
        expect(buildChangelogMarkdown([ENTRY])).toBe(
            `# Changelog

Product updates and improvements.

## v1.3.38 — Minor · September 8, 2026

1 bug fix.

### Bug Fixes

- [\`e84f5d8\`](https://github.com/kestra-io/kestra/commit/e84f5d8) **core**: reset pagination when returning to a list page ([#18953](https://github.com/kestra-io/kestra/issues/18953))

[Release notes on GitHub](https://github.com/kestra-io/kestra/releases/tag/v1.3.38)
`,
        )
    })

    it("nests groups under their edition heading when a release is split", () => {
        const split = buildChangelogEntry({
            tag_name: "v1.3.17",
            published_at: "2026-01-01T00:00:00Z",
            body: `## Kestra Enterprise Edition Changes

### 🐛 Bug Fixes
**core**
- 73dac2f clear kill switch form
`,
        })

        const markdown = buildChangelogMarkdown([split])
        expect(markdown).toContain("### Enterprise Edition")
        expect(markdown).toContain("#### Bug Fixes")
        // Enterprise SHAs are private, so they must not become links.
        expect(markdown).not.toContain("73dac2f")
    })
})
