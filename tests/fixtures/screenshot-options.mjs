// Comparison tolerances for scripts/visual-diff-report.mjs: a pair within
// maxDiffPixelRatio counts as noise between two captures, not a change.
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
