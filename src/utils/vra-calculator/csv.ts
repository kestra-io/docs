import { compute } from "./compute"
import type { CalcInputs } from "./types"

export type CsvCell = string | number | boolean | null | undefined
export type CsvRow = CsvCell[]

export const CSV_FILENAME = "vra-kestra-payback.csv"
export const CSV_BOM = "﻿"

function isoDate(date: Date | string): string {
    return typeof date === "string" ? date : date.toISOString().slice(0, 10)
}

/**
 * The reference's `csvRows()`: inputs as entered, then the derived counts,
 * effort and cash sections once they are valid. `generatedOn` is passed in so
 * the output is deterministic; the caller passes today's date.
 */
export function buildCsvRows(
    inputs: CalcInputs,
    generatedOn: Date | string,
): CsvRow[] {
    const { funnel, payback } = compute(inputs)
    const rows: CsvRow[] = []
    rows.push(["vRA to Kestra migration payback estimate"])
    rows.push(["Generated", isoDate(generatedOn)])
    rows.push(["Currency", inputs.cur])
    rows.push([])
    rows.push(["Renewal"])
    rows.push(["Annual vRA and vRO spend today", inputs.today])
    rows.push(["Renewal multiple", inputs.mult])
    if (payback)
        rows.push(["Annual cost at renewal", Math.round(payback.renewalCost)])
    rows.push(["Other annual costs", inputs.other])
    rows.push(["Months until renewal", inputs.renew])
    rows.push([])
    rows.push(["Workflows"])
    rows.push(["vRO workflows in the raw export", inputs.total])
    rows.push(["Not executed in 12 months (%)", inputs.dormant])
    rows.push(["Near-duplicates of another workflow (%)", inputs.dupes])
    rows.push(["Wrappers with no logic of their own (%)", inputs.wrappers])
    if (funnel) {
        rows.push(["Migrate to Kestra", funnel.scope])
        rows.push(["Distinct flows in Kestra", funnel.distinct])
        rows.push(["Near-duplicates", funnel.variants])
        rows.push(["Wrappers", funnel.wrappers])
        rows.push(["Need careful migration", funnel.careful])
    }
    if (payback) {
        const [dW, dM, dC] = payback.distinctByBucket
        const [vW, vM, vC] = payback.variantsByBucket
        rows.push([])
        rows.push([
            "Effort",
            "Distinct flows",
            "Near-duplicates",
            "Hours by hand, first",
            "Hours by hand, each near-duplicate",
            "Hours",
        ])
        rows.push(["Wrappers", dW, vW, 0, 0, 0])
        rows.push([
            "Medium",
            dM,
            vM,
            inputs.hp1,
            inputs.hv1,
            Math.round(payback.hoursByBucket[1]),
        ])
        rows.push([
            "Complex",
            dC,
            vC,
            inputs.hp2,
            inputs.hv2,
            Math.round(payback.hoursByBucket[2]),
        ])
        rows.push(["Complex share of careful migrations (%)", inputs.complex])
        rows.push([
            "AI-assisted vRO migration tool share (%)",
            inputs.tool,
            "Applied to medium first-of-a-kind hours",
        ])
        rows.push([
            "Every workflow by hand, hours",
            Math.round(payback.naiveHours),
        ])
        rows.push([
            "After rationalization, by hand, hours",
            Math.round(payback.manualHours),
        ])
        rows.push(["With the migration tool, hours", Math.round(payback.hours)])
        rows.push(["Blended hourly rate", payback.rate])
        rows.push(["Migration cost", Math.round(payback.migrationCost)])
        rows.push([
            "Saved against converting every workflow by hand",
            Math.round(payback.saved),
        ])
        rows.push([])
        rows.push([
            "Kestra licence and hosting, a year",
            payback.kestraBlank ? "Not entered" : payback.kestraAnnual,
        ])
        rows.push(["Planning horizon, years", payback.horizonYears])
        rows.push(["Payback month", payback.paybackMonth ?? "Beyond 15 years"])
        rows.push([
            "Position after the horizon" +
                (payback.kestraBlank ? " (before Kestra licensing)" : ""),
            Math.round(payback.net),
        ])
        if (payback.kestraBlank && payback.breakEven !== null) {
            rows.push([
                "Highest Kestra price that still saves, a year",
                Math.round(payback.breakEven),
            ])
        }
        rows.push([])
        rows.push(["Year", "Cumulative position against renewing"])
        payback.yearly.forEach((value, i) =>
            rows.push(["Year " + (i + 1), Math.round(value)]),
        )
    }
    rows.push([])
    rows.push([
        "Estimate from starting assumptions. The licence already paid is treated as sunk; the saving is the renewal not signed.",
    ])
    rows.push(["Hours are engineering effort, not a schedule."])
    return rows
}

// A cell a spreadsheet would run as a formula. Inputs reach the CSV as
// entered, and a share link can set them to any short string, so a leading
// "-" counts too unless the whole cell is a plain number like "-5".
function isFormula(v: string): boolean {
    if (/^[=+@\t\r]/.test(v)) return true
    return v.startsWith("-") && !Number.isFinite(Number(v))
}

/**
 * Serializes rows the way the reference does: formula-looking cells are
 * prefixed with ' so spreadsheets do not run them, and cells with a quote,
 * comma or newline are quoted.
 */
export function toCsv(rows: CsvRow[]): string {
    return rows
        .map((row) =>
            row
                .map((cell) => {
                    let v =
                        cell === null || cell === undefined ? "" : String(cell)
                    if (isFormula(v)) v = "'" + v
                    return /[",\n\r]/.test(v)
                        ? '"' + v.replace(/"/g, '""') + '"'
                        : v
                })
                .join(","),
        )
        .join("\n")
}

export function buildCsvFile(
    inputs: CalcInputs,
    generatedOn: Date | string,
): string {
    return CSV_BOM + toCsv(buildCsvRows(inputs, generatedOn))
}
