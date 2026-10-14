import { describe, expect, it } from "vitest"
import { buildPluginPageProps } from "~/utils/plugins/buildPluginPageProps"
import type { Plugin } from "~/utils/plugins/plugin"
import type { PluginPage } from "~/utils/plugins/types"

describe("buildPluginPageProps", () => {
    it("uses subgroup title in heading for tasks belonging to a subgroup", () => {
        const rootPlugin: Plugin = {
            name: "core",
            title: "Core Plugins and tasks",
            group: "io.kestra.plugin.core",
            tasks: [
                { cls: "io.kestra.plugin.core.SomeCoreTask" },
                { cls: "io.kestra.plugin.core.debug.Return" }
            ],
        }

        const debugSubgroupPlugin: Plugin = {
            name: "core",
            title: "Debug",
            group: "io.kestra.plugin.core.debug",
            subGroup: "io.kestra.plugin.core.debug",
            tasks: [{ cls: "io.kestra.plugin.core.debug.Return" }],
        }

        const flowSubgroupPlugin: Plugin = {
            name: "core",
            title: "Flow",
            group: "io.kestra.plugin.core.flow",
            subGroup: "io.kestra.plugin.core.flow",
            tasks: [{ cls: "io.kestra.plugin.core.flow.Pause" }],
        }

        const plugins = [rootPlugin, debugSubgroupPlugin, flowSubgroupPlugin]

        const sidebarPluginData: PluginPage = {
            body: {
                group: "io.kestra.plugin.core",
                plugins,
            },
        }

        const props = buildPluginPageProps({
            pluginName: "core",
            subGroup: undefined,
            pluginType: "io.kestra.plugin.core.debug.Return",
            pathname: "/plugins/core/tasks/io.kestra.plugin.core.debug.Return",
            pageNames: {},
            allPlugins: plugins,
            allPluginMetadata: [],
            blueprintCounts: {},
            relatedBlogs: [],
            page: {
                title: "Return",
                body: {},
            },
            sidebarPluginData,
        })

        expect(props.headingTitle).toBe("Debug Return")
    })

    it("falls back to root plugin title for tasks defined at root level", () => {
        const rootPlugin: Plugin = {
            name: "core",
            title: "Core",
            group: "io.kestra.plugin.core",
            tasks: [{ cls: "io.kestra.plugin.core.RootTask" }],
        }

        const plugins = [rootPlugin]

        const sidebarPluginData: PluginPage = {
            body: {
                group: "io.kestra.plugin.core",
                plugins,
            },
        }

        const props = buildPluginPageProps({
            pluginName: "core",
            subGroup: undefined,
            pluginType: "io.kestra.plugin.core.RootTask",
            pathname: "/plugins/core/tasks/io.kestra.plugin.core.RootTask",
            pageNames: {},
            allPlugins: plugins,
            allPluginMetadata: [],
            blueprintCounts: {},
            relatedBlogs: [],
            page: {
                title: "RootTask",
                body: {},
            },
            sidebarPluginData,
        })

        expect(props.headingTitle).toBe("Core RootTask")
    })

    it("keeps root categories and metadata on task pages reached through a subgroup URL", () => {
        const rootPlugin: Plugin = {
            name: "plugin-aws",
            title: "AWS",
            group: "io.kestra.plugin.aws",
            categories: ["CLOUD", "DATA", "AI", "INFRASTRUCTURE"],
            tasks: [{ cls: "io.kestra.plugin.aws.s3.Upload" }],
        }

        const s3SubgroupPlugin: Plugin = {
            name: "plugin-aws",
            title: "AWS S3",
            group: "io.kestra.plugin.aws",
            subGroup: "io.kestra.plugin.aws.s3",
            categories: ["CLOUD", "DATA"],
            tasks: [{ cls: "io.kestra.plugin.aws.s3.Upload" }],
        }

        const dynamoSubgroupPlugin: Plugin = {
            name: "plugin-aws",
            title: "AWS DynamoDB",
            group: "io.kestra.plugin.aws",
            subGroup: "io.kestra.plugin.aws.dynamodb",
            tasks: [{ cls: "io.kestra.plugin.aws.dynamodb.PutItem" }],
        }

        const plugins = [rootPlugin, s3SubgroupPlugin, dynamoSubgroupPlugin]

        const props = buildPluginPageProps({
            pluginName: "plugin-aws",
            subGroup: "aws-s3",
            pluginType: "io.kestra.plugin.aws.s3.Upload",
            pathname: "/plugins/plugin-aws/aws-s3/io.kestra.plugin.aws.s3.upload",
            pageNames: {},
            allPlugins: plugins,
            allPluginMetadata: [
                { name: "aws", group: "io.kestra.plugin.aws", title: "AWS" },
                { name: "aws", group: "io.kestra.plugin.aws.s3", title: "AWS S3" },
            ] as any,
            blueprintCounts: {},
            relatedBlogs: [],
            page: {
                title: "Upload",
                body: {},
            },
            sidebarPluginData: {
                body: {
                    group: "io.kestra.plugin.aws",
                    plugins,
                },
            },
        })

        expect(props.headingTitle).toBe("AWS S3 Upload")
        expect(props.currentSubgroupPlugin).toBeUndefined()
        expect(props.currentPluginCategories).toEqual(["CLOUD", "DATA", "AI", "INFRASTRUCTURE"])
        expect(props.currentPluginMetadata.map((m) => m.group)).toEqual([
            "io.kestra.plugin.aws",
            "io.kestra.plugin.aws.s3",
        ])
    })

    it("collapses redundant CLI task names when spaces are removed", () => {
        const rootPlugin: Plugin = {
            name: "plugin-terraform",
            title: "Terraform",
            group: "io.kestra.plugin.terraform",
            tasks: [{ cls: "io.kestra.plugin.terraform.cli.TerraformCLI" }],
        }

        const cliSubgroup: Plugin = {
            name: "plugin-terraform",
            title: "Terraform CLI",
            group: "io.kestra.plugin.terraform.cli",
            subGroup: "io.kestra.plugin.terraform.cli",
            tasks: [{ cls: "io.kestra.plugin.terraform.cli.TerraformCLI" }],
        }

        const plugins = [rootPlugin, cliSubgroup]
        const pathname = "/plugins/plugin-terraform/cli/io.kestra.plugin.terraform.cli.terraformcli"

        const props = buildPluginPageProps({
            pluginName: "plugin-terraform",
            subGroup: "cli",
            pluginType: "io.kestra.plugin.terraform.cli.TerraformCLI",
            pathname,
            pageNames: {},
            allPlugins: plugins,
            allPluginMetadata: [
                { name: "terraform", group: "io.kestra.plugin.terraform.cli", title: "Terraform CLI" },
            ] as any,
            blueprintCounts: {},
            relatedBlogs: [],
            page: { title: "TerraformCLI", body: {} },
            sidebarPluginData: { body: { group: "io.kestra.plugin.terraform", plugins } },
        })

        expect(props.headingTitle).toBe("Terraform CLI")
        expect(props.pageNamesHeading[pathname]).toBe("Terraform CLI")
    })

    it("collapses container titles when the task name matches whole words", () => {
        const rootPlugin: Plugin = {
            name: "plugin-kubernetes",
            title: "Kubernetes",
            group: "io.kestra.plugin.kubernetes",
            tasks: [{ cls: "io.kestra.plugin.kubernetes.runner.Kubernetes" }],
        }

        const runnerSubgroup: Plugin = {
            name: "plugin-kubernetes",
            title: "Kubernetes Runner",
            group: "io.kestra.plugin.kubernetes.runner",
            subGroup: "io.kestra.plugin.kubernetes.runner",
            tasks: [{ cls: "io.kestra.plugin.kubernetes.runner.Kubernetes" }],
        }

        const plugins = [rootPlugin, runnerSubgroup]
        const pathname = "/plugins/plugin-kubernetes/runner/io.kestra.plugin.kubernetes.runner.kubernetes"

        const props = buildPluginPageProps({
            pluginName: "plugin-kubernetes",
            subGroup: "runner",
            pluginType: "io.kestra.plugin.kubernetes.runner.Kubernetes",
            pathname,
            pageNames: {},
            allPlugins: plugins,
            allPluginMetadata: [
                { name: "kubernetes", group: "io.kestra.plugin.kubernetes.runner", title: "Kubernetes Runner" },
            ] as any,
            blueprintCounts: {},
            relatedBlogs: [],
            page: { title: "Kubernetes", body: {} },
            sidebarPluginData: { body: { group: "io.kestra.plugin.kubernetes", plugins } },
        })

        expect(props.headingTitle).toBe("Kubernetes Runner")
        expect(props.pageNamesHeading[pathname]).toBe("Kubernetes Runner")
    })

    it("does not collapse when task name is a substring of a container word", () => {
        const rootPlugin: Plugin = {
            name: "plugin-gcp",
            title: "Google Cloud",
            group: "io.kestra.plugin.gcp",
            tasks: [{ cls: "io.kestra.plugin.gcp.compute.Put" }],
        }

        const computeSubgroup: Plugin = {
            name: "plugin-gcp",
            title: "Google Compute",
            group: "io.kestra.plugin.gcp.compute",
            subGroup: "io.kestra.plugin.gcp.compute",
            tasks: [{ cls: "io.kestra.plugin.gcp.compute.Put" }],
        }

        const plugins = [rootPlugin, computeSubgroup]
        const pathname = "/plugins/plugin-gcp/compute/io.kestra.plugin.gcp.compute.put"

        const props = buildPluginPageProps({
            pluginName: "plugin-gcp",
            subGroup: "compute",
            pluginType: "io.kestra.plugin.gcp.compute.Put",
            pathname,
            pageNames: {},
            allPlugins: plugins,
            allPluginMetadata: [
                { name: "gcp", group: "io.kestra.plugin.gcp.compute", title: "Google Compute" },
            ] as any,
            blueprintCounts: {},
            relatedBlogs: [],
            page: { title: "Put", body: {} },
            sidebarPluginData: { body: { group: "io.kestra.plugin.gcp", plugins } },
        })

        expect(props.headingTitle).toBe("Google Compute Put")
        expect(props.pageNamesHeading[pathname]).toBe("Google Compute Put")
    })

    it("prefixes plugin name when collapsed title is just the bare task name (log.Log)", () => {
        const rootPlugin: Plugin = {
            name: "core",
            title: "Core",
            group: "io.kestra.plugin.core",
            tasks: [{ cls: "io.kestra.plugin.core.log.Log" }],
        }

        const logSubgroup: Plugin = {
            name: "core",
            title: "Log",
            group: "io.kestra.plugin.core.log",
            subGroup: "io.kestra.plugin.core.log",
            tasks: [{ cls: "io.kestra.plugin.core.log.Log" }],
        }

        const plugins = [rootPlugin, logSubgroup]
        const pathname = "/plugins/core/log/io.kestra.plugin.core.log.log"

        const props = buildPluginPageProps({
            pluginName: "core",
            subGroup: "log",
            pluginType: "io.kestra.plugin.core.log.Log",
            pathname,
            pageNames: {},
            allPlugins: plugins,
            allPluginMetadata: [
                { name: "core", group: "io.kestra.plugin.core.log", title: "Log" },
            ] as any,
            blueprintCounts: {},
            relatedBlogs: [],
            page: { title: "Log", body: {} },
            sidebarPluginData: { body: { group: "io.kestra.plugin.core", plugins } },
        })

        expect(props.headingTitle).toBe("Core Log")
        expect(props.pageNamesHeading[pathname]).toBe("Core Log")
    })
})
