// Content reuse scanner — supports the strategy in CONTENT_REUSE.md.
//
// Finds two things grep cannot:
//   1. Near-duplicate blocks: paragraphs/code blocks across docs pages that say
//      the same thing in slightly different words (variant proliferation).
//   2. Snippet shadows: prose that resembles an existing _snippets/ fragment
//      but does not use it — a forked variant of shared content.
//
// Usage: node scripts/content-reuse-scan.mjs [--threshold 0.6] [--min-chars 120]

import fs from "node:fs"
import path from "node:path"

const DOCS_DIR = path.resolve("src/contents/docs")
const SNIPPETS_DIR = path.join(DOCS_DIR, "_snippets")

const args = process.argv.slice(2)
const argValue = (flag, fallback) => {
    const i = args.indexOf(flag)
    return i > -1 ? Number(args[i + 1]) : fallback
}
const THRESHOLD = argValue("--threshold", 0.6)
const MIN_CHARS = argValue("--min-chars", 120)
const SHADOW_THRESHOLD = argValue("--shadow-threshold", 0.4)
const SHINGLE_SIZE = 5

function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name)
        return entry.isDirectory() ? walk(full) : [full]
    })
}

// Split a markdown body into blocks (paragraphs and whole fenced code blocks),
// keeping the starting line number of each block.
function extractBlocks(body, startLine) {
    const blocks = []
    let current = []
    let currentStart = null
    let fence = null
    const lines = body.split("\n")
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const fenceMatch = /^(`{3,})/.exec(line)
        if (fence) {
            current.push(line)
            if (fenceMatch && fenceMatch[1].length >= fence.length) fence = null
            continue
        }
        if (fenceMatch) {
            fence = fenceMatch[1]
            if (currentStart === null) currentStart = i
            current.push(line)
            continue
        }
        if (line.trim() === "") {
            if (current.length) blocks.push({ line: startLine + currentStart, text: current.join("\n") })
            current = []
            currentStart = null
            continue
        }
        if (currentStart === null) currentStart = i
        current.push(line)
    }
    if (current.length) blocks.push({ line: startLine + currentStart, text: current.join("\n") })
    return blocks
}

function normalize(text) {
    return text
        .replace(/```[a-z]*[^\n]*/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/:{2,}[a-z-]*(\{[^}]*\})?/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/[`*_#>|-]/g, " ")
        .replace(/[^a-z0-9\s./:]/gi, " ")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
}

function shingles(normalized) {
    const words = normalized.split(" ")
    const set = new Set()
    for (let i = 0; i + SHINGLE_SIZE <= words.length; i++) {
        set.add(words.slice(i, i + SHINGLE_SIZE).join(" "))
    }
    return set
}

function jaccard(a, b) {
    let inter = 0
    const [small, large] = a.size <= b.size ? [a, b] : [b, a]
    for (const s of small) if (large.has(s)) inter++
    return inter / (a.size + b.size - inter)
}

// ---- Load docs blocks ----
const pages = walk(DOCS_DIR).filter(
    (f) => /\.mdx?$/.test(f) && !f.startsWith(SNIPPETS_DIR + path.sep),
)

const blocks = []
for (const file of pages) {
    const raw = fs.readFileSync(file, "utf8")
    const fmMatch = /^---\n[\s\S]*?\n---\n/.exec(raw)
    const body = fmMatch ? raw.slice(fmMatch[0].length) : raw
    const bodyStartLine = fmMatch ? fmMatch[0].split("\n").length : 1
    for (const block of extractBlocks(body, bodyStartLine)) {
        const normalized = normalize(block.text)
        if (normalized.length < MIN_CHARS) continue
        const sh = shingles(normalized)
        if (sh.size < 4) continue
        blocks.push({
            file: path.relative(process.cwd(), file),
            line: block.line,
            preview: normalized.slice(0, 110),
            shingles: sh,
        })
    }
}

// ---- 1. Near-duplicate blocks via shingle inverted index ----
const index = new Map()
blocks.forEach((block, id) => {
    for (const s of block.shingles) {
        if (!index.has(s)) index.set(s, [])
        index.get(s).push(id)
    }
})

const pairCounts = new Map()
for (const ids of index.values()) {
    if (ids.length < 2 || ids.length > 50) continue
    for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
            const key = ids[i] * blocks.length + ids[j]
            pairCounts.set(key, (pairCounts.get(key) || 0) + 1)
        }
    }
}

const parent = blocks.map((_, i) => i)
const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])))
const matches = []
for (const [key, count] of pairCounts) {
    if (count < 3) continue
    const a = Math.floor(key / blocks.length)
    const b = key % blocks.length
    if (blocks[a].file === blocks[b].file) continue
    const sim = jaccard(blocks[a].shingles, blocks[b].shingles)
    if (sim >= THRESHOLD) {
        matches.push({ a, b, sim })
        parent[find(a)] = find(b)
    }
}

const clusters = new Map()
for (const { a, b, sim } of matches) {
    const root = find(a)
    if (!clusters.has(root)) clusters.set(root, { members: new Set(), maxSim: 0 })
    const cluster = clusters.get(root)
    cluster.members.add(a).add(b)
    cluster.maxSim = Math.max(cluster.maxSim, sim)
}

console.log(`# Near-duplicate blocks (Jaccard >= ${THRESHOLD}, ${blocks.length} blocks scanned)\n`)
const sorted = [...clusters.values()].sort(
    (x, y) => y.members.size - x.members.size || y.maxSim - x.maxSim,
)
for (const { members, maxSim } of sorted) {
    console.log(`## cluster of ${members.size} (max similarity ${maxSim.toFixed(2)})`)
    for (const id of members) {
        console.log(`- ${blocks[id].file}:${blocks[id].line}  "${blocks[id].preview}..."`)
    }
    console.log("")
}
if (!sorted.length) console.log("(none)\n")

// ---- 2. Snippet shadows ----
console.log(`\n# Snippet shadows (Jaccard >= ${SHADOW_THRESHOLD} against _snippets content)\n`)
const snippetTexts = walk(SNIPPETS_DIR)
    .filter((f) => !f.endsWith("README.md"))
    .map((f) => ({
        name: path.relative(SNIPPETS_DIR, f),
        shingles: shingles(normalize(fs.readFileSync(f, "utf8"))),
    }))
    .filter((s) => s.shingles.size >= 4)

let shadowCount = 0
for (const snippet of snippetTexts) {
    for (const block of blocks) {
        const sim = jaccard(snippet.shingles, block.shingles)
        if (sim >= SHADOW_THRESHOLD) {
            shadowCount++
            console.log(
                `- ${block.file}:${block.line} resembles _snippets/${snippet.name} (${sim.toFixed(2)})  "${block.preview}..."`,
            )
        }
    }
}
if (!shadowCount) console.log("(none)")
