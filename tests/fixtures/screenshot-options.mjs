// Comparison tolerances for the visual-regression suite, shared with
// scripts/visual-diff-report.mjs so the report's pixel counts mean the same
// thing as the numbers that decided a baseline needed rewriting.
//
// threshold and antialiasing restate odiff's own defaults. They are written
// out because the report has to pass them explicitly to get the same result.
export const SCREENSHOT_COMPARE = {
    maxDiffPixelRatio: 0.01,
    threshold: 0.2,
    antialiasing: true,
}

/** One line for the report header, so a reader can interpret the counts. */
export const compareSummary = () =>
    `maxDiffPixelRatio ${SCREENSHOT_COMPARE.maxDiffPixelRatio}, ` +
    `threshold ${SCREENSHOT_COMPARE.threshold}, ` +
    `antialiasing ${SCREENSHOT_COMPARE.antialiasing ? "on" : "off"}`
