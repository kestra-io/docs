import type { GitHubRelease } from "~/utils/fetchChangelogVersions"

export interface ChangelogChange {
    sha?: string
    scope?: string
    message: string
    pr?: number
}

export interface ChangelogGroup {
    id: string
    title: string
    changes: ChangelogChange[]
}

export interface ChangelogEdition {
    label?: string
    groups: ChangelogGroup[]
}

export interface ChangelogEntry {
    tag: string
    title: string
    publishedAt: string
    isMajor: boolean
    summary: string
    editions: ChangelogEdition[]
    totalChanges: number
    githubUrl: string
}

interface CategoryDefinition {
    id: string
    title: string
    priority: number
    noun: [string, string]
}

const CATEGORIES: Record<string, CategoryDefinition> = {
    "breaking changes": {
        id: "breaking-changes",
        title: "Breaking Changes",
        priority: 0,
        noun: ["breaking change", "breaking changes"],
    },
    features: {
        id: "features",
        title: "Features",
        priority: 1,
        noun: ["feature", "features"],
    },
    "bug fixes": {
        id: "bug-fixes",
        title: "Bug Fixes",
        priority: 2,
        noun: ["bug fix", "bug fixes"],
    },
    changes: {
        id: "changes",
        title: "Changes",
        priority: 3,
        noun: ["change", "changes"],
    },
    documentation: {
        id: "documentation",
        title: "Documentation",
        priority: 4,
        noun: ["documentation update", "documentation updates"],
    },
    tests: {
        id: "tests",
        title: "Tests",
        priority: 5,
        noun: ["test", "tests"],
    },
    build: {
        id: "build",
        title: "Build",
        priority: 6,
        noun: ["build change", "build changes"],
    },
    subtasks: {
        id: "subtasks",
        title: "Subtasks",
        priority: 7,
        noun: ["subtask", "subtasks"],
    },
    merge: {
        id: "merge",
        title: "Merge",
        priority: 8,
        noun: ["merge", "merges"],
    },
}

const FALLBACK_CATEGORY: Omit<CategoryDefinition, "id" | "title"> = {
    priority: 9,
    noun: ["change", "changes"],
}

const EDITION_HEADINGS: Record<string, string> = {
    "kestra open-source edition changes": "Open-Source Edition",
    "kestra enterprise edition changes": "Enterprise Edition",
}

const CATEGORY_HEADING = /^#{2,4}\s+(.+?)\s*$/
const SCOPE_LINE = /^\*\*(.+?)\*\*\s*$/
const INLINE_SCOPE = /^\*\*(.+?)\*\*\s*:?\s*/
const THEMATIC_BREAK = /^(?:-{3,}|\*{3,}|_{3,})$/
const CHANGE_LINE =
    /^[-*]\s+(?:\[`([0-9a-f]{7,40})`\]\(\S+?\)|([0-9a-f]{7,40})\b)?\s*(.*)$/i
const CLOSES_SUFFIX = /,?\s*closes(\s+#\d+)+\s*$/i
const LEADING_EMOJI = /^[\p{Extended_Pictographic}️‍]+\s*/u
const HEADING_EMOJI = /^[\p{Extended_Pictographic}️‍\s]+/u

const COMMIT_BASE_URL = "https://github.com/kestra-io/kestra/commit"

function normalizeHeading(heading: string): string {
    return heading.replace(HEADING_EMOJI, "").trim().toLowerCase()
}

function titleCase(heading: string): string {
    return heading.replace(/\b\w/g, (character) => character.toUpperCase())
}

function categoryFor(heading: string): CategoryDefinition {
    const normalized = normalizeHeading(heading)
    return (
        CATEGORIES[normalized] ?? {
            ...FALLBACK_CATEGORY,
            id: normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "other",
            title: titleCase(normalized),
        }
    )
}

function cleanMessage(message: string): { message: string; pr?: number } {
    let cleaned = message.replace(CLOSES_SUFFIX, "").trim()
    cleaned = cleaned.replace(LEADING_EMOJI, "").trim()

    cleaned = cleaned.split(/\s+-\s+\*/)[0].trim()

    const prMatch = cleaned.match(/\(#(\d+)\)\s*$/)
    const pr = prMatch ? Number(prMatch[1]) : undefined
    if (prMatch) {
        cleaned = cleaned.slice(0, prMatch.index).trim()
    }

    cleaned = cleaned.replace(/[\s,;-]+$/, "").trim()

    return { message: cleaned, pr }
}

function pluralize(count: number, [singular, plural]: [string, string]): string {
    return `${count} ${count === 1 ? singular : plural}`
}

function buildSummary(editions: ChangelogEdition[]): string {
    const counts = new Map<string, { count: number; definition: CategoryDefinition }>()

    for (const edition of editions) {
        for (const group of edition.groups) {
            const definition = categoryFor(group.title)
            const current = counts.get(definition.id)
            counts.set(definition.id, {
                definition,
                count: (current?.count ?? 0) + group.changes.length,
            })
        }
    }

    const parts = [...counts.values()]
        .sort((a, b) => a.definition.priority - b.definition.priority)
        .slice(0, 3)
        .map(({ count, definition }) => pluralize(count, definition.noun))

    if (parts.length === 0) {
        return "No itemized changes in this release."
    }
    if (parts.length === 1) {
        return `${parts[0]}.`
    }

    return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}.`
}


export function parseReleaseBody(body: string): ChangelogEdition[] {
    const editions: ChangelogEdition[] = []
    let edition: ChangelogEdition | undefined
    let group: ChangelogGroup | undefined
    let scope: string | undefined
    let pending: string[] = []

    const flushPending = () => {
        if (!group || pending.length === 0) {
            pending = []
            return
        }

        const match = pending.join(" ").match(CHANGE_LINE)
        pending = []
        if (!match) {
            return
        }

        const [, linkedSha, bareSha, rest] = match

        const sha = edition?.label === EDITION_HEADINGS["kestra enterprise edition changes"]
            ? undefined
            : (linkedSha ?? bareSha)
        let subject = rest ?? ""
        let changeScope = scope
        const inlineScope = subject.match(INLINE_SCOPE)
        if (inlineScope) {
            changeScope = inlineScope[1].trim()
            subject = subject.slice(inlineScope[0].length)
        }

        const { message, pr } = cleanMessage(subject)
        if (!message) {
            return
        }

        group.changes.push({
            ...(sha ? { sha } : {}),
            ...(changeScope ? { scope: changeScope } : {}),
            message,
            ...(pr ? { pr } : {}),
        })
    }

    const openEdition = (label?: string) => {
        flushPending()
        group = undefined
        scope = undefined
        edition = { ...(label ? { label } : {}), groups: [] }
        editions.push(edition)
    }

    for (const rawLine of (body ?? "").split(/\r?\n/)) {
        const line = rawLine.trim()


        if (THEMATIC_BREAK.test(line)) {
            flushPending()
            continue
        }

        const heading = line.match(CATEGORY_HEADING)
        if (heading) {
            flushPending()
            const normalized = normalizeHeading(heading[1])

            if (normalized in EDITION_HEADINGS) {
                openEdition(EDITION_HEADINGS[normalized])
                continue
            }
            if (normalized === "contributors" || normalized === "changelog") {
                group = undefined
                scope = undefined
                continue
            }

            if (!edition) {
                openEdition()
            }
            const definition = categoryFor(heading[1])
            group = {
                id: definition.id,
                title: definition.title,
                changes: [],
            }
            scope = undefined
            edition!.groups.push(group)
            continue
        }

        const scopeLine = line.match(SCOPE_LINE)
        if (scopeLine && group) {
            flushPending()
            scope = scopeLine[1].trim()
            continue
        }

        if (/^[-*]\s+/.test(line)) {
            flushPending()
            pending = [line]
            continue
        }

        if (line && pending.length > 0) {
            pending.push(line)
        }
    }

    flushPending()

    return editions
        .map((item) => ({
            ...item,
            groups: item.groups
                .filter((entry) => entry.changes.length > 0)
                .sort(
                    (a, b) =>
                        categoryFor(a.title).priority - categoryFor(b.title).priority,
                ),
        }))
        .filter((item) => item.groups.length > 0)
}

export type ReleaseInput = Pick<GitHubRelease, "tag_name" | "name" | "body" | "published_at">

export function isMajorRelease(tag: string): boolean {
    return tag.replace(/^v/, "").split(".").pop() === "0"
}

export function buildChangelogEntry(release: ReleaseInput): ChangelogEntry {
    const editions = parseReleaseBody(release.body ?? "")
    const totalChanges = editions.reduce(
        (total, edition) =>
            total +
            edition.groups.reduce((count, group) => count + group.changes.length, 0),
        0,
    )

    return {
        tag: release.tag_name,
        title: release.name || release.tag_name,
        publishedAt: release.published_at,
        isMajor: isMajorRelease(release.tag_name),
        summary: buildSummary(editions),
        editions,
        totalChanges,
        githubUrl: `https://github.com/kestra-io/kestra/releases/tag/${release.tag_name}`,
    }
}

export function buildChangelogEntries(releases: ReleaseInput[]): ChangelogEntry[] {
    return releases.map(buildChangelogEntry)
}

export function commitUrl(change: ChangelogChange): string | undefined {
    return change.sha ? `${COMMIT_BASE_URL}/${change.sha}` : undefined
}
