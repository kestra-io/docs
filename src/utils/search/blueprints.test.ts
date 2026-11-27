import { describe, expect, it, vi } from "vitest"
import {
    blueprintPlugins,
    blueprintPopularity,
    blueprintsSearchResults,
    type BlueprintEntry,
} from "~/utils/search/blueprints"
import { pluginCard } from "~/utils/search/testing"

vi.mock("astro:env/client", () => ({ API_URL: "https://api.test/v1" }))

const aws = pluginCard("AWS", {
    className: "io.kestra.plugin.aws",
    classes: "aws.lambda.Invoke aws.s3.Upload aws.cli.AwsCLI",
    blueprints: 120,
})
const lambda = pluginCard("AWS Lambda", {
    className: "io.kestra.plugin.aws.lambda",
    classes: "aws.lambda.Invoke",
    blueprints: 2,
    usageCount: 500,
})
const s3 = pluginCard("AWS S3", {
    className: "io.kestra.plugin.aws.s3",
    classes: "aws.s3.Upload aws.s3.Trigger",
    blueprints: 40,
    usageCount: 300,
})
const cli = pluginCard("AWS CLI", {
    className: "io.kestra.plugin.aws.cli",
    classes: "aws.cli.AwsCLI",
    blueprints: 30,
})
const python = pluginCard("Python", {
    name: "plugin-script-python",
    group: "io.kestra.plugin.scripts",
    categories: ["CORE"],
    classes: "scripts.python.Script",
    blueprints: 700,
    usageCount: 170000,
})
const slack = pluginCard("Slack Notifications", {
    name: "plugin-notifications",
    group: "io.kestra.plugin.slack",
    classes: "slack.SlackIncomingWebhook",
    blueprints: 900,
})
const core = pluginCard("Core Plugins and tasks", {
    name: "core",
    group: "io.kestra.plugin.core",
    classes: "core.flow.Parallel core.log.Log",
    blueprints: 2000,
})
const cards = [aws, lambda, s3, cli, python, slack, core]

const blueprint = (
    id: string,
    title: string,
    extra: Partial<BlueprintEntry> = {},
): BlueprintEntry => ({
    id,
    title,
    description: "",
    tags: [],
    tasks: [],
    ...extra,
})

const parallelLambdas = blueprint(
    "aws-lambda",
    "Invoke multiple AWS Lambda functions in parallel",
    {
        tasks: [
            "core.flow.Parallel",
            "aws.lambda.Invoke",
            "scripts.python.Script",
        ],
    },
)
const fanOut = blueprint(
    "aws-s3-fanout",
    "Fan Out S3 Object Events to Lambda and SNS",
    {
        tasks: [
            "aws.s3.Trigger",
            "aws.lambda.Invoke",
            "slack.SlackIncomingWebhook",
        ],
        tags: ["cloud"],
    },
)
const sentinel = blueprint(
    "lambda-lag",
    "AWS Lambda IteratorAge Stream Processing Lag Sentinel",
    { tasks: ["aws.cli.AwsCLI"] },
)
const email = blueprint(
    "resend",
    "Send an email and corresponding attachments",
    { description: "Uses Resend to deliver the report." },
)
const all = [email, fanOut, parallelLambdas, sentinel]

const ids = (query: string) =>
    blueprintsSearchResults(all, cards, query).results.map(
        (r) => r.blueprint.id,
    )

describe("blueprintPlugins", () => {
    it("takes the plugin named in the title, mapped to its most specific card", () => {
        const { main, others } = blueprintPlugins(parallelLambdas, cards)
        expect(main?.title).toBe("AWS Lambda")
        expect(others.map((c) => c.title)).toEqual(["Python"])
    })

    it("falls back to the most specific plugin, never a helper or a notification", () => {
        const unnamed = blueprint("secrets", "Unrotated secret sentinel", {
            tasks: [
                "scripts.python.Script",
                "slack.SlackIncomingWebhook",
                "aws.s3.Upload",
                "aws.cli.AwsCLI",
            ],
        })
        expect(blueprintPlugins(unnamed, cards).main?.title).toBe("AWS CLI")
    })
})

describe("blueprintPopularity", () => {
    it("borrows the main plugin's usage", () => {
        expect(blueprintPopularity(fanOut, cards)).toEqual({
            usage: 300,
            plugin: "AWS S3",
        })
    })

    it("gives a helper's usage only to blueprints whose title names it", () => {
        const unnamed = blueprint("sentinel", "Aerospike headroom sentinel", {
            tasks: ["scripts.python.Script"],
        })
        const named = blueprint("py", "Add a parametrized Python script", {
            tasks: ["scripts.python.Script"],
        })
        expect(blueprintPopularity(unnamed, cards)).toEqual({
            usage: 0,
            plugin: "",
        })
        expect(blueprintPopularity(named, cards)).toEqual({
            usage: 170000,
            plugin: "Python",
        })
    })
})

describe("blueprintsSearchResults", () => {
    it("matches unfinished words, title matches first, then the most used", () => {
        expect(ids("lamb")).toEqual([
            "aws-lambda",
            "aws-s3-fanout",
            "lambda-lag",
        ])
    })

    it("needs every word, wherever it appears", () => {
        expect(ids("send ema")).toEqual(["resend"])
        expect(ids("resend report")).toEqual(["resend"])
        expect(ids("lamb sns")).toEqual(["aws-s3-fanout"])
    })

    it("finds blueprints from a full task class", () => {
        expect(ids("io.kestra.plugin.aws.cli.AwsCLI")).toEqual(["lambda-lag"])
    })

    it("rotates through the tools before anything is typed", () => {
        const another = blueprint(
            "lambda-alias",
            "Invoke an AWS Lambda alias",
            { tasks: ["aws.lambda.Invoke"] },
        )
        const rows = blueprintsSearchResults(
            [...all, another],
            cards,
            "",
        ).results.map((r) => r.blueprint.id)
        expect(rows).toEqual([
            "lambda-alias",
            "aws-s3-fanout",
            "resend",
            "lambda-lag",
            "aws-lambda",
        ])
    })

    it("builds rows with the main plugin's icon first, the tags and its tasks", () => {
        const [row] = blueprintsSearchResults([fanOut], cards, "").results
        expect(row).toMatchObject({
            url: "blueprints/aws-s3-fanout",
            type: "BLUEPRINTS",
            title: "Fan Out S3 Object Events to Lambda and SNS",
        })
        expect(row.blueprint).toMatchObject({
            tags: ["Cloud"],
            icons: [
                "/icons/io.kestra.plugin.aws.s3.svg",
                "/icons/io.kestra.plugin.aws.lambda.svg",
                "/icon.svg",
            ],
            focusTasks: ["aws.s3.Trigger"],
        })
    })
})
