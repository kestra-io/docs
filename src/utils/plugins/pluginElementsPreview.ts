import type { PluginUrlIndex } from "~/utils/plugins/canonicalUrl"
import {
    isEntryAPluginElementPredicate,
    type Plugin,
} from "~/utils/plugins/plugin"
import { formatElementType } from "~/utils/plugins/pluginUtils"

const PREVIEW_ITEMS = 5

export type ElementPreview = {
    type: string
    total: number
    items: { title?: string; cls: string; href?: string }[]
}

type ElementWithTitle = { cls: string; title?: string; deprecated?: boolean }

export function pluginElementsPreview(
    plugin: Plugin,
    index: Pick<PluginUrlIndex, "clsToUrl">,
): ElementPreview[] {
    return Object.entries(plugin)
        .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
        .map(([key, value]) => {
            const elements = (value as ElementWithTitle[]).filter(
                (el) => !el.deprecated,
            )
            return {
                type:
                    key === "additionalPlugins"
                        ? "Tasks"
                        : formatElementType(key),
                total: elements.length,
                items: elements.slice(0, PREVIEW_ITEMS).map((el) => ({
                    title: el.title?.replaceAll("`", ""),
                    cls: el.cls,
                    href: index.clsToUrl[el.cls],
                })),
            }
        })
        .filter((group) => group.total > 0)
}
