// @ts-check
/**
 * Lighthouse performance benchmark script for kestra.io docs.
 *
 * Measures one shard of the page sample and writes its scores as JSON, plus
 * the per-page LHR dumps. scripts/lighthouse-report.mjs merges the shards and
 * builds the Markdown report.
 *
 * Usage (environment variables):
 *   BASE_URL        – Root URL to benchmark, no trailing slash (required)
 *   OUTPUT_FILE     – Path for JSON output  (default: lighthouse-results.json)
 *   LHR_DIR         – Directory for per-page LHR JSON dumps (default: lhr-reports)
 *   MULTI_RUN_COUNT – Overrides the `runs` counts in the page sample
 *   SHARD_INDEX     – 0-based shard to measure (default: 0)
 *   SHARD_TOTAL     – Number of shards the sample is split across (default: 1)
 *   WARMUP_PATH     – Page warmed before measuring (default: /privacy-policy);
 *                     the shard's SSR pages are warmed after it
 *
 * Exits with code 0 on success, 1 on fatal error.
 * Score regressions never cause a non-zero exit — output is informational only.
 */

import { writeFileSync, mkdirSync } from "node:fs"
import { PAGES } from "../tests/fixtures/page-sample.mjs"
import {
    METRIC_DEFS,
    median,
    runsFor as sampleRunsFor,
    shardPages,
} from "./lighthouse-shared.mjs"

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BASE_URL = (process.env.BASE_URL ?? "").replace(/\/$/, "")
const OUTPUT_FILE = process.env.OUTPUT_FILE ?? "lighthouse-results.json"
const LHR_DIR = process.env.LHR_DIR ?? "lhr-reports"
// Warm-up target: a prerendered page with almost no content of its own, so it
// pulls the worker and the shared layout assets without touching the sample.
const WARMUP_PATH = process.env.WARMUP_PATH ?? "/privacy-policy"
const WARMUP_REQUESTS = 3

// Overrides the `runs` counts carried by the page sample when set above 0.
const MULTI_RUN_COUNT = Math.max(
    0,
    Math.trunc(Number(process.env.MULTI_RUN_COUNT ?? 0)) || 0,
)

const SHARD_TOTAL = Math.max(
    1,
    Math.trunc(Number(process.env.SHARD_TOTAL ?? 1)) || 1,
)
const SHARD_INDEX = Math.min(
    SHARD_TOTAL - 1,
    Math.max(0, Math.trunc(Number(process.env.SHARD_INDEX ?? 0)) || 0),
)

/** This shard's slice of the page sample. */
const SHARD_PAGES = shardPages(SHARD_TOTAL, MULTI_RUN_COUNT)[SHARD_INDEX]

/**
 * The shard's pages with the server-rendered ones hoisted to the front, order
 * otherwise preserved. They are measured while workerd is freshest, and the
 * prerendered pages, served from disk, care far less where they land.
 *
 * @returns {typeof PAGES}
 */
function orderedPages() {
    return [
        ...SHARD_PAGES.filter((page) => page.ssr),
        ...SHARD_PAGES.filter((page) => !page.ssr),
    ]
}

/**
 * Runs to measure for a page: what the sample asks for, 1 by default.
 *
 * @param {typeof PAGES[number]} page
 * @returns {number}
 */
function runsFor(page) {
    return sampleRunsFor(page, MULTI_RUN_COUNT)
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

/**
 * @typedef {import("./lighthouse-shared.mjs").Scores} Scores
 * @typedef {import("./lighthouse-shared.mjs").Metrics} Metrics
 * @typedef {import("./lighthouse-shared.mjs").PageResult} PageResult
 * @typedef {import("./lighthouse-shared.mjs").BenchmarkOutput} BenchmarkOutput
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

    assertScored(result.lhr)
    return result.lhr
}

/**
 * Throws when a page failed to load: Lighthouse still returns an LHR, with
 * null category scores that would otherwise be reported as a genuine 0.
 *
 * @param {any} lhr
 */
function assertScored(lhr) {
    const runtimeError = lhr.runtimeError?.code
    if (runtimeError && runtimeError !== "NO_ERROR") {
        throw new Error(
            `${runtimeError}: ${lhr.runtimeError?.message ?? "page did not load"}`,
        )
    }

    const unscored = LIGHTHOUSE_CATEGORIES.filter(
        (id) => lhr.categories?.[id]?.score == null,
    )
    if (unscored.length > 0) {
        throw new Error(`No score returned for: ${unscored.join(", ")}`)
    }

    // The other categories audit without the trace, so a run can score while
    // every metric is missing, which then reads as a genuine drop to zero.
    const fcp = lhr.audits?.["first-contentful-paint"]
    if (fcp?.numericValue == null) {
        throw new Error(fcp?.errorMessage ?? "no paint metrics in the trace")
    }
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
            const message = err instanceof Error ? err.message : String(err)
            if (attempt < maxRetries) {
                console.log(
                    `    Attempt ${attempt + 1} failed (${message}), retrying in 3 s…`,
                )
                await new Promise((r) => setTimeout(r, 3000))
            }
        }
    }
    throw lastError
}

/**
 * Requests a page a few times, discarding every response, so the work its
 * first hit does stays out of the measured traces.
 *
 * @param {string} url
 * @param {number} [requests=WARMUP_REQUESTS]
 */
async function warmUp(url, requests = WARMUP_REQUESTS) {
    for (let i = 0; i < requests; i++) {
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
// Main
// ---------------------------------------------------------------------------

async function main() {
    // @ts-ignore - optional CI-only dependency, not in package.json
    const chromeLauncher = await import("chrome-launcher")

    const shardRuns = SHARD_PAGES.reduce((sum, page) => sum + runsFor(page), 0)
    const runPlan = SHARD_PAGES.filter((page) => runsFor(page) > 1)
        .map((page) => `${page.path} x${runsFor(page)}`)
        .join(", ")

    console.log(`\nLighthouse Benchmark`)
    console.log(`Base URL : ${BASE_URL}`)
    console.log(`Shard    : ${SHARD_INDEX + 1} of ${SHARD_TOTAL}`)
    console.log(`Pages    : ${SHARD_PAGES.length} of ${PAGES.length}`)
    console.log(
        `Runs     : ${shardRuns}, 1 per page except ${runPlan || "none"}\n`,
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

    // WARMUP_PATH covers the workerd compile and the shared layout assets. The
    // SSR routes each compile and render on their own first hit, so they follow.
    const ssrPaths = SHARD_PAGES.filter((page) => page.ssr).map(
        (page) => page.path,
    )
    process.stdout.write(
        `Warming up on ${WARMUP_PATH} and ${ssrPaths.length} SSR pages… `,
    )
    await warmUp(`${BASE_URL}${WARMUP_PATH}`)
    for (const path of ssrPaths) {
        await warmUp(`${BASE_URL}${path}`, 1)
    }
    console.log("done\n")

    /** @type {PageResult[]} */
    const results = []

    try {
        for (const page of orderedPages()) {
            const url = `${BASE_URL}${page.path}`
            const runs = runsFor(page)
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
                    shard: SHARD_INDEX,
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
                    shard: SHARD_INDEX,
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
        baseUrl: BASE_URL,
        benchmarkIndex,
        shard: SHARD_INDEX,
        shardTotal: SHARD_TOTAL,
        results,
    }

    console.log(`\nRunner CPU index (median): ${benchmarkIndex || "unknown"}`)

    writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
    console.log(`Results written to ${OUTPUT_FILE}\n`)
}

main().catch((err) => {
    console.error("Fatal error:", err)
    process.exit(1)
})
