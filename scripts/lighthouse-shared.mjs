// @ts-check
/**
 * Shared between scripts/lighthouse-benchmark.mjs, which measures one shard of
 * the page sample, and scripts/lighthouse-report.mjs, which merges the shards.
 */

import { PAGES } from "../tests/fixtures/page-sample.mjs"

/** Metrics extracted from the Lighthouse audit results. */
export const METRIC_DEFS = [
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
export const SCORE_THRESHOLD = 10
// Metric delta significance threshold (fraction of baseline value).
export const METRIC_THRESHOLD = 0.3
// Relative benchmarkIndex gap above which baseline deltas are suppressed:
// Lighthouse does not normalise host CPU, so a slower runner fakes regressions.
export const BENCHMARK_INDEX_THRESHOLD = 0.1

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
 *   shard?: number;
 *   perfScores?: number[];
 *   error?: string;
 * }} PageResult
 *
 * @typedef {{
 *   timestamp: string;
 *   baseUrl: string;
 *   benchmarkIndex: number;
 *   shard?: number;
 *   shardTotal?: number;
 *   shards?: { shard: number; benchmarkIndex: number }[];
 *   results: PageResult[];
 * }} BenchmarkOutput
 */

/**
 * Median of a numeric list, lower-middle for even lengths.
 *
 * @param {number[]} values
 * @returns {number}
 */
export function median(values) {
    if (values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    return sorted[Math.floor((sorted.length - 1) / 2)]
}

/**
 * Runs to measure for a page: what the sample asks for, 1 by default.
 *
 * @param {typeof PAGES[number]} page
 * @param {number} [override] Replaces every count above 1 when set.
 * @returns {number}
 */
export function runsFor(page, override = 0) {
    if (!page.runs || page.runs < 2) return 1
    return override || page.runs
}

/**
 * Splits the page sample into `total` shards of roughly equal measuring time.
 *
 * A page costs one Lighthouse run, or `runs` of them for the ones measured by
 * median, so slicing by page count would leave one shard with half the work.
 * Longest-processing-time first: heaviest page to the lightest shard so far,
 * ties by sample order, which makes the assignment stable across shards.
 *
 * @param {number} total
 * @param {number} [override] MULTI_RUN_COUNT, applied to every repeated page.
 * @returns {(typeof PAGES)[]} One page list per shard, in sample order.
 */
export function shardPages(total, override = 0) {
    /** @type {{ pages: typeof PAGES; load: number }[]} */
    const shards = Array.from({ length: total }, () => ({
        pages: [],
        load: 0,
    }))

    const byWeight = PAGES.map((page, index) => ({ page, index })).sort(
        (a, b) =>
            runsFor(b.page, override) - runsFor(a.page, override) ||
            a.index - b.index,
    )

    for (const { page } of byWeight) {
        const target = shards.reduce((a, b) => (b.load < a.load ? b : a))
        target.pages.push(page)
        target.load += runsFor(page, override)
    }

    const order = new Map(PAGES.map((page, index) => [page.path, index]))
    return shards.map((shard) =>
        shard.pages.sort(
            (a, b) => (order.get(a.path) ?? 0) - (order.get(b.path) ?? 0),
        ),
    )
}

const PAGE_ORDER = new Map(PAGES.map((page, index) => [page.path, index]))

/**
 * Results back in page-sample order. Shards measure disjoint slices and the SSR
 * pages first, so rows only stay where readers expect them if sorted here.
 *
 * @param {PageResult[]} results
 * @returns {PageResult[]}
 */
export function reportOrder(results) {
    return [...results].sort(
        (a, b) => (PAGE_ORDER.get(a.path) ?? 0) - (PAGE_ORDER.get(b.path) ?? 0),
    )
}
