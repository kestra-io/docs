import { describe, expect, it } from "vitest"
import {
    buildChangelogEntry,
    commitUrl,
    isMajorRelease,
    parseReleaseBody,
} from "./parseRelease"

const SINGLE_EDITION_BODY = `## Changelog

### 📘 Subtasks
**version**
- 5f614e3 update to version '1.3.38'

### 🐛 Bug Fixes
**core**
- e84f5d8 reset pagination when returning to a list page (#18953), closes #18953

**iam**
- 11adee3 unauthenticated RCE via encoded-separator filter evasion

### 🏭 Tests
**core**
- d76e5c9 disable the HTTP basic-auth sanity checks (#19121), closes #19121


## Contributors
We'd like to thank the following people for their contributions:
Loïc Mathieu, github-actions[bot]
`

const SPLIT_EDITION_BODY = `## Kestra Open-Source Edition Changes

## Changelog

### 🚀 Features
**execution**
- 4e00b6d add dateFilter option to execution interval filter (#15905), closes #15905

## Contributors
We'd like to thank the following people for their contributions:
YannC

---

## Kestra Enterprise Edition Changes

## Changelog

### 🐛 Bug Fixes
**core**
- 73dac2f clear kill switch form when opening create dialog (#7697), closes #7629 #7697

## Contributors
We'd like to thank the following people for their contributions:
MilosPaunovic
`

describe("parseReleaseBody", () => {
    it("groups changes by category and scope", () => {
        const [edition] = parseReleaseBody(SINGLE_EDITION_BODY)

        expect(edition.label).toBeUndefined()
        expect(edition.groups.map((group) => group.title)).toEqual([
            "Bug Fixes",
            "Tests",
            "Subtasks",
        ])

        const [bugFixes] = edition.groups
        expect(bugFixes.changes).toEqual([
            {
                sha: "e84f5d8",
                scope: "core",
                message: "reset pagination when returning to a list page",
                pr: 18953,
            },
            {
                sha: "11adee3",
                scope: "iam",
                message: "unauthenticated RCE via encoded-separator filter evasion",
            },
        ])
    })

    it("drops the contributors roll call", () => {
        const titles = parseReleaseBody(SINGLE_EDITION_BODY)
            .flatMap((edition) => edition.groups)
            .map((group) => group.title)

        expect(titles).not.toContain("Contributors")
    })

    it("splits Open-Source and Enterprise sections, unlinking private SHAs", () => {
        const editions = parseReleaseBody(SPLIT_EDITION_BODY)

        expect(editions.map((edition) => edition.label)).toEqual([
            "Open-Source Edition",
            "Enterprise Edition",
        ])
        expect(commitUrl(editions[0].groups[0].changes[0])).toBe(
            "https://github.com/kestra-io/kestra/commit/4e00b6d",
        )
        expect(editions[1].groups[0].changes[0]).toEqual({
            scope: "core",
            message: "clear kill switch form when opening create dialog",
            pr: 7697,
        })
    })

    it("reads SHAs back out of link-rewritten bodies", () => {
        const [edition] = parseReleaseBody(`### 🐛 Bug Fixes
**core**
- [\`e84f5d8\`](https://github.com/kestra-io/kestra/commit/e84f5d8) reset pagination (#18953), closes #18953
`)

        expect(edition.groups[0].changes[0]).toEqual({
            sha: "e84f5d8",
            scope: "core",
            message: "reset pagination",
            pr: 18953,
        })
    })

    it("keeps the subject of a breaking change with a long italic body", () => {
        const [edition] = parseReleaseBody(`### 📢 Breaking Changes
**core**
- dd71be7 🚨 adopt RFC 9457 problem details as the single API error format (#17912) - *error responses no longer carry \`message\`, \`_links\` or
\`_embedded.errors[]\`.

Refs https://github.com/kestra-io/kestra/issues/9671*, closes #17912
`)

        expect(edition.groups[0].changes[0].message).toBe(
            "adopt RFC 9457 problem details as the single API error format",
        )
        expect(edition.groups[0].changes[0].pr).toBe(17912)
    })

    it("keeps unknown categories instead of dropping their changes", () => {
        const [edition] = parseReleaseBody(`### 🛸 Spaceships
- abc1234 launch something
`)

        expect(edition.groups[0]).toMatchObject({
            id: "spaceships",
            title: "Spaceships",
        })
        expect(edition.groups[0].changes[0].scope).toBeUndefined()
    })

    it("returns nothing for a body with no itemized changes", () => {
        expect(parseReleaseBody("")).toEqual([])
        expect(parseReleaseBody("## Changelog\n\nNothing to see here.")).toEqual([])
    })
})

describe("isMajorRelease", () => {
    it("treats a zero patch component as major", () => {
        expect(isMajorRelease("v2.0.0")).toBe(true)
        expect(isMajorRelease("v1.3.0")).toBe(true)
        expect(isMajorRelease("v1.3.38")).toBe(false)
    })
})

describe("buildChangelogEntry", () => {
    it("summarizes the release from its group counts", () => {
        const entry = buildChangelogEntry({
            tag_name: "v1.3.38",
            body: SINGLE_EDITION_BODY,
            published_at: "2026-09-08T12:26:31Z",
        })

        expect(entry.isMajor).toBe(false)
        expect(entry.totalChanges).toBe(4)
        expect(entry.summary).toBe("2 bug fixes, 1 test and 1 subtask.")
        expect(entry.githubUrl).toBe(
            "https://github.com/kestra-io/kestra/releases/tag/v1.3.38",
        )
    })

    it("falls back to a readable summary when nothing parses", () => {
        const entry = buildChangelogEntry({
            tag_name: "v1.0.0",
            body: "",
            published_at: "2026-01-01T00:00:00Z",
        })

        expect(entry.summary).toBe("No itemized changes in this release.")
        expect(entry.editions).toEqual([])
    })
})

describe("commitUrl", () => {
    it("derives the default repository link from the SHA", () => {
        expect(commitUrl({ sha: "e84f5d8", message: "x" })).toBe(
            "https://github.com/kestra-io/kestra/commit/e84f5d8",
        )
    })

    it("returns nothing without a SHA", () => {
        expect(commitUrl({ message: "x" })).toBeUndefined()
    })
})
