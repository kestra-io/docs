import dayjs from "dayjs"
import { compute } from "./compute"
import type { CalcInputs } from "./defaults"

type CsvRow = (string | number | boolean | null | undefined)[]

export const CSV_FILENAME = "vra-kestra-payback.csv"

/** The reference's `csvRows()`; `generatedOn` is passed in to stay pure. */
export function buildCsvRows(
    inputs: CalcInputs,
    generatedOn: Date | string,
): CsvRow[] {
    const { funnel, payback: p } = compute(inputs)
    const rows: CsvRow[] = [
        ["vRA to Kestra migration payback estimate"],
        // The visitor's calendar date, not UTC's, so a late-night export keeps
        // the day they see.
        ["Generated", dayjs(generatedOn).format("YYYY-MM-DD")],
        ["Currency", inputs.cur],
        [],
        ["Renewal"],
        ["Annual vRA and vRO spend today", inputs.today],
        ["Renewal multiple", inputs.mult],
    ]
    if (p) rows.push(["Annual cost at renewal", Math.round(p.renewalCost)])
    rows.push(
        ["Other annual costs", inputs.other],
        ["Months until renewal", inputs.renew],
        [],
        ["Workflows"],
        ["vRO workflows in the raw export", inputs.total],
        ["Not executed in 12 months (%)", inputs.dormant],
        ["Near-duplicates of another workflow (%)", inputs.dupes],
        ["Wrappers with no logic of their own (%)", inputs.wrappers],
    )
    if (funnel) {
        rows.push(
            ["Migrate to Kestra", funnel.scope],
            ["Distinct flows in Kestra", funnel.distinct],
            ["Near-duplicates", funnel.variants],
            ["Wrappers", funnel.wrappers],
            ["Need careful migration", funnel.careful],
        )
    }
    if (p) {
        const [dW, dM, dC] = p.distinctByBucket
        const [vW, vM, vC] = p.variantsByBucket
        const [, hM, hC] = p.hoursByBucket.map(Math.round)
        rows.push(
            [],
            [
                "Effort",
                "Distinct flows",
                "Near-duplicates",
                "Hours by hand, first",
                "Hours by hand, each near-duplicate",
                "Hours",
            ],
            ["Wrappers", dW, vW, 0, 0, 0],
            ["Medium", dM, vM, inputs.hp1, inputs.hv1, hM],
            ["Complex", dC, vC, inputs.hp2, inputs.hv2, hC],
            ["Complex share of careful migrations (%)", inputs.complex],
            [
                "Migration Assistant share (%)",
                inputs.tool,
                "Applied to medium first-of-a-kind hours",
            ],
            ["Every workflow by hand, hours", Math.round(p.naiveHours)],
            [
                "After rationalization, by hand, hours",
                Math.round(p.manualHours),
            ],
            ["With the Migration Assistant, hours", Math.round(p.hours)],
            ["Blended hourly rate", p.rate],
            ["Migration cost", Math.round(p.migrationCost)],
            [
                "Saved against converting every workflow by hand",
                Math.round(p.saved),
            ],
            [],
            [
                "Kestra licence and hosting, a year",
                p.kestraBlank ? "Not entered" : p.kestraAnnual,
            ],
            ["Planning horizon, years", p.horizonYears],
            ["Payback month", p.paybackMonth ?? "Beyond 15 years"],
            [
                "Position after the horizon" +
                    (p.kestraBlank ? " (before Kestra licensing)" : ""),
                Math.round(p.net),
            ],
        )
        if (p.kestraBlank && p.breakEven !== null) {
            rows.push([
                "Highest Kestra price that still saves, a year",
                Math.round(p.breakEven),
            ])
        }
        rows.push(
            [],
            ["Year", "Cumulative position against renewing"],
            ...p.yearly.map((value, i) => [
                "Year " + (i + 1),
                Math.round(value),
            ]),
        )
    }
    rows.push(
        [],
        [
            "Estimate from starting assumptions. The licence already paid is treated as sunk; the saving is the renewal not signed.",
        ],
        ["Hours are engineering effort, not a schedule."],
    )
    return rows
}

/**
 * Formula-like cells get a ' prefix. Inputs reach the CSV as typed, share links
 * included, so a leading "-" is a formula too unless the cell is a number.
 */
function csvCell(cell: CsvRow[number]): string {
    let v = String(cell ?? "")
    if (/^[=+@\t\r]/.test(v) || (v[0] === "-" && !Number.isFinite(Number(v))))
        v = "'" + v
    return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
}

export function toCsv(rows: CsvRow[]): string {
    return rows.map((row) => row.map(csvCell).join(",")).join("\n")
}

export function buildCsvFile(
    inputs: CalcInputs,
    generatedOn: Date | string,
): string {
    return "\uFEFF" + toCsv(buildCsvRows(inputs, generatedOn))
}
