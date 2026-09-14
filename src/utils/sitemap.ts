import { execFileSync } from "child_process"
import path from "path"

type SitemapEntry = string | { loc: string; lastmod?: string | null }

// Marks commit-date lines in the log so they can't be mistaken for a file path.
const DATE_MARKER = "@@"

let lastCommitDates: Map<string, Date> | undefined

const git = (args: string[]): string =>
    execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })

/** Last commit date per repo-relative path from one `git log` (newest first),
 * instead of one spawn per sitemap entry. */
const loadLastCommitDates = (): Map<string, Date> => {
    const dates = new Map<string, Date>()
    let log: string
    try {
        log = git(["-c", "core.quotePath=false", "log", `--format=${DATE_MARKER}%cI`, "--name-only"])
    } catch {
        return dates
    }
    let current: Date | undefined
    for (const line of log.split("\n")) {
        if (line.startsWith(DATE_MARKER)) {
            const date = new Date(line.slice(DATE_MARKER.length))
            current = Number.isNaN(date.getTime()) ? undefined : date
        } else if (line && current && !dates.has(line)) {
            dates.set(line, current)
        }
    }
    return dates
}

let repoRoot: string | undefined

const loadRepoRoot = (): string => {
    try {
        return git(["rev-parse", "--show-toplevel"]).trim() || process.cwd()
    } catch {
        return process.cwd()
    }
}

/** Date of the last commit touching the file, or null when untracked or git fails. */
export const gitLastModified = (filePath: string): Date | null => {
    lastCommitDates ??= loadLastCommitDates()
    if (lastCommitDates.size === 0) return null
    repoRoot ??= loadRepoRoot()
    const relative = path.relative(repoRoot, path.resolve(process.cwd(), filePath))
    return lastCommitDates.get(relative.split(path.sep).join("/")) ?? null
}

export const formatLastMod = (d?: string | Date | null): string | null => {
    if (!d) return null
    const date = d instanceof Date ? d : new Date(d)
    if (Number.isNaN(date.getTime())) return null
    // Use full datetime in ISO 8601. Convert trailing Z to +00:00 for readability.
    const iso = date.toISOString()
    return iso.endsWith("Z") ? iso.replace(/Z$/, "+00:00") : iso
}

export const sitemapResponse = (entries: SitemapEntry[]): Response => {
    const normalized = entries.map((e) => (typeof e === "string" ? { loc: e } : e))

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
    ${normalized
            .map((r) =>
                r.lastmod
                    ? `<url><loc>${r.loc}</loc><lastmod>${r.lastmod}</lastmod></url>`
                    : `<url><loc>${r.loc}</loc></url>`,
            )
            .join("\n    ")}
</urlset>`

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
        },
    })
}