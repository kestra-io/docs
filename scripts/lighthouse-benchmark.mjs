// @ts-check
/**
 * Lighthouse performance benchmark script for kestra.io docs.
 *
 * Runs Lighthouse on a set of key pages, writes JSON results and a
 * Markdown report. Optionally compares against a baseline JSON file to
 * show score/metric deltas in the report (used for PR vs. main comparison).
 *
 * Usage (environment variables):
 *   BASE_URL      – Root URL to benchmark, no trailing slash (required)
 *   OUTPUT_FILE   – Path for JSON output  (default: lighthouse-results.json)
 *   BASELINE_FILE – Path to baseline JSON (optional; omit to skip comparison)
 *   MARKDOWN_FILE – Path for Markdown report (default: lighthouse-report.md)
 *   LHR_DIR       – Directory for per-page LHR JSON dumps (default: lhr-reports)
 *   MULTI_RUN_COUNT – Overrides the per-page run counts in MULTI_RUN_PATHS
 *   WARMUP_PATH   – Page requested before measuring (default: /privacy-policy)
 *
 * Exits with code 0 on success, 1 on fatal error.
 * Score regressions never cause a non-zero exit — output is informational only.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs"
import { PAGES } from "../tests/fixtures/page-sample.mjs"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BASE_URL = (process.env.BASE_URL ?? "").replace(/\/$/, "")
const BASE_URL_OUTPUT = process.env.BASE_URL_OUTPUT ?? BASE_URL
const OUTPUT_FILE = process.env.OUTPUT_FILE ?? "lighthouse-results.json"
const BASELINE_FILE = process.env.BASELINE_FILE ?? ""
const MARKDOWN_FILE = process.env.MARKDOWN_FILE ?? "lighthouse-report.md"
const LHR_DIR = process.env.LHR_DIR ?? "lhr-reports"
// Warm-up target: a prerendered page with almost no content of its own, so it
// pulls the worker and the shared layout assets without touching the sample.
const WARMUP_PATH = process.env.WARMUP_PATH ?? "/privacy-policy"
const WARMUP_REQUESTS = 3

// Overrides the per-page run counts below when set above 0.
const MULTI_RUN_COUNT = Math.max(
    0,
    Math.trunc(Number(process.env.MULTI_RUN_COUNT ?? 0)) || 0,
)

// Pages whose score sits mid-curve with TBT dominating, so a single run swings
// 20+ points between runners. Reported as the median of these many runs.
const MULTI_RUN_PATHS = new Map([
    ["/", 5],
    ["/docs", 5],
    ["/blueprints", 3],
    ["/about-us", 3],
    ["/docs/workflow-components/flow", 3],
])

// The prerender = false pages, measured first while workerd is freshest. Their
// TTFB drifts up over a job: from the tail, Blueprints lost 7 points and 0.36 s
// of FCP, and the plugin pages' Speed Index rose with it.
const SSR_FIRST_PATHS = [
    "/blueprints",
    "/blueprints/audit-logs-csv-export",
    "/plugins",
    "/plugins/core",
    "/plugins/core/debug",
    "/plugins/core/debug/io.kestra.plugin.core.debug.return",
]

/**
 * PAGES with the server-rendered ones hoisted to the front, order otherwise
 * preserved. A path that no longer exists warns rather than reordering nothing.
 *
 * @returns {typeof PAGES}
 */
function orderedPages() {
    const ssr = []
    for (const path of SSR_FIRST_PATHS) {
        const page = PAGES.find((entry) => entry.path === path)
        if (page) ssr.push(page)
        else console.warn(`Warning: ${path} is not in the page sample.`)
    }

    const rest = PAGES.filter((page) => !SSR_FIRST_PATHS.includes(page.path))

    return [...ssr, ...rest]
}

/**
 * Runs to measure for a page, 1 for anything not listed as noisy.
 *
 * @param {string} path
 * @returns {number}
 */
function runsFor(path) {
    const runs = MULTI_RUN_PATHS.get(path)
    if (!runs) return 1
    return MULTI_RUN_COUNT || runs
}

if (!BASE_URL) {
    console.error("ERROR: BASE_URL environment variable is required.")
    process.exit(1)
}

const LIGHTHOUSE_CATEGORIES = [
    "performance",
    "accessibility",
    "best-practices",
    "seo",
]

/** Metrics extracted from the Lighthouse audit results. */
const METRIC_DEFS = [
    {
        auditKey: "largest-contentful-paint",
        key: "lcp",
        label: "LCP",
        unit: "s",
        divisor: 1000,
        decimals: 2,
    },
    {
        auditKey: "first-contentful-paint",
        key: "fcp",
        label: "FCP",
        unit: "s",
        divisor: 1000,
        decimals: 2,
    },
    {
        auditKey: "total-blocking-time",
        key: "tbt",
        label: "TBT",
        unit: "ms",
        divisor: 1,
        decimals: 0,
    },
    {
        auditKey: "cumulative-layout-shift",
        key: "cls",
        label: "CLS",
        unit: "",
        divisor: 1,
        decimals: 3,
    },
    {
        auditKey: "speed-index",
        key: "si",
        label: "Speed Index",
        unit: "s",
        divisor: 1000,
        decimals: 2,
    },
]

// Score delta significance threshold (points).
const SCORE_THRESHOLD = 10
// Metric delta significance threshold (fraction of baseline value).
const METRIC_THRESHOLD = 0.3
// Relative benchmarkIndex gap above which baseline deltas are suppressed:
// Lighthouse does not normalise host CPU, so a slower runner fakes regressions.
const BENCHMARK_INDEX_THRESHOLD = 0.1

// ---------------------------------------------------------------------------
// Types (JSDoc)
// ---------------------------------------------------------------------------

/**
 * @typedef {{
 *   performance: number;
 *   accessibility: number;
 *   'best-practices': number;
 *   seo: number;
 * }} Scores
 *
 * @typedef {{
 *   lcp: number;
 *   fcp: number;
 *   tbt: number;
 *   cls: number;
 *   si: number;
 * }} Metrics
 *
 * @typedef {{
 *   path: string;
 *   label: string;
 *   scores: Scores;
 *   metrics: Metrics;
 *   benchmarkIndex: number;
 *   runs: number;
 *   perfScores?: number[];
 *   error?: string;
 * }} PageResult
 *
 * @typedef {{
 *   timestamp: string;
 *   baseUrl: string;
 *   benchmarkIndex: number;
 *   results: PageResult[];
 * }} BenchmarkOutput
 */

// ---------------------------------------------------------------------------
// Lighthouse runner
// ---------------------------------------------------------------------------

/**
 * Throws when a result carries no usable performance data: a page-level
 * runtime error, or a trace with no paint metrics in it.
 *
 * @param {any} lhr
 */
function assertUsableLhr(lhr) {
    const code = lhr.runtimeError?.code
    if (code && code !== "NO_ERROR") {
        throw new Error(`${code}: ${lhr.runtimeError?.message ?? ""}`)
    }

    // The non-perf categories audit without the trace, so a run can look fine
    // while every metric is missing. Reported as 0, that reads as a real drop.
    const fcp = lhr.audits?.["first-contentful-paint"]
    if (fcp?.numericValue == null) {
        throw new Error(fcp?.errorMessage ?? "no paint metrics in the trace")
    }
}

/**
 * Runs Lighthouse on a single URL and returns the LHR (Lighthouse Result).
 *
 * @param {string} url
 * @param {number} chromePort
 */
async function runLighthouse(url, chromePort) {
    // Dynamic import so this module doesn't fail at parse-time if lighthouse
    // is not installed (e.g. when the script is imported for testing).
    // @ts-ignore - optional CI-only dependency, not in package.json
    const { default: lighthouse } = await import("lighthouse")

    const result = await lighthouse(url, {
        port: chromePort,
        output: "json",
        logLevel: "error",
        onlyCategories: LIGHTHOUSE_CATEGORIES,
        formFactor: "desktop",
        screenEmulation: {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
        },
        // Simulate good broadband — representative of a real desktop user.
        throttling: {
            rttMs: 40,
            throughputKbps: 10 * 1024,
            cpuSlowdownMultiplier: 1,
        },
    })

    if (!result?.lhr) throw new Error("Lighthouse returned no result")

    assertUsableLhr(result.lhr)
    return result.lhr
}

/**
 * Runs Lighthouse with automatic retries.
 *
 * @param {string} url
 * @param {number} chromePort
 * @param {number} [maxRetries=2]
 */
async function runWithRetry(url, chromePort, maxRetries = 2) {
    let lastError = /** @type {unknown} */ (null)
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await runLighthouse(url, chromePort)
        } catch (err) {
            lastError = err
            if (attempt < maxRetries) {
                console.log(
                    `    Attempt ${attempt + 1} failed, retrying in 3 s…`,
                )
                await new Promise((r) => setTimeout(r, 3000))
            }
        }
    }
    throw lastError
}

/**
 * Requests the warm-up page a few times, discarding every response, so the
 * workerd compile and the first shared-asset reads stay out of the traces.
 *
 * @param {string} url
 */
async function warmUp(url) {
    for (let i = 0; i < WARMUP_REQUESTS; i++) {
        try {
            const response = await fetch(url, {
                signal: AbortSignal.timeout(30000),
            })
            await response.arrayBuffer()
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            console.log(`  warm-up failed for ${url}: ${message}`)
        }
    }
}

/**
 * Performance score (0-100) of a Lighthouse result.
 *
 * @param {any} lhr
 * @returns {number}
 */
function perfScore(lhr) {
    return Math.round((lhr.categories["performance"]?.score ?? 0) * 100)
}

/**
 * Median of a numeric list, lower-middle for even lengths.
 *
 * @param {number[]} values
 * @returns {number}
 */
function median(values) {
    if (values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    return sorted[Math.floor((sorted.length - 1) / 2)]
}

/**
 * Runs Lighthouse `runs` times and returns the run whose performance score is
 * the median, keeping every reported score and metric from one single trace.
 *
 * @param {string} url
 * @param {number} chromePort
 * @param {number} runs
 * @returns {Promise<{ lhr: any; perfScores: number[] }>}
 */
async function runMedian(url, chromePort, runs) {
    /** @type {any[]} */
    const lhrs = []
    for (let i = 0; i < runs; i++) {
        lhrs.push(await runWithRetry(url, chromePort))
    }

    const perfScores = lhrs.map(perfScore)
    const medianScore = median(perfScores)
    const lhr = lhrs[perfScores.indexOf(medianScore)]

    return { lhr, perfScores }
}

/**
 * Turns a page label into a filesystem-safe slug.
 *
 * @param {string} label
 * @returns {string}
 */
function slugify(label) {
    return label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

// ---------------------------------------------------------------------------
// Result extraction
// ---------------------------------------------------------------------------

/**
 * Extracts scores and metrics from a Lighthouse result object.
 *
 * @param {any} lhr
 * @returns {{ scores: Scores; metrics: Metrics; benchmarkIndex: number }}
 */
function extractResults(lhr) {
    /** @type {Scores} */
    const scores = {
        performance: Math.round(
            (lhr.categories["performance"]?.score ?? 0) * 100,
        ),
        accessibility: Math.round(
            (lhr.categories["accessibility"]?.score ?? 0) * 100,
        ),
        "best-practices": Math.round(
            (lhr.categories["best-practices"]?.score ?? 0) * 100,
        ),
        seo: Math.round((lhr.categories["seo"]?.score ?? 0) * 100),
    }

    /** @type {Record<string, number>} */
    const metricsRaw = {}
    for (const def of METRIC_DEFS) {
        const audit = lhr.audits[def.auditKey]
        const raw = audit?.numericValue ?? 0
        metricsRaw[def.key] = parseFloat(
            (raw / def.divisor).toFixed(def.decimals),
        )
    }

    return {
        scores,
        metrics: /** @type {Metrics} */ (metricsRaw),
        benchmarkIndex: Math.round(lhr.environment?.benchmarkIndex ?? 0),
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
 * Decides whether baseline deltas can be trusted. Lighthouse reports the host
 * CPU as benchmarkIndex; a runner much slower than the baseline's fakes drops.
 *
 * @param {number} current
 * @param {number | undefined} base
 * @returns {{ comparable: boolean; note: string }}
 */
function compareBenchmarkIndex(current, base) {
    if (!current || !base) {
        return {
            comparable: true,
            note: "one side has no CPU index, deltas not CPU-checked",
        }
    }

    const gap = Math.abs(current - base) / base
    const pct = Math.round(gap * 100)
    if (gap > BENCHMARK_INDEX_THRESHOLD) {
        return {
            comparable: false,
            note: `runner CPU differs by ${pct}% from baseline, deltas hidden`,
        }
    }

    return {
        comparable: true,
        note: `runner CPU within ${pct}% of baseline`,
    }
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
function buildMarkdown(output, baseline) {
    const testedAt =
        new Date(output.timestamp)
            .toISOString()
            .replace("T", " ")
            .slice(0, 16) + " UTC"
    const cpu = baseline
        ? compareBenchmarkIndex(output.benchmarkIndex, baseline.benchmarkIndex)
        : null
    // Deltas are dropped, not shown, when the runners differ too much.
    const comparedBaseline = cpu && !cpu.comparable ? null : baseline

    const baselineInfo = baseline
        ? `Compared against \`main\` baseline from ${new Date(baseline.timestamp).toISOString().slice(0, 10)}`
        : "No baseline available — scores will appear after the first merge to `main`"
    const cpuInfo =
        `Runner CPU index: ${output.benchmarkIndex || "unknown"}` +
        (baseline
            ? ` (baseline: ${baseline.benchmarkIndex || "unknown"}, ${cpu?.note})`
            : "")

    const lines = [
        `> Tested: \`${output.baseUrl}\` on ${testedAt}  `,
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
                `| [${result.label}](${result.path}) | ❌ error | ❌ error | ❌ error | ❌ error |`,
            )
            continue
        }
        const base = comparedBaseline?.results.find(
            (r) => r.path === result.path,
        )
        const { scores } = result
        const bs = base?.scores
        lines.push(
            `| [${result.label}](${output.baseUrl}${result.path}) ` +
                `| ${scores.performance}${scoreDelta(scores.performance, bs?.performance)} ` +
                `| ${scores.accessibility}${scoreDelta(scores.accessibility, bs?.accessibility)} ` +
                `| ${scores["best-practices"]}${scoreDelta(scores["best-practices"], bs?.["best-practices"])} ` +
                `| ${scores.seo}${scoreDelta(scores.seo, bs?.seo)} |`,
        )
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
            lines.push(`| [${result.label}](${result.path}) | ${cells} |`)
            continue
        }
        const base = comparedBaseline?.results.find(
            (r) => r.path === result.path,
        )
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
                  .join(", ")}. A single run of these swings 20+ points between runners.  `
            : "",
        `Runner CPU index is Lighthouse's \`benchmarkIndex\`. Lighthouse does not normalise for host CPU, so deltas are hidden when the two runners differ by more than ${BENCHMARK_INDEX_THRESHOLD * 100}%.`,
        "",
        "</details>",
        "",
        "<details><summary>View full Lighthouse HTML report for a page</summary>",
        "",
        "Full per-page Lighthouse Results (LHR) are attached as the `lhr-reports` artifact on this run. Download and unzip it, then open <https://googlechrome.github.io/lighthouse/viewer/> and drop the `<page>-lhr.json` file into the page to see every audit, opportunity, and diagnostic.",
        "",
        "</details>",
    )

    return lines.join("\n")
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    // @ts-ignore - optional CI-only dependency, not in package.json
    const chromeLauncher = await import("chrome-launcher")

    console.log(`\nLighthouse Benchmark`)
    console.log(`Base URL : ${BASE_URL}`)
    console.log(`Pages    : ${PAGES.length}`)
    const runPlan = [...MULTI_RUN_PATHS.keys()]
        .map((path) => `${path} x${runsFor(path)}`)
        .join(", ")
    console.log(`Runs     : 1 per page, except ${runPlan}`)
    console.log(
        `Baseline : ${BASELINE_FILE && existsSync(BASELINE_FILE) ? BASELINE_FILE : "none"}\n`,
    )

    // Launch Chrome once and reuse for all pages.
    const chrome = await chromeLauncher.launch({
        chromeFlags: [
            "--headless=new",
            "--no-sandbox",
            "--disable-dev-shm-usage",
        ],
    })

    console.log(`Chrome launched on port ${chrome.port}\n`)

    mkdirSync(LHR_DIR, { recursive: true })

    process.stdout.write(`Warming up on ${WARMUP_PATH}… `)
    await warmUp(`${BASE_URL}${WARMUP_PATH}`)
    console.log("done\n")

    /** @type {PageResult[]} */
    const results = []

    try {
        for (const page of orderedPages()) {
            const url = `${BASE_URL}${page.path}`
            const runs = runsFor(page.path)
            process.stdout.write(`  ${page.label.padEnd(24)} ${url} … `)

            try {
                const { lhr, perfScores } = await runMedian(
                    url,
                    chrome.port,
                    runs,
                )
                const lhrPath = `${LHR_DIR}/${slugify(page.label)}-lhr.json`
                writeFileSync(lhrPath, JSON.stringify(lhr))
                const { scores, metrics, benchmarkIndex } = extractResults(lhr)
                results.push({
                    path: page.path,
                    label: page.label,
                    scores,
                    metrics,
                    benchmarkIndex,
                    runs,
                    perfScores,
                })
                const spread =
                    runs > 1 ? ` (median of ${perfScores.join("/")})` : ""
                console.log(
                    `perf=${scores.performance}${spread} a11y=${scores.accessibility} bp=${scores["best-practices"]} seo=${scores.seo} cpu=${benchmarkIndex}`,
                )
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err)
                console.log(`ERROR: ${message}`)
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
                    runs,
                    error: message,
                })
            }
        }
    } finally {
        await chrome.kill()
        console.log("\nChrome closed.")
    }

    // One index for the whole run: it is a property of the runner, not the page.
    const benchmarkIndex = median(
        results.map((r) => r.benchmarkIndex).filter(Boolean),
    )

    /** @type {BenchmarkOutput} */
    const output = {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL_OUTPUT,
        benchmarkIndex,
        results,
    }

    console.log(`\nRunner CPU index (median): ${benchmarkIndex || "unknown"}`)

    // Write JSON output.
    writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
    console.log(`\nResults written to ${OUTPUT_FILE}`)

    // Load baseline if provided and file exists.
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

    // Write Markdown report.
    const markdown = buildMarkdown(output, baseline)
    writeFileSync(MARKDOWN_FILE, markdown)
    console.log(`Report written to ${MARKDOWN_FILE}\n`)
}

main().catch((err) => {
    console.error("Fatal error:", err)
    process.exit(1)
})
