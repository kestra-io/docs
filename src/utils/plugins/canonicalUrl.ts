import {
    isEntryAPluginElementPredicate,
    subGroupName,
    type Plugin,
    type PluginElement,
} from "~/utils/plugins/plugin"
import { slugify } from "~/utils/slugify"

export type PluginUrlIndex = {
    /** Fully-qualified class name -> canonical pathname of its page. */
    clsToUrl: Record<string, string>
    /**
     * Plugin names exposing more than one subgroup. Only those carry a subgroup
     * segment in their URLs.
     */
    multiSubGroupPlugins: Set<string>
}

const isEePath = (path: string) => path.startsWith("/plugins/plugin-ee-")

/**
 * Canonical path of a plugin page: the plugin root, or the subgroup page when the
 * plugin exposes more than one subgroup.
 *
 * `/plugins/[...slug].astro` drops the subgroup segment with a 301 when a plugin has a
 * single subgroup, so a URL built with that segment always redirects. Anything building
 * a plugin URL has to apply the same rule to point straight at the canonical page.
 */
export const canonicalPluginPath = (
    plugin: Plugin,
    index: Pick<PluginUrlIndex, "multiSubGroupPlugins">,
): string | undefined => {
    if (!plugin.name) return undefined

    const carriesSubGroup =
        Boolean(plugin.subGroup) && index.multiSubGroupPlugins.has(plugin.name)

    return carriesSubGroup
        ? `/plugins/${plugin.name}/${slugify(subGroupName(plugin))}`
        : `/plugins/${plugin.name}`
}

/** Canonical pathname for a plugin element, or undefined for an unknown class. */
export const canonicalPluginUrl = (
    cls: string,
    index: Pick<PluginUrlIndex, "clsToUrl">,
): string | undefined => index.clsToUrl[cls]

/** Build the class -> canonical URL index from the `/plugins/subgroups` payload. */
export const buildPluginUrlIndex = (plugins: Plugin[]): PluginUrlIndex => {
    const subGroupsByPlugin: Record<string, Set<string>> = {}
    for (const plugin of plugins ?? []) {
        if (!plugin.name || !plugin.subGroup) continue
        subGroupsByPlugin[plugin.name] ??= new Set()
        subGroupsByPlugin[plugin.name].add(plugin.subGroup)
    }

    const multiSubGroupPlugins = new Set(
        Object.keys(subGroupsByPlugin).filter(
            (name) => subGroupsByPlugin[name].size > 1,
        ),
    )

    const clsToUrl: Record<string, string> = {}
    const rankByCls: Record<string, number> = {}

    for (const plugin of plugins ?? []) {
        const base = canonicalPluginPath(plugin, { multiSubGroupPlugins })
        if (!base) continue

        // The same class can be declared by several entries, and the winner decides its URL:
        //  - OSS over EE, because a class can be exposed by two plugins
        //    (io.kestra.plugin.git.TenantSync sits in both plugin-git and plugin-ee-git) and the
        //    OSS page is the canonical one. This outranks everything else.
        //  - a subgroup-scoped entry over the plugin root entry, which repeats every element its
        //    subgroups declare without saying which subgroup they belong to.
        const rank = (isEePath(base) ? 0 : 4) + (plugin.subGroup ? 2 : 0)

        for (const [key, value] of Object.entries(plugin)) {
            if (!isEntryAPluginElementPredicate(key, value)) continue

            for (const element of value as PluginElement[]) {
                if (element.deprecated || !element.cls) continue

                if (element.cls in rankByCls && rankByCls[element.cls] >= rank) continue

                clsToUrl[element.cls] = `${base}/${element.cls.toLowerCase()}`
                rankByCls[element.cls] = rank
            }
        }
    }

    return { clsToUrl, multiSubGroupPlugins }
}
