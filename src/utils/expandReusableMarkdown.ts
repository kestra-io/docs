import fs from "node:fs"
import path from "node:path"

// Text-level twin of the remark-snippet and remark-code-import plugins.
// The rendered site expands reusable content through the remark pipeline,
// but endpoints that serve raw markdown (/docs/*.md, /llms-full.txt, the
// copy-page-markdown action) read `doc.body` directly — this utility expands
// the same syntax there while leaving every other byte of the source intact.
//
// Expansion is fence-aware: reuse syntax inside a fenced code block (e.g. the
// contributor guide documenting the syntax itself) is left untouched, matching
// how the remark pipeline treats fence content as plain text.

const SNIPPETS_DIR = path.resolve("src/contents/docs/_snippets")

const FENCE_RE = /^(`{3,})(.*)$/
const SNIPPET_RE = /^::snippet\{name="([a-z0-9][a-z0-9/_-]*)"\}[ \t]*$/
const FILE_META_RE = /(?:^| )file=(\S+)/

const MAX_DEPTH = 3

function readSnippet(name: string): string {
    const filePath = path.join(SNIPPETS_DIR, `${name}.md`)
    if (path.relative(SNIPPETS_DIR, filePath).startsWith("..")) {
        throw new Error(`Snippet "${name}" resolves outside the snippets directory`)
    }
    return fs.readFileSync(filePath, "utf8").replace(/\n$/, "")
}

function readCodeImport(spec: string): string {
    const match = /^(?<path>.+?)(?:#L(?<from>\d+)(?<dash>-)?(?:L(?<to>\d+))?)?$/.exec(spec)
    if (!match?.groups?.path) {
        throw new Error(`Unable to parse code import path ${spec}`)
    }
    const filePath = path.resolve(match.groups.path)
    if (path.relative(process.cwd(), filePath).startsWith("..")) {
        throw new Error(`Code import "${spec}" resolves outside the repository`)
    }
    const lines = fs.readFileSync(filePath, "utf8").replace(/\n$/, "").split("\n")
    if (!match.groups.from) return lines.join("\n")
    const from = parseInt(match.groups.from, 10)
    const to = match.groups.to ? parseInt(match.groups.to, 10) : match.groups.dash ? lines.length : from
    return lines.slice(from - 1, to).join("\n")
}

export default function expandReusableMarkdown(markdown: string, depth = 0): string {
    if (depth > MAX_DEPTH) {
        throw new Error(`Snippet include depth exceeds ${MAX_DEPTH} — check for a snippet cycle`)
    }

    const lines = markdown.split("\n")
    const out: string[] = []
    let openFence: string | null = null

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const fenceMatch = FENCE_RE.exec(line)

        if (openFence) {
            out.push(line)
            if (fenceMatch && fenceMatch[1].length >= openFence.length && fenceMatch[2].trim() === "") {
                openFence = null
            }
            continue
        }

        if (fenceMatch) {
            const [, fence, meta] = fenceMatch
            const fileMatch = FILE_META_RE.exec(meta)
            const next = lines[i + 1]
            // Only the empty-block authoring form (open fence + immediate close)
            // is expanded — matching the convention documented in CONTENT_REUSE.md.
            if (fileMatch && next !== undefined && next.startsWith(fence) && next.trim() === fence) {
                const lang = meta.replace(fileMatch[0], "").trim()
                out.push(fence + lang, readCodeImport(fileMatch[1]), fence)
                i++
                continue
            }
            openFence = fence
            out.push(line)
            continue
        }

        const snippetMatch = SNIPPET_RE.exec(line)
        if (snippetMatch) {
            out.push(expandReusableMarkdown(readSnippet(snippetMatch[1]), depth + 1))
            continue
        }

        out.push(line)
    }

    return out.join("\n")
}
