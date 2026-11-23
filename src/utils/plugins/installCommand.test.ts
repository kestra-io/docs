import { describe, expect, it } from "vitest"
import type { PluginMetadata } from "./plugin"
import { getPluginInstallCommand } from "./installCommand"
import { getKestractlPluginGetCommand } from "./kestractlInstallCommand"

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
            getPluginInstallCommand("io.kestra.plugin.aws.s3.List", pluginMetadata),
        ).toBe("io.kestra.plugin:plugin-aws-s3")
    })

    it("uses the most specific matching metadata group", () => {
        expect(
            getPluginInstallCommand("io.kestra.plugin.aws.Ec2.Start", pluginMetadata),
        ).toBe("io.kestra.plugin:plugin-aws")
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

    it("falls back to the page artifact when no metadata group matches the task package", () => {
        const dotnetMetadata: PluginMetadata = {
            group: "io.kestra.plugin.scripts.dotnet",
            artifactGroupId: "io.kestra.plugin",
            artifactId: "plugin-script-dotnet",
            name: "dotnet",
            title: ".NET",
        }

        expect(
            getPluginInstallCommand(
                "io.kestra.plugin.scripts.csharp.Script",
                [dotnetMetadata],
                dotnetMetadata,
            ),
        ).toBe("io.kestra.plugin:plugin-script-dotnet")
    })

    it("does not fall back to the page artifact when a Core group matches the task", () => {
        const coreMetadata: PluginMetadata = {
            group: "io.kestra.plugin.core",
            artifactGroupId: "io.kestra.plugin",
            artifactId: "core",
            name: "core",
            title: "Core",
        }

        expect(
            getPluginInstallCommand(
                "io.kestra.plugin.core.log.Log",
                [coreMetadata],
                pluginMetadata[0],
            ),
        ).toBeUndefined()
    })

    it("does not use a Core page artifact as a fallback", () => {
        const eeCoreMetadata: PluginMetadata = {
            group: "io.kestra.plugin.ee",
            artifactGroupId: "io.kestra.plugin.ee",
            artifactId: "core",
            name: "ee",
            title: "Enterprise",
        }

        expect(
            getPluginInstallCommand(
                "io.kestra.plugin.other.Task",
                [],
                eeCoreMetadata,
            ),
        ).toBeUndefined()
    })
})


describe("getKestractlPluginGetCommand", () => {
    it("uses Kestra compatibility instead of an unsupported symbolic plugin version", () => {
        expect(
            getKestractlPluginGetCommand("io.kestra.plugin:plugin-aws-s3"),
        ).toBe("kestractl plugins get io.kestra.plugin:plugin-aws-s3 --compatible-for $KESTRA_VERSION")
    })

    it("accepts an exact plugin version when one is supplied", () => {
        expect(
            getKestractlPluginGetCommand("io.kestra.plugin:plugin-aws-s3", "1.2.3"),
        ).toBe("kestractl plugins get io.kestra.plugin:plugin-aws-s3:1.2.3")
    })

    it("returns no command when the artifact coordinate is missing", () => {
        expect(getKestractlPluginGetCommand(undefined)).toBe("")
    })
})
