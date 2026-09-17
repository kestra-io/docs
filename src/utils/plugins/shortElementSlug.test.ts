import { describe, expect, it } from "vitest"
import { resolveShortElementSlug } from "./shortElementSlug"

const pages = [
    "/plugins/plugin-ai",
    "/plugins/plugin-ai/tool",
    "/plugins/plugin-ai/tool/io.kestra.plugin.ai.tool.stdiomcpclient",
    "/plugins/plugin-ai/tool/io.kestra.plugin.ai.tool.skill",
    "/plugins/plugin-ai/tool/io.kestra.plugin.ai.tool.a2aclient",
    "/plugins/plugin-ai/agent/io.kestra.plugin.ai.agent.a2aclient",
    "/plugins/plugin-aws/aws-s3/io.kestra.plugin.aws.s3.upload",
]

describe("resolveShortElementSlug", () => {
    it("sends a bare element name to the element page", () => {
        expect(
            resolveShortElementSlug(
                ["plugin-ai", "tool", "stdiomcpclient"],
                "/plugins/plugin-ai/tool/stdiomcpclient",
                pages,
            ),
        ).toBe("/plugins/plugin-ai/tool/io.kestra.plugin.ai.tool.stdiomcpclient")
    })

    it("prefers the requested subgroup when the bare name is not unique in the plugin", () => {
        expect(
            resolveShortElementSlug(
                ["plugin-ai", "tool", "a2aclient"],
                "/plugins/plugin-ai/tool/a2aclient",
                pages,
            ),
        ).toBe("/plugins/plugin-ai/tool/io.kestra.plugin.ai.tool.a2aclient")
        expect(
            resolveShortElementSlug(
                ["plugin-ai", "agent", "a2aclient"],
                "/plugins/plugin-ai/agent/a2aclient",
                pages,
            ),
        ).toBe("/plugins/plugin-ai/agent/io.kestra.plugin.ai.agent.a2aclient")
    })

    it("falls back to the rest of the plugin when the subgroup has no such element", () => {
        expect(
            resolveShortElementSlug(
                ["plugin-ai", "agent", "skill"],
                "/plugins/plugin-ai/agent/skill",
                pages,
            ),
        ).toBe("/plugins/plugin-ai/tool/io.kestra.plugin.ai.tool.skill")
    })

    it("falls back to the subgroup page when no element matches", () => {
        expect(
            resolveShortElementSlug(
                ["plugin-ai", "tool", "unknown"],
                "/plugins/plugin-ai/tool/unknown",
                pages,
            ),
        ).toBe("/plugins/plugin-ai/tool")
    })

    it("ignores plugin, subgroup and element pages", () => {
        expect(resolveShortElementSlug(["plugin-ai"], "/plugins/plugin-ai", pages)).toBeNull()
        expect(
            resolveShortElementSlug(["plugin-ai", "tool"], "/plugins/plugin-ai/tool", pages),
        ).toBeNull()
        expect(
            resolveShortElementSlug(
                ["plugin-aws", "aws-s3", "io.kestra.plugin.aws.s3.upload"],
                "/plugins/plugin-aws/aws-s3/io.kestra.plugin.aws.s3.upload",
                pages,
            ),
        ).toBeNull()
    })

    it("leaves a three-segment URL that is a known page alone", () => {
        expect(
            resolveShortElementSlug(
                ["plugin-x", "sub", "leaf"],
                "/plugins/plugin-x/sub/leaf",
                ["/plugins/plugin-x/sub/leaf"],
            ),
        ).toBeNull()
    })
})
