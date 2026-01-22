import { type Plugin, type PluginMetadata } from "@kestra-io/ui-libs"
import { groupBySubpackage, hasMultipleSubPackages } from "./all"
import { nuxtBlocksFromSubGroupsWrappers } from "./nuxtBlocks"

export function generateSidebarPluginData(subgroups: Plugin[], allMetadata: PluginMetadata[]) {
    const rootPlugin = subgroups?.find((sg) => sg.subGroup === undefined)
    if (rootPlugin && subgroups.length === 1 && hasMultipleSubPackages(rootPlugin)) {
        if (!rootPlugin.categories) {
            rootPlugin.categories = []
        }

        subgroups = [rootPlugin, ...groupBySubpackage(rootPlugin, allMetadata)]
    }

    return nuxtBlocksFromSubGroupsWrappers(subgroups ?? [])
}