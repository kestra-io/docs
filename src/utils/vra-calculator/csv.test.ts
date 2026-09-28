import { describe, expect, it } from "vitest"
import { GOLDEN } from "./__fixtures__/golden"
import { CSV_BOM, CSV_FILENAME, buildCsvFile, buildCsvRows, toCsv } from "./csv"
import { resolveInputs } from "./defaults"

describe("CSV matches the reference", () => {
    it.each(GOLDEN.cases.map((c) => [c.name, c] as const))("%s", (_name, c) => {
        expect(toCsv(buildCsvRows(c.state, GOLDEN._csvGeneratedDate))).toBe(
            c.csv,
        )
    })
})

describe("toCsv", () => {
    it("quotes commas, quotes and newlines", () => {
        expect(toCsv([["a,b", 'say "hi"', "x\ny", "plain"]])).toBe(
            '"a,b","say ""hi""","x\ny",plain',
        )
    })

    it("neutralises formula-looking cells", () => {
        expect(toCsv([["=SUM(A1)", "+1", "@x", "-5"]])).toBe(
            "'=SUM(A1),'+1,'@x,-5",
        )
    })

    it("writes blanks for null and undefined, and empty rows as empty lines", () => {
        expect(toCsv([[null, undefined, 0], [], ["end"]])).toBe(",,0\n\nend")
    })
})

describe("buildCsvFile", () => {
    it("prefixes the BOM and takes the date from a Date", () => {
        const file = buildCsvFile(
            resolveInputs(),
            new Date("2026-10-19T08:00:00Z"),
        )
        expect(
            file.startsWith(
                CSV_BOM +
                    "vRA to Kestra migration payback estimate\nGenerated,2026-10-19\n",
            ),
        ).toBe(true)
        expect(CSV_FILENAME).toBe("vra-kestra-payback.csv")
    })
})
