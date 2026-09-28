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
})
