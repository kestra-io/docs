import { describe, expect, it } from "vitest"
import { pluginsSearchResults } from "~/utils/search/plugins"
import { pluginCard } from "~/utils/search/testing"

const aws = pluginCard("AWS", {
    href: "/plugins/plugin-aws",
    classes: "aws.s3.Upload aws.lambda.Invoke",
})
const awsLambda = pluginCard("AWS Lambda", {
    href: "/plugins/plugin-aws/aws-lambda",
    subGroup: "io.kestra.plugin.aws.lambda",
    description: "Tasks that invoke <AWS> Lambda functions",
    classes: "aws.lambda.Invoke",
})

describe("pluginsSearchResults", () => {
    it("orders the other matches by usage, unlike the A to Z /plugins page", () => {
        const sns = pluginCard("AWS SNS", {
            href: "/plugins/plugin-aws/aws-sns",
            classes: "aws.sns.Lambda",
            usageCount: 50,
        })
        const popular = { ...aws, usageCount: 900 }
        const { results } = pluginsSearchResults(
            [sns, awsLambda, popular],
            "lambda",
        )
        expect(results.map((r) => r.title)).toEqual([
            "AWS Lambda",
            "AWS",
            "AWS SNS",
        ])
    })

    it("returns plugin pages as popup rows, with nothing highlighted", () => {
        const { total, results } = pluginsSearchResults(
            [aws, awsLambda],
            "lambda",
        )
        expect(total).toBe(2)
        expect(results.map((r) => [r.url, r.type])).toEqual([
            ["plugins/plugin-aws/aws-lambda", "PLUGINS"],
            ["plugins/plugin-aws", "PLUGINS"],
        ])
        expect(results[0].highlightTitle).toBeUndefined()
        expect(results[0].plugin.description).toBe(
            "Tasks that invoke <AWS> Lambda functions",
        )
    })

    it("shows the Enterprise label instead of (EE), with the card's icon and tags", () => {
        const awsEe = pluginCard("AWS (EE)", {
            href: "/plugins/plugin-ee-aws",
            className: "io.kestra.plugin.ee.aws",
            isEnterprise: true,
            categories: ["CLOUD", "INFRASTRUCTURE"],
            classes: "ee.aws.runner.LambdaMicroVm",
        })
        const [first] = pluginsSearchResults([awsEe], "lambda").results
        expect(first.title).toBe("AWS")
        expect(first.plugin).toMatchObject({
            icon: "/icons/io.kestra.plugin.ee.aws.svg",
            isEnterprise: true,
            categories: ["Cloud", "Infrastructure"],
        })
    })

    it("names each previewed task after its class", () => {
        const withTasks = {
            ...awsLambda,
            elements: [
                {
                    type: "Tasks",
                    total: 1,
                    items: [
                        {
                            cls: "io.kestra.plugin.aws.lambda.Invoke",
                            title: "Invoke",
                        },
                    ],
                },
            ],
        }
        const [first] = pluginsSearchResults([withTasks], "lambda").results
        expect(first.plugin.elements[0].items[0].name).toBe("Invoke")
    })

    it("finds the plugins holding a full task class", () => {
        const { results } = pluginsSearchResults(
            [aws, awsLambda],
            "io.kestra.plugin.aws.lambda.Invoke",
        )
        expect(results.map((r) => r.title).sort()).toEqual([
            "AWS",
            "AWS Lambda",
        ])
    })

    it("lists the most used plugins first when nothing is typed", () => {
        const python = pluginCard("Python", {
            name: "plugin-script-python",
            href: "/plugins/plugin-script-python",
            usageCount: 9000,
        })
        expect(
            pluginsSearchResults([aws, awsLambda, python], "").results[0].title,
        ).toBe("Python")
    })
})
