// @ts-check
/**
 * Merges the per-shard results written by scripts/lighthouse-benchmark.mjs into
 * one result set, and renders the Markdown report posted on the PR or commit.
 *
 * Usage (environment variables):
 *   RESULTS_DIR     – Directory of per-shard JSON results (default: shard-results)
 *   BASE_URL_OUTPUT – Public root URL for the report links (required)
 *   OUTPUT_FILE     – Path for the merged JSON (default: lighthouse-results.json)
 *   BASELINE_FILE   – Path to baseline JSON (optional; omit to skip comparison)
 *   MARKDOWN_FILE   – Path for Markdown report (default: lighthouse-report.md)
 *
 * Exits with code 0 on success, 1 when no shard result could be read.
 * Score regressions never cause a non-zero exit — output is informational only.
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { PAGES } from "../tests/fixtures/page-sample.mjs"
import {
    BENCHMARK_INDEX_THRESHOLD,
    METRIC_DEFS,
    METRIC_THRESHOLD,
    SCORE_THRESHOLD,
    median,
    reportOrder,
} from "./lighthouse-shared.mjs"

/**
 * @typedef {import("./lighthouse-shared.mjs").Metrics} Metrics
 * @typedef {import("./lighthouse-shared.mjs").PageResult} PageResult
 * @typedef {import("./lighthouse-shared.mjs").BenchmarkOutput} BenchmarkOutput
 */

const RESULTS_DIR = process.env.RESULTS_DIR ?? "shard-results"
const BASE_URL_OUTPUT = (process.env.BASE_URL_OUTPUT ?? "").replace(/\/$/, "")
const OUTPUT_FILE = process.env.OUTPUT_FILE ?? "lighthouse-results.json"
const BASELINE_FILE = process.env.BASELINE_FILE ?? ""
const MARKDOWN_FILE = process.env.MARKDOWN_FILE ?? "lighthouse-report.md"

// ---------------------------------------------------------------------------
// Merge
// ---------------------------------------------------------------------------

/**
 * Reads every shard result in a directory, newest field wins on conflict.
 *
 * @param {string} dir
 * @returns {BenchmarkOutput[]}
 */
function readShards(dir) {
    if (!existsSync(dir)) return []

    /** @type {BenchmarkOutput[]} */
    const shards = []
    for (const name of readdirSync(dir).sort()) {
        if (!name.endsWith(".json")) continue
        try {
            shards.push(JSON.parse(readFileSync(join(dir, name), "utf8")))
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            console.warn(`Warning: could not parse ${name}: ${message}`)
        }
    }
    return shards
}

/**
 * Merges the shards into one result set. A page missing from every shard means
 * its job never reported, which is an error row rather than a silent gap.
 *
 * @param {BenchmarkOutput[]} shards
 * @returns {BenchmarkOutput}
 */
function mergeShards(shards) {
    const results = reportOrder(shards.flatMap((shard) => shard.results))
    const measured = new Set(results.map((result) => result.path))

    for (const page of PAGES) {
        if (measured.has(page.path)) continue
        results.push({
            path: page.path,
            label: page.label,
            scores: {
                performance: 0,
                accessibility: 0,
                "best-practices": 0,
                seo: 0,
            },
            metrics: { lcp: 0, fcp: 0, tbt: 0, cls: 0, si: 0 },
            benchmarkIndex: 0,
            runs: 0,
            error: "no shard reported this page",
        })
    }

    return {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL_OUTPUT,
        benchmarkIndex: median(
            shards.map((shard) => shard.benchmarkIndex).filter(Boolean),
        ),
        shards: shards.map((shard) => ({
            shard: shard.shard ?? 0,
            benchmarkIndex: shard.benchmarkIndex,
        })),
        results: reportOrder(results),
    }
}

// ---------------------------------------------------------------------------
// Delta helpers
// ---------------------------------------------------------------------------

/**
 * Returns a display string for a score delta (higher is better).
 *
 * @param {number} current
 * @param {number | undefined} baseline
 * @returns {string}
 */
function scoreDelta(current, baseline) {
    if (baseline == null) return ""
    const delta = Math.round(current - baseline)
    if (delta >= SCORE_THRESHOLD) return ` 🟢 +${delta}`
    if (delta <= -SCORE_THRESHOLD) return ` 🔻 ${delta}`
    return ""
}

/**
 * Returns a display arrow for a metric delta (lower is better).
 *
 * @param {number} current
 * @param {number | undefined} baseline
 * @returns {string}
 */
function metricDelta(current, baseline) {
    if (baseline == null || baseline === 0) return ""
    const pctChange = (current - baseline) / baseline
    if (pctChange <= -METRIC_THRESHOLD) return " 🟢" // lower = better
    if (pctChange >= METRIC_THRESHOLD) return " 🔻" // higher = worse
    return ""
}

/**
 * Whether two runs are on close enough hardware to compare. Lighthouse reports
 * the host CPU as benchmarkIndex and does not normalise for it.
 *
 * @param {number} current
 * @param {number | undefined} base
 * @returns {boolean}
 */
function comparableCpu(current, base) {
    if (!current || !base) return true
    return Math.abs(current - base) / base <= BENCHMARK_INDEX_THRESHOLD
}

/**
 * The baseline row to compare a page against, or undefined when the two ran on
 * hardware too far apart. Sharding puts pages on their own runner, so the check
 * is per page rather than per run.
 *
 * @param {PageResult} result
 * @param {BenchmarkOutput | null} baseline
 * @returns {PageResult | undefined}
 */
function baselineFor(result, baseline) {
    const base = baseline?.results.find(
        (r) => r.path === result.path && !r.error,
    )
    if (!base) return undefined
    return comparableCpu(result.benchmarkIndex, base.benchmarkIndex)
        ? base
        : undefined
}

// ---------------------------------------------------------------------------
// Markdown report generation
// ---------------------------------------------------------------------------

/**
 * Formats a metric value for display.
 *
 * @param {number} value
 * @param {{ unit: string; decimals: number }} def
 * @returns {string}
 */
function fmtMetric(value, def) {
    const formatted = value.toFixed(def.decimals)
    return def.unit ? `${formatted} ${def.unit}` : formatted
}

/**
 * Builds the Markdown report string.
 *
 * @param {BenchmarkOutput} output
 * @param {BenchmarkOutput | null} baseline
 * @returns {string}
 */
export function buildMarkdown(output, baseline) {
    const testedAt =
        new Date(output.timestamp)
            .toISOString()
            .replace("T", " ")
            .slice(0, 16) + " UTC"

    const scored = output.results.filter((result) => !result.error)
    const hidden = baseline
        ? scored.filter((result) => !baselineFor(result, baseline)).length
        : 0

    const baselineInfo = baseline
        ? `Compared against \`main\` baseline from ${new Date(baseline.timestamp).toISOString().slice(0, 10)}`
        : "No baseline available — scores will appear after the first merge to `main`"
    const shardIndexes = (output.shards ?? [])
        .map((shard) => shard.benchmarkIndex || "unknown")
        .join(", ")
    const cpuInfo =
        `Runner CPU index per shard: ${shardIndexes || "unknown"}` +
        (baseline
            ? ` (baseline: ${baseline.benchmarkIndex || "unknown"}` +
              (hidden ? `, deltas hidden on ${hidden} page(s)` : "") +
              ")"
            : "")

    const lines = [
        `> Tested on ${testedAt} &nbsp;·&nbsp; links point to \`${output.baseUrl}\`  `,
        `> ${baselineInfo}  `,
        `> ${cpuInfo}`,
        "",
        "### Scores (0–100, higher is better)",
        "",
        "| Page | Performance | Accessibility | Best Practices | SEO |",
        "|------|-------------|---------------|----------------|-----|",
    ]

    for (const result of output.results) {
        if (result.error) {
            lines.push(
                `| [${result.label}](${output.baseUrl}${result.path}) | ❌ error | ❌ error | ❌ error | ❌ error |`,
            )
            continue
        }
        const bs = baselineFor(result, baseline)?.scores
        const { scores } = result
        lines.push(
            `| [${result.label}](${output.baseUrl}${result.path}) ` +
                `| ${scores.performance}${scoreDelta(scores.performance, bs?.performance)} ` +
                `| ${scores.accessibility}${scoreDelta(scores.accessibility, bs?.accessibility)} ` +
                `| ${scores["best-practices"]}${scoreDelta(scores["best-practices"], bs?.["best-practices"])} ` +
                `| ${scores.seo}${scoreDelta(scores.seo, bs?.seo)} |`,
        )
    }

    const failed = output.results.filter((r) => r.error)
    if (failed.length > 0) {
        lines.push("")
        for (const result of failed) {
            lines.push(`❌ \`${result.path}\` — ${result.error}  `)
        }
    }

    lines.push("", "### Core Web Vitals (lower is better)", "")

    // Build header from metric defs
    const metricHeaders = METRIC_DEFS.map((d) => d.label).join(" | ")
    const metricSep = METRIC_DEFS.map(() => "---").join(" | ")
    lines.push(`| Page | ${metricHeaders} |`)
    lines.push(`|------|${metricSep}|`)

    for (const result of output.results) {
        if (result.error) {
            const cells = METRIC_DEFS.map(() => "❌").join(" | ")
            lines.push(
                `| [${result.label}](${output.baseUrl}${result.path}) | ${cells} |`,
            )
            continue
        }
        const base = baselineFor(result, baseline)
        const cells = METRIC_DEFS.map((def) => {
            const val = result.metrics[/** @type {keyof Metrics} */ (def.key)]
            const bval = base?.metrics[/** @type {keyof Metrics} */ (def.key)]
            return `${fmtMetric(val, def)}${metricDelta(val, bval)}`
        }).join(" | ")
        lines.push(
            `| [${result.label}](${output.baseUrl}${result.path}) | ${cells} |`,
        )
    }

    const multiRun = output.results.filter((r) => r.runs > 1)

    lines.push(
        "",
        "<details><summary>Legend</summary>",
        "",
        "🟢 improved &nbsp;·&nbsp; 🔻 regressed &nbsp;·&nbsp; (blank) no significant change  ",
        `Score threshold: ±${SCORE_THRESHOLD} pts &nbsp;·&nbsp; Metric threshold: ±${METRIC_THRESHOLD * 100}% of baseline`,
        "",
        multiRun.length
            ? `Median of repeated runs: ${multiRun
                  .map((r) => `${r.label} x${r.runs}`)
                  .join(
                      ", ",
                  )}. A single run of these swings 20+ points between runners.  `
            : "",
        `The sample is measured across ${output.shards?.length ?? 1} parallel runners, so each page carries its own CPU index (Lighthouse's \`benchmarkIndex\`). Lighthouse does not normalise for host CPU, so a page's deltas are hidden when its runner differs from the baseline's by more than ${BENCHMARK_INDEX_THRESHOLD * 100}%.`,
        "",
        "</details>",
        "",
        "<details><summary>View full Lighthouse HTML report for a page</summary>",
        "",
        "Full per-page Lighthouse Results (LHR) are attached as the `lhr-reports-shard-*` artifacts on this run. Download and unzip one, then open <https://googlechrome.github.io/lighthouse/viewer/> and drop the `<page>-lhr.json` file into the page to see every audit, opportunity, and diagnostic.",
        "",
        "</details>",
    )

    return lines.join("\n")
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
    const shards = readShards(RESULTS_DIR)
    if (shards.length === 0) {
        console.error(`ERROR: no shard results found in ${RESULTS_DIR}/`)
        process.exit(1)
    }

    const output = mergeShards(shards)
    const missing = output.results.filter((r) => r.error).length
    console.log(
        `Merged ${shards.length} shard(s), ${output.results.length} pages` +
            (missing ? `, ${missing} without a score` : ""),
    )

    writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
    console.log(`Results written to ${OUTPUT_FILE}`)

    /** @type {BenchmarkOutput | null} */
    let baseline = null
    if (BASELINE_FILE && existsSync(BASELINE_FILE)) {
        try {
            baseline = JSON.parse(readFileSync(BASELINE_FILE, "utf8"))
            console.log(
                `Baseline loaded from ${BASELINE_FILE} (${baseline?.timestamp?.slice(0, 10)})`,
            )
        } catch {
            console.warn(
                `Warning: Could not parse baseline file ${BASELINE_FILE}, skipping comparison.`,
            )
        }
    }

    writeFileSync(MARKDOWN_FILE, buildMarkdown(output, baseline))
    console.log(`Report written to ${MARKDOWN_FILE}\n`)
}

main()
