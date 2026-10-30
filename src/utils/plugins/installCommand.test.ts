import { describe, expect, it } from "vitest"
import type { PluginMetadata } from "./plugin"
import { getPluginInstallCommand } from "./installCommand"

const pluginMetadata: PluginMetadata[] = [
    {
        group: "io.kestra.plugin.aws",
        artifactGroupId: "io.kestra.plugin",
        artifactId: "plugin-aws",
        name: "aws",
        title: "AWS",
    },
    {
        group: "io.kestra.plugin.aws.s3",
        artifactGroupId: "io.kestra.plugin",
        artifactId: "plugin-aws-s3",
        name: "s3",
        title: "AWS S3",
    },
]

describe("getPluginInstallCommand", () => {
    it("returns the install command for the matching plugin artifact", () => {
        expect(
            getPluginInstallCommand("io.kestra.plugin.aws.S3.List", pluginMetadata),
        ).toBe("./kestra plugins install io.kestra.plugin:plugin-aws-s3:LATEST")
    })

    it("uses the most specific matching metadata group", () => {
        expect(
            getPluginInstallCommand("io.kestra.plugin.aws.Ec2.Start", pluginMetadata),
        ).toBe("./kestra plugins install io.kestra.plugin:plugin-aws:LATEST")
    })

    it("does not return a command for Core plugins", () => {
        const coreMetadata: PluginMetadata[] = [
            {
                group: "io.kestra.plugin.core",
                artifactGroupId: "io.kestra.plugin",
                artifactId: "core",
                name: "core",
                title: "Core",
            },
        ]

        expect(
            getPluginInstallCommand("io.kestra.plugin.core.log.Log", coreMetadata),
        ).toBeUndefined()
    })

    it("does not return a command when plugin metadata is unavailable", () => {
        expect(
            getPluginInstallCommand("io.kestra.plugin.unknown.Task", pluginMetadata),
        ).toBeUndefined()
        expect(getPluginInstallCommand(undefined, pluginMetadata)).toBeUndefined()
    })
})
