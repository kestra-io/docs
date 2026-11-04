import { describe, expect, it } from "vitest"
import { GOLDEN } from "./__fixtures__/golden"
import { buildCsvFile, buildCsvRows, toCsv } from "./csv"
import { resolveInputs } from "./defaults"

describe("CSV", () => {
    it.each(GOLDEN.cases.map((c) => [c.name, c] as const))(
        "matches the reference for %s",
        (_name, c) => {
            expect(toCsv(buildCsvRows(c.state, GOLDEN._csvGeneratedDate))).toBe(
                c.csv,
            )
        },
    )

    it.each([
        [
            "quotes commas, quotes and newlines",
            ["a,b", 'say "hi"', "x\ny", "plain"],
            '"a,b","say ""hi""","x\ny",plain',
        ],
        [
            "neutralises formulas",
            ["=SUM(A1)", "+1", "@x", "-5"],
            "'=SUM(A1),'+1,'@x,-5",
        ],
        [
            "neutralises a leading minus, tab or CR unless the cell is a number",
            ["-2+3+cmd|' /C calc'!A0", "-1.5", "\t=1", "\r=1"],
            "'-2+3+cmd|' /C calc'!A0,-1.5,'\t=1,\"'\r=1\"",
        ],
        ["writes blanks for null and undefined", [null, undefined, 0], ",,0"],
    ])("%s", (_label, row, expected) => {
        expect(toCsv([row])).toBe(expected)
    })

    it("neutralises a formula set through a share link", () => {
        const csv = toCsv(
            buildCsvRows(resolveInputs({ total: "-1+1" }), "2026-10-19"),
        )
        expect(csv).toContain("vRO workflows in the raw export,'-1+1")
    })

    it("prefixes the BOM and takes the local calendar date from a Date", () => {
        expect(buildCsvFile(resolveInputs(), new Date(2026, 9, 19, 8))).toMatch(
            /^\uFEFFvRA to Kestra migration payback estimate\nGenerated,2026-10-19\n/,
        )
    })
})
