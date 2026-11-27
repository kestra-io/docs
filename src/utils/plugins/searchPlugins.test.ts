import { describe, expect, it } from "vitest"
import type { CardPlugin } from "~/utils/plugins/pruneForClient"
import {
    filterPluginsBySearch,
    sortPlugins,
} from "~/utils/plugins/searchPlugins"

const searchPlugins = (plugins: CardPlugin[], query: string) =>
    sortPlugins(filterPluginsBySearch(plugins, query), "A-Z", query)

const card = (title: string, extra: Partial<CardPlugin> = {}): CardPlugin => ({
    name: "plugin-aws",
    title,
    group: "io.kestra.plugin.aws",
    ...extra,
})

const aws = card("AWS", { classes: "aws.s3.Upload aws.lambda.Invoke" })
const awsLambda = card("AWS Lambda", {
    subGroup: "io.kestra.plugin.aws.lambda",
    classes: "aws.lambda.Invoke",
})
const awsSns = card("AWS SNS", {
    description: "Fan out to Lambda functions",
    subGroup: "io.kestra.plugin.aws.sns",
})
const mongo = card("MongoDB", {
    name: "plugin-mongodb",
    group: "io.kestra.plugin.mongodb",
})

describe("the /plugins page search", () => {
    it("puts the plugin named after the query first", () => {
        expect(
            searchPlugins([aws, awsSns, mongo, awsLambda], "lambda").map(
                (p) => p.title,
            ),
        ).toEqual(["AWS Lambda", "AWS", "AWS SNS"])
    })

    it("needs every word of the query to match one field", () => {
        expect(
            searchPlugins([awsSns, mongo, awsLambda], "aws lambda").map(
                (p) => p.title,
            ),
        ).toEqual(["AWS Lambda"])
    })

    it("returns every plugin for an empty query", () => {
        expect(filterPluginsBySearch([aws, mongo], "  ")).toEqual([aws, mongo])
    })
})
