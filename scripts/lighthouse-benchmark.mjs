// oxlint-disable no-console
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
 *
 * Exits with code 0 on success, 1 on fatal error.
 * Score regressions never cause a non-zero exit — output is informational only.
 */

import { writeFileSync, readFileSync, existsSync } from "node:fs"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BASE_URL = (process.env.BASE_URL ?? "").replace(/\/$/, "")
const OUTPUT_FILE = process.env.OUTPUT_FILE ?? "lighthouse-results.json"
const BASELINE_FILE = process.env.BASELINE_FILE ?? ""
const MARKDOWN_FILE = process.env.MARKDOWN_FILE ?? "lighthouse-report.md"

if (!BASE_URL) {
    console.error("ERROR: BASE_URL environment variable is required.")
    process.exit(1)
}

/** @type {{ path: string; label: string }[]} */
const PAGES = [
    { path: "/", label: "Home" },
    { path: "/pricing", label: "Pricing" },
    { path: "/enterprise", label: "Enterprise" },
    { path: "/cloud", label: "Cloud" },
    { path: "/about-us", label: "About Us" },
    { path: "/docs", label: "Docs Landing" },
    {
        path: "/docs/contribute-to-kestra",
        label: "Contribute to Kestra (simple docs)",
    },
    {
        path: "/docs/workflow-components/flow",
        label: "Flow (full featured docs)",
    },
    { path: "/blogs", label: "Blog Index" },
    { path: "/blogs/2022-04-27-etl-vs-elt", label: "Blog Post (sample)" },
    { path: "/vs/aws-step-functions", label: "VS Page (sample)" },
    { path: "/plugins", label: "Plugins Landing" },
    { path: "/plugins/core", label: "Plugin Page (sample)" },
    { path: "/plugins/core/debug", label: "Plugin Debug Page (sample)" },
    {
        path: "/plugins/core/debug/io.kestra.plugin.core.debug.return",
        label: "Plugin Debug Return Page (sample)",
    },
    {
        path: "/blueprints",
        label: "Blueprints Landing",
    },
    {
        path: "/blueprints/audit-logs-csv-export",
        label: "Blueprint Audit Logs CSV Export",
    },
]

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
const SCORE_THRESHOLD = 3
// Metric delta significance threshold (fraction of baseline value).
const METRIC_THRESHOLD = 0.1

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
 *   error?: string;
 * }} PageResult
 *
 * @typedef {{
 *   timestamp: string;
 *   baseUrl: string;
 *   results: PageResult[];
 * }} BenchmarkOutput
 */

// ---------------------------------------------------------------------------
// Lighthouse runner
// ---------------------------------------------------------------------------

/**
 * Runs Lighthouse on a single URL and returns the LHR (Lighthouse Result).
 *
 * @param {string} url
 * @param {number} chromePort
 */
async function runLighthouse(url, chromePort) {
    // Dynamic import so this module doesn't fail at parse-time if lighthouse
    // is not installed (e.g. when the script is imported for testing).
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

// ---------------------------------------------------------------------------
// Result extraction
// ---------------------------------------------------------------------------

/**
 * Extracts scores and metrics from a Lighthouse result object.
 *
 * @param {import('lighthouse').Result} lhr
 * @returns {{ scores: Scores; metrics: Metrics }}
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

    return { scores, metrics: /** @type {Metrics} */ (metricsRaw) }
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
    if (delta >= SCORE_THRESHOLD) return ` ▲ +${delta}`
    if (delta <= -SCORE_THRESHOLD) return ` ▼ ${delta}`
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
    if (pctChange <= -METRIC_THRESHOLD) return " ▲" // lower = better
    if (pctChange >= METRIC_THRESHOLD) return " ▼" // higher = worse
    return ""
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
    const baselineInfo = baseline
        ? `Compared against \`main\` baseline from ${new Date(baseline.timestamp).toISOString().slice(0, 10)}`
        : "No baseline available — scores will appear after the first merge to `main`"

    const lines = [
        `> Tested: \`${output.baseUrl}\` on ${testedAt}  `,
        `> ${baselineInfo}`,
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
        const base = baseline?.results.find((r) => r.path === result.path)
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
        const base = baseline?.results.find((r) => r.path === result.path)
        const cells = METRIC_DEFS.map((def) => {
            const val = result.metrics[/** @type {keyof Metrics} */ (def.key)]
            const bval = base?.metrics[/** @type {keyof Metrics} */ (def.key)]
            return `${fmtMetric(val, def)}${metricDelta(val, bval)}`
        }).join(" | ")
        lines.push(
            `| [${result.label}](${output.baseUrl}${result.path}) | ${cells} |`,
        )
    }

    lines.push(
        "",
        "<details><summary>Legend</summary>",
        "",
        "▲ improved &nbsp;·&nbsp; ▼ regressed &nbsp;·&nbsp; (blank) no significant change  ",
        `Score threshold: ±${SCORE_THRESHOLD} pts &nbsp;·&nbsp; Metric threshold: ±${METRIC_THRESHOLD * 100}% of baseline`,
        "",
        "</details>",
    )

    return lines.join("\n")
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    // @ts-ignore
    const { default: chromeLauncher } = await import("chrome-launcher")

    console.log(`\nLighthouse Benchmark`)
    console.log(`Base URL : ${BASE_URL}`)
    console.log(`Pages    : ${PAGES.length}`)
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

    /** @type {PageResult[]} */
    const results = []

    try {
        for (const page of PAGES) {
            const url = `${BASE_URL}${page.path}`
            process.stdout.write(`  ${page.label.padEnd(24)} ${url} … `)

            try {
                const lhr = await runWithRetry(url, chrome.port)
                const { scores, metrics } = extractResults(lhr)
                results.push({
                    path: page.path,
                    label: page.label,
                    scores,
                    metrics,
                })
                console.log(
                    `perf=${scores.performance} a11y=${scores.accessibility} bp=${scores["best-practices"]} seo=${scores.seo}`,
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
                    error: message,
                })
            }
        }
    } finally {
        await chrome.kill()
        console.log("\nChrome closed.")
    }

    /** @type {BenchmarkOutput} */
    const output = {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL,
        results,
    }

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
