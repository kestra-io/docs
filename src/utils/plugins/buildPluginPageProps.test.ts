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
})
