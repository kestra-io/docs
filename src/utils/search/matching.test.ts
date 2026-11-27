import { describe, expect, it } from "vitest"
import { includesAll, searchTokens } from "~/utils/search/matching"

describe("searchTokens", () => {
    it("splits the query into lowercase words", () => {
        expect(searchTokens("  AWS   Lambda ")).toEqual(["aws", "lambda"])
    })

    it("drops the plugin package so a full task class matches the indexes' short classes", () => {
        expect(searchTokens("io.kestra.plugin.kafka.Consume")).toEqual([
            "kafka.consume",
        ])
    })
})

describe("includesAll", () => {
    it("needs every word, unfinished ones included", () => {
        expect(
            includesAll("Invoke AWS Lambda functions", ["lamb", "aws"]),
        ).toBe(true)
        expect(
            includesAll("Invoke AWS Lambda functions", ["lamb", "sns"]),
        ).toBe(false)
    })
})
