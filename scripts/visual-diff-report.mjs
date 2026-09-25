#!/usr/bin/env node
import { execFileSync } from "node:child_process"
import { mkdirSync, copyFileSync, writeFileSync, rmSync } from "node:fs"
import { basename, join } from "node:path"
import { ODiffServer } from "odiff-bin"
import { PAGES, VISUAL_ONLY_PAGES } from "../tests/fixtures/page-sample.mjs"
import {
    SCREENSHOT_COMPARE,
    compareSummary,
} from "../tests/fixtures/screenshot-options.mjs"

const SNAPSHOT_DIR = "tests/visual-regression.spec.ts-snapshots"
const DEFAULT_OUT = "visual-diff-report"
const DIFF_COLOR = "#ff0055"

const args = process.argv.slice(2)
const flag = (name, fallback) => {
    const i = args.indexOf(`--${name}`)
    return i === -1 || args[i + 1] === undefined ? fallback : args[i + 1]
}

const snapshotDir = flag("dir", SNAPSHOT_DIR)
const outDir = flag("out", DEFAULT_OUT)
const baseRef = flag("base", "HEAD")

const git = (...a) => execFileSync("git", a, { encoding: "utf8" })

/** Parse `git status --porcelain -z`, which is NUL separated and appends a
 * second path for renames. */
function changedSnapshots() {
    const raw = execFileSync(
        "git",
        ["status", "--porcelain=v1", "-z", "--untracked-files=all", "--", snapshotDir],
        { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    )
    const fields = raw.split("\0").filter(Boolean)
    const entries = []

    for (let i = 0; i < fields.length; i++) {
        const code = fields[i].slice(0, 2)
        const path = fields[i].slice(3)
        if (code[0] === "R" || code[0] === "C") i++ // consume the old path
        if (!path.endsWith(".png")) continue

        const gone = code.includes("D")
        const fresh = code === "??" || code.includes("A") || code[0] === "R"
        entries.push({ path, status: gone ? "removed" : fresh ? "added" : "changed" })
    }

    return entries.sort((a, b) => a.path.localeCompare(b.path))
}

// Playwright slugs a label by replacing each non-word run with "-", so the
// slug alone cannot say which hyphens were in the label ("Use Case CI-CD").
const BY_SLUG = new Map(
    [...PAGES, ...VISUAL_ONLY_PAGES].map((page) => [
        page.label.replace(/[^\w]+/g, "-"),
        page,
    ]),
)

/** Snapshots are named `<Label>-<project>-<platform>.png` by Playwright. */
function describe(path) {
    const file = basename(path, ".png")
    const m = /^(.*)-(desktop|tablet|mobile)-(.+)$/.exec(file)
    if (!m) return { label: file, project: "unknown", platform: "unknown" }

    const known = BY_SLUG.get(m[1])
    return {
        label: known?.label ?? m[1].replace(/-/g, " ").trim(),
        page: known?.path,
        project: m[2],
        platform: m[3],
    }
}

function writeBaseline(path, dest) {
    const buf = execFileSync("git", ["show", `${baseRef}:${path}`], {
        maxBuffer: 256 * 1024 * 1024,
    })
    writeFileSync(dest, buf)
}

const esc = (s) =>
    String(s).replace(
        /[&<>"']/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    )

const pct = (n) => `${n.toFixed(4)}%`

function entryCard(entry, i) {
    const { label, project, platform, status, diff } = entry
    const name = `${label} · ${project}`
    const views = []
    if (entry.files.diff) views.push(["diff", "Diff"])
    if (entry.files.baseline && entry.files.current) views.push(["slider", "Slider"])
    if (entry.files.baseline) views.push(["baseline", "Before"])
    if (entry.files.current) views.push(["current", "After"])

    // The radios sit as direct siblings of .stage so `~` can reach it.
    const radios = views
        .map(
            ([v, txt], n) =>
                `<input type="radio" id="v${i}-${v}" name="view-${i}" class="vr vr-${v}"${
                    n === 0 ? " checked" : ""
                }><label class="vl" for="v${i}-${v}">${txt}</label>`,
        )
        .join("")

    const stats =
        status === "changed" && diff?.reason === "pixel-diff"
            ? `<span class="stat">${diff.diffCount.toLocaleString("en-US")} px</span><span class="stat">${pct(diff.diffPercentage)}</span>`
            : status === "changed" && diff?.reason === "layout-diff"
              ? `<span class="stat">size changed</span>`
              : ""

    const img = (kind) =>
        entry.files[kind]
            ? `<img class="im im-${kind}" loading="lazy" src="${esc(entry.files[kind])}" alt="${esc(kind)} ${esc(name)}">`
            : ""

    const slider =
        entry.files.baseline && entry.files.current
            ? `<div class="im im-slider"><img class="under" loading="lazy" src="${esc(entry.files.current)}" alt="after ${esc(name)}"><div class="over"><img loading="lazy" src="${esc(entry.files.baseline)}" alt="before ${esc(name)}"></div></div>`
            : ""

    return `<article class="entry" data-status="${status}" id="e${i}">
  <header>
    <h2><a href="#e${i}">${esc(name)}</a></h2>
    <div class="meta"><span class="badge b-${status}">${status}</span>${stats}<span class="stat">${esc(platform)}</span></div>
  </header>
  ${radios}
  <div class="stage">${img("diff")}${slider}${img("baseline")}${img("current")}</div>
</article>`
}

const CSS = `
:root {
  --bg: #16161d; --panel: #1e1e28; --line: #2e2e3c; --fg: #e6e6ef; --dim: #9a9ab0;
  --accent: #8405ff; --added: #21b17a; --removed: #e0405e; --changed: #e0a800;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg);
  font: 14px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
a { color: inherit; text-decoration: none; }
h1 { font-size: 20px; margin: 0; }
h2 { font-size: 15px; margin: 0; font-weight: 600; }
.wrap { max-width: 1600px; margin: 0 auto; padding: 24px 20px 80px; }
.summary { display: flex; flex-wrap: wrap; gap: 8px 28px; align-items: baseline;
  padding: 16px 20px; background: var(--panel); border: 1px solid var(--line); border-radius: 10px; }
.summary dl { display: flex; gap: 28px; margin: 0; flex-wrap: wrap; }
.summary div { display: flex; flex-direction: column; }
.summary dt { color: var(--dim); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }
.summary dd { margin: 0; font-size: 18px; font-variant-numeric: tabular-nums; }
.toolbar { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; gap: 10px;
  padding: 12px 0; background: var(--bg); }
.toolbar label { padding: 5px 12px; border: 1px solid var(--line); border-radius: 99px;
  color: var(--dim); cursor: pointer; user-select: none; }
.toolbar label:hover { color: var(--fg); }
.filters, .modes { display: flex; gap: 6px; }

/* Radio state drives every view; no scripting in this report. */
input.gr, input.vr { position: absolute; opacity: 0; pointer-events: none; }
.gr:checked + label { background: var(--accent); border-color: var(--accent); color: #fff; }

#f-changed:checked ~ .wrap .entry:not([data-status="changed"]),
#f-added:checked ~ .wrap .entry:not([data-status="added"]),
#f-removed:checked ~ .wrap .entry:not([data-status="removed"]) { display: none; }
#z-fit:checked ~ .wrap .stage { max-height: 70vh; overflow: auto; }
/* Clip the slider itself rather than scrolling it, so its resize grip
   stays at the bottom right of what you can actually see. */
#z-fit:checked ~ .wrap .im-slider { max-height: calc(70vh - 16px); overflow: hidden; }

.entry { display: flex; flex-wrap: wrap; align-items: center; column-gap: 6px;
  margin: 20px 0; background: var(--panel); border: 1px solid var(--line);
  border-radius: 10px; overflow: hidden; }
.entry > header, .entry > .stage { flex: 0 0 100%; }
.entry > header { display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center;
  justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--line); }
.meta { display: flex; gap: 8px; align-items: center; }
.badge { padding: 2px 9px; border-radius: 99px; font-size: 11px; text-transform: uppercase;
  letter-spacing: .05em; color: #14141a; }
.b-changed { background: var(--changed); }
.b-added { background: var(--added); }
.b-removed { background: var(--removed); }
.stat { color: var(--dim); font-size: 12px; font-variant-numeric: tabular-nums; }
.vl { margin: 10px 0; padding: 4px 11px; border: 1px solid var(--line); border-radius: 99px;
  font-size: 12px; color: var(--dim); cursor: pointer; user-select: none; }
.vl:first-of-type { margin-left: 16px; }
.vl:hover { color: var(--fg); }
.vr:checked + .vl { background: var(--accent); border-color: var(--accent); color: #fff; }

.stage { container-type: inline-size; position: relative; padding: 0 16px 16px; }
.im { display: none; width: 100%; height: auto; border: 1px solid var(--line); }
.vr-diff:checked ~ .stage .im-diff,
.vr-slider:checked ~ .stage .im-slider,
.vr-baseline:checked ~ .stage .im-baseline,
.vr-current:checked ~ .stage .im-current { display: block; }

.im-slider { position: relative; border: 0; }
.im-slider img { display: block; width: 100%; height: auto; border: 1px solid var(--line); }
.im-slider .over { position: absolute; inset: 0 auto 0 0; width: 50%; min-width: 24px;
  max-width: 100%; overflow: hidden; resize: horizontal; border-right: 2px solid var(--accent); }
/* 100cqw pins the clipped image to the stage width so the handle wipes it. */
.im-slider .over img { width: 100cqw; max-width: none; }

.empty { padding: 40px; text-align: center; color: var(--dim); }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
`

function renderHtml(entries, summary) {
    const cards = entries.length
        ? entries.map(entryCard).join("\n")
        : `<p class="empty">No snapshot changes.</p>`

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visual diff report</title>
<style>${CSS}</style>
</head>
<body>
<input type="radio" id="f-all" name="filter" class="gr" checked>
<input type="radio" id="f-changed" name="filter" class="gr">
<input type="radio" id="f-added" name="filter" class="gr">
<input type="radio" id="f-removed" name="filter" class="gr">
<input type="radio" id="z-fit" name="zoom" class="gr" checked>
<input type="radio" id="z-full" name="zoom" class="gr">
<div class="wrap">
  <header class="summary">
    <h1>Visual diff report</h1>
    <dl>
      <div><dt>Changed</dt><dd>${summary.changed}</dd></div>
      <div><dt>Added</dt><dd>${summary.added}</dd></div>
      <div><dt>Removed</dt><dd>${summary.removed}</dd></div>
      <div><dt>Diff pixels</dt><dd>${summary.diffPixels.toLocaleString("en-US")}</dd></div>
      <div><dt>Baseline</dt><dd>${esc(summary.baseRef)}</dd></div>
      <div><dt>Compared at</dt><dd>${esc(summary.compare)}</dd></div>
      <div><dt>Generated</dt><dd>${esc(summary.generatedAt.slice(0, 16).replace("T", " "))} UTC</dd></div>
    </dl>
  </header>
  <nav class="toolbar">
    <div class="filters">
      <label for="f-all">All ${entries.length}</label>
      <label for="f-changed">Changed ${summary.changed}</label>
      <label for="f-added">Added ${summary.added}</label>
      <label for="f-removed">Removed ${summary.removed}</label>
    </div>
    <div class="modes">
      <label for="z-fit">Fit height</label>
      <label for="z-full">Full height</label>
    </div>
  </nav>
  <main>${cards}</main>
</div>
</body>
</html>`
}

async function main() {
    const changes = changedSnapshots()
    rmSync(outDir, { recursive: true, force: true })
    for (const d of ["baseline", "current", "diff"])
        mkdirSync(join(outDir, "images", d), { recursive: true })

    const server = new ODiffServer()
    const entries = []
    let diffPixels = 0

    try {
        for (const { path, status } of changes) {
            const file = basename(path)
            const files = {}

            if (status !== "added") {
                writeBaseline(path, join(outDir, "images/baseline", file))
                files.baseline = `images/baseline/${file}`
            }
            if (status !== "removed") {
                copyFileSync(path, join(outDir, "images/current", file))
                files.current = `images/current/${file}`
            }

            let diff = null
            if (status === "changed") {
                const diffPath = join(outDir, "images/diff", file)
                diff = await server.compare(
                    join(outDir, "images/baseline", file),
                    join(outDir, "images/current", file),
                    diffPath,
                    {
                        threshold: SCREENSHOT_COMPARE.threshold,
                        antialiasing: SCREENSHOT_COMPARE.antialiasing,
                        diffColor: DIFF_COLOR,
                        diffOverlay: true,
                        failOnLayoutDiff: false,
                        noFailOnFsErrors: true,
                        timeout: 60_000,
                    },
                )
                delete diff.requestId // server protocol noise, not part of the result
                if (diff.reason === "pixel-diff") {
                    files.diff = `images/diff/${file}`
                    diffPixels += diff.diffCount
                }
            }

            entries.push({ path, status, ...describe(path), diff, files })
        }
    } finally {
        server.stop()
        // odiff-bin 4.5.0 clears its own `exiting` guard before the async exit
        // event lands, warning "exited unexpectedly" on a clean stop. Hold it open.
        server.exiting = true
    }

    // Loudest changes first, then everything else alphabetically.
    entries.sort(
        (a, b) =>
            (b.diff?.diffPercentage ?? -1) - (a.diff?.diffPercentage ?? -1) ||
            a.path.localeCompare(b.path),
    )

    const summary = {
        baseRef: `${baseRef} ${git("rev-parse", "--short", baseRef).trim()}`,
        compare: compareSummary(),
        generatedAt: new Date().toISOString(),
        total: entries.length,
        changed: entries.filter((e) => e.status === "changed").length,
        added: entries.filter((e) => e.status === "added").length,
        removed: entries.filter((e) => e.status === "removed").length,
        diffPixels,
    }

    writeFileSync(join(outDir, "index.html"), renderHtml(entries, summary))
    writeFileSync(join(outDir, "report.json"), JSON.stringify({ summary, entries }, null, 2))

    console.log(
        `${summary.total} snapshot change(s): ${summary.changed} changed, ${summary.added} added, ` +
            `${summary.removed} removed, ${diffPixels.toLocaleString("en-US")} diff pixels`,
    )
    console.log(`Report written to ${outDir}/index.html`)

    if (process.env.GITHUB_OUTPUT) {
        // Pre-composed: has_changes also covers tests/fixtures/api, so this
        // runs on API-only drift, where a bare count would read "0 changed".
        const line = summary.total
            ? `${summary.total} snapshot(s) changed, ` +
              `${diffPixels.toLocaleString("en-US")} differing pixels. ` +
              `Download the \`visual-diff-report\` artifact from this run and ` +
              `open \`index.html\` for a side-by-side, slider and highlighted diff.`
            : ""
        writeFileSync(
            process.env.GITHUB_OUTPUT,
            `report_total=${summary.total}\n` +
                `report_diff_pixels=${diffPixels}\n` +
                `report_summary=${line}\n`,
            { flag: "a" },
        )
    }
}

await main()
