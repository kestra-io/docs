import { isEntryAPluginElementPredicate, type Plugin, type PluginElement } from "@kestra-io/ui-libs"

function isFullEntryAPluginElementPredicate(
    elementsArray: [elementType: string, elements: any],
): elementsArray is [key: string, el: PluginElement[]] {
    return isEntryAPluginElementPredicate(...elementsArray)
}

export function getListOfPlugins(inputPlugins: Plugin[]): Plugin[] {
    return inputPlugins
        .map((plugin) => {
            const filteredPluginElementsEntries = Object.entries(plugin)
                .filter(isFullEntryAPluginElementPredicate)
                .map(([elementType, elements]): [string, PluginElement[]] => [
                    elementType,
                    elements.filter(({ deprecated }) => !deprecated),
                ])
                .filter(([, elements]) => elements.length > 0)

            if (filteredPluginElementsEntries.length === 0) {
                return undefined
            }

            return {
                ...plugin,
                ...Object.fromEntries(filteredPluginElementsEntries),
            } as Plugin
        })
        .filter((plugin): plugin is Plugin => plugin !== undefined)
}

export function getPluginsWithoutDeprecated(plugins: Plugin[]): PluginElement[] {
    return plugins.flatMap((p) => {
        let filteredElementsEntries = Object.entries(p)
            .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
            .map(([elementType, elements]) => [
                elementType,
                (elements as PluginElement[]).filter(({ deprecated }) => !deprecated),
            ])
            .filter(([, elements]) => elements.length > 0)

        if (filteredElementsEntries.length === 0) {
            return []
        }

        return [
            {
                ...p,
                ...Object.fromEntries(filteredElementsEntries),
            },
        ]
    })
}