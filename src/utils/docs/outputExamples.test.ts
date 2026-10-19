import { readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { load } from "js-yaml"
import { describe, expect, it } from "vitest"

const contents = fileURLToPath(new URL("../../contents/", import.meta.url))
const outputValues = "io.kestra.plugin.core.output.OutputValues"
const deliberateDebugging = new Map([
    ["docs/expressions/01.context/index.mdx", 1],
    ["docs/05.workflow-components/01.tasks/02.taskruns/index.md", 1],
    ["docs/09.ui/10.playground/index.md", 3],
])

function source(path: string) {
    return readFileSync(join(contents, path), "utf8")
}

function yamlBlocks(path: string): any[] {
    return [...source(path).matchAll(/^```ya?ml[^\n]*\n([\s\S]*?)^```/gm)].map(
        (match) => load(match[1]),
    )
}

function flow(path: string, id: string): any {
    const value = yamlBlocks(path).find((block) => block?.id === id)
    expect(value, `${path}: ${id}`).toBeDefined()
    return value
}

describe("workflow output examples", () => {
    it("reserves Return for deliberate debugging and historical migration guidance", () => {
        for (const directory of ["docs", "resources", "orchestration"]) {
            for (const file of readdirSync(join(contents, directory), { recursive: true, withFileTypes: true })) {
                if (!file.isFile()) continue
                const path = relative(contents, join(file.parentPath, file.name))
                if (!/\.(mdx?|yaml)$/.test(path) || path.includes("/11.migration-guide/v0.")) {
                    continue
                }
                const uses = source(path).match(/io\.kestra\.(?:plugin\.core\.debug|core\.tasks\.debugs)\.Return/g) ?? []
                expect(uses.length, path).toBe(deliberateDebugging.get(path) ?? 0)
            }
        }
    })

    it("exports the date and loop results through OutputValues", () => {
        const date = yamlBlocks("docs/05.workflow-components/01.flow/index.md")[0]
        expect(date.tasks.find((task: any) => task.id === "hello").message).toBe("Hello, {{ inputs['my-value'] }}!")
        expect(date.tasks.find((task: any) => task.id === "date").type).toBe(outputValues)
        expect(date.outputs[0].value).toBe("{{ outputs.date.values.result }}")

        const loop = flow("docs/15.how-to-guides/loop/index.md", "loop_outputs")
        expect(loop.tasks[0].tasks[0].type).toBe(outputValues)
        expect(loop.tasks[0].outputs[0].value).toBe("{{ outputs.process.values.result }}")
    })

    it("keeps mocked output shapes consistent with the transformation tasks", () => {
        const path = "docs/07.enterprise/02.governance/unit-tests/index.md"
        const etl = flow(path, "etl_daily_products_bigquery")
        expect(etl.tasks.find((task: any) => task.id === "transform_to_products_name").type).toBe(outputValues)
        const suite = flow(path, "etl_daily_products_bigquery_testsuite")
        const mocked = suite.testCases[1].fixtures.tasks.find((task: any) => task.id === "transform_to_products_name")
        expect(JSON.parse(mocked.outputs.values.result)).toEqual(["my-product-1"])
        for (const testCase of suite.testCases) {
            expect(testCase.assertions[0].value).toBe("{{outputs.transform_to_uppercase.values.result}}")
        }
    })

    it("passes secrets directly to authentication and avoids dumping webhook credentials", () => {
        const blocks = yamlBlocks("docs/expressions/01.context/index.mdx")
        const secretTask = blocks.flatMap((block) => block?.tasks ?? []).find((task) => task.headers?.Authorization?.includes("secret("))
        expect(secretTask.type).toBe("io.kestra.plugin.core.http.Request")
        expect(secretTask.headers).toEqual({ Authorization: "Bearer {{ secret('MY_SECRET') }}" })
        for (const block of yamlBlocks("docs/15.how-to-guides/webhooks/index.md")) {
            expect(block.tasks[0].message).toBe("Webhook received")
        }
    })
})
