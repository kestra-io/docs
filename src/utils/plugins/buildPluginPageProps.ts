import {
    filterPluginsWithoutDeprecated,
    isEntryAPluginElementPredicate,
    slugify,
    subGroupName,
    type Plugin,
    type PluginMetadata,
} from "@kestra-io/ui-libs"

import {
    formatElementName,
    formatElementType,
    getBlueprintsHeading,
    getPluginTitle,
} from "~/utils/plugins/pluginUtils"
import { prunePluginsForSidebar } from "./pruneForClient"
import type { PluginPage, PluginPageWithToc, TocLink } from "./types"

const TOC_DEPTH = 2

interface BuildPluginPagePropsInput {
    pluginName: string
    subGroup: string | undefined
    pluginType: string | undefined
    pathname: string

    pageNames: Record<string, string>
    allPlugins: Plugin[]
    allPluginMetadata: PluginMetadata[]

    blueprintCounts: Record<string, number>
    relatedBlogs: any[]

    page: PluginPage | null
    sidebarPluginData: PluginPage | null
}

export function buildPluginPageProps(input: BuildPluginPagePropsInput) {
    const {
        pluginName,
        subGroup,
        pluginType,
        pathname,
        pageNames,
        allPlugins,
        allPluginMetadata,
        blueprintCounts,
        relatedBlogs,
        page,
        sidebarPluginData,
    } = input

    const subgroups = allPlugins.filter((r) => r.name === pluginName)

    const pluginsWithoutDeprecated: Plugin[] = filterPluginsWithoutDeprecated(
        pluginType ? (sidebarPluginData?.body?.plugins ?? []) : (page?.body?.plugins ?? []),
    )

    const subGroupPlugins = pluginsWithoutDeprecated.filter((p) => p.subGroup !== undefined)
    const effectiveSubGroup = subGroup
        ?? (subGroupPlugins.length === 1 ? slugify(subGroupName(subGroupPlugins[0])) : undefined)

    const subGroupWrapper = pluginsWithoutDeprecated.find(
        (p) => slugify(subGroupName(p)) === effectiveSubGroup,
    )

    const currentPageIcon = `/icons/${pluginType ?? subGroupWrapper?.subGroup ?? page?.body.group}.svg`

    const subGroupsIcons = page?.body?.plugins
        ? Object.fromEntries(
              page.body.plugins.map((p) => [
                  p.subGroup ?? p.group,
                  `/icons/${p.subGroup ?? p.group}.svg`,
              ]),
          )
        : {}

    const rootPlugin = pluginsWithoutDeprecated.find((p) => p.subGroup === undefined)

    const currentSubgroupPlugin =
        !effectiveSubGroup || pluginType
            ? undefined
            : pluginsWithoutDeprecated.find((p) => {
                  const subgroupLastSegment = p.subGroup?.split(".").pop()
                  const possibleSubgroupMatches = [
                      slugify(subGroupName(p)),
                      subgroupLastSegment,
                      slugify(subgroupLastSegment ?? ""),
                  ]
                  return possibleSubgroupMatches.includes(effectiveSubGroup)
              })

    const currentPluginMetadata = (() => {
        const subgroupId = currentSubgroupPlugin?.subGroup ?? currentSubgroupPlugin?.group
        const rootGroupId = rootPlugin?.group ?? pluginName

        if (subgroupId) {
            const found = allPluginMetadata?.find((m) => m.group === subgroupId)
            return found ? [found] : []
        }

        if (rootGroupId) {
            return (
                allPluginMetadata?.filter(
                    (m) =>
                        m.group &&
                        (m.group === rootGroupId || m.group.startsWith(rootGroupId + ".")),
                ) ?? []
            )
        }

        return []
    })()

    const metadataMap: Record<string, PluginMetadata> = Object.fromEntries(
        currentPluginMetadata.map((m) => [m.group, m]),
    )

    const currentPageMetadata = (() => {
        if (!currentPluginMetadata.length) return null
        const rootGroup = rootPlugin?.group
        const subgroupGroup = currentSubgroupPlugin?.subGroup ?? currentSubgroupPlugin?.group
        return (
            currentPluginMetadata.find(
                (m) => m.group === rootGroup || m.group === subgroupGroup,
            ) ?? null
        )
    })()

    const headingTitle = pluginType
        ? formatElementName(pluginType)
        : ((rootPlugin
              ? getPluginTitle(currentSubgroupPlugin ?? rootPlugin, metadataMap)
              : undefined) ?? pluginName)

    const rootPluginTitle = rootPlugin
        ? getPluginTitle(rootPlugin, metadataMap)
        : pluginName

    let combinedDescription = currentPageMetadata?.description
    const bodyText = (currentPageMetadata as any)?.body
    if (bodyText && bodyText !== combinedDescription) {
        combinedDescription += (combinedDescription ? "\n\n" : "") + bodyText
    }

    const headingDescription = pluginType
        ? page?.title
        : (combinedDescription ??
          (effectiveSubGroup === undefined
              ? (rootPlugin?.longDescription ?? combinedDescription)
              : (currentSubgroupPlugin?.longDescription ?? combinedDescription)))

    const pageNamesHeading = {
        ...pageNames,
        [pathname]: headingTitle,
        [`/plugins/${pluginName}`]: getPluginTitle(rootPlugin!, metadataMap) ?? pluginName,
    }

    const tocEntry = (id: string, text: string): TocLink => ({ id, depth: TOC_DEPTH, text })

    const generateTocForPluginElements = (wrapper: Plugin): TocLink[] =>
        Object.entries(wrapper)
            .filter(([key]) => isEntryAPluginElementPredicate(key, wrapper[key as keyof Plugin]))
            .map(([key]) => ({
                id: `section-${slugify(key.replace(/[A-Z]/g, (m) => ` ${m}`))}`,
                depth: TOC_DEPTH,
                text: formatElementType(key),
            }))

    const currentPluginVideos = (() => {
        if (!currentPluginMetadata.length) return []
        const subgroupId = currentSubgroupPlugin?.subGroup ?? currentSubgroupPlugin?.group
        const rootGroup = rootPlugin?.group

        return currentPluginMetadata
            .filter((m) => {
                if (subgroupId)
                    return (
                        typeof m.group === "string" &&
                        (m.group === subgroupId || m.group.startsWith(subgroupId + "."))
                    )
                if (m.name === pluginName) return true
                return (
                    typeof m.group === "string" &&
                    (m.group === rootGroup || m.group?.startsWith(rootGroup ?? ""))
                )
            })
            .flatMap((m) => m?.videos ?? [])
            .filter(Boolean)
    })()

    const blueprintsSectionHeading = getBlueprintsHeading(pluginName, rootPlugin, effectiveSubGroup)

    const currentPluginCategories = (() => {
        const subgroupCats = currentSubgroupPlugin?.categories
        const pluginCats = rootPlugin?.categories
        return effectiveSubGroup === undefined
            ? (pluginCats ?? [])
            : subgroupCats?.length
              ? subgroupCats
              : (pluginCats ?? [])
    })()

    const subgroupBlueprintCounts = (() => {
        const result: Record<string, number> = {}
        pluginsWithoutDeprecated.forEach((sw) => {
            if (sw.subGroup !== undefined) {
                const key = `${sw.group ?? sw.name}-${slugify(subGroupName(sw))}`
                result[key] = blueprintCounts?.[sw.subGroup] ?? 0
            }
        })
        return result
    })()

    const makeTOC = (): TocLink[] => {
        const pluginToc = (() => {
            if (!rootPlugin) return []
            if (effectiveSubGroup && currentSubgroupPlugin)
                return generateTocForPluginElements(currentSubgroupPlugin)
            if (!effectiveSubGroup && !pluginType) {
                const subGroups = pluginsWithoutDeprecated.filter((p) => p.subGroup)
                return subGroups.length
                    ? subGroups.map((sub) =>
                          tocEntry(slugify(subGroupName(sub)), subGroupName(sub)),
                      )
                    : generateTocForPluginElements(rootPlugin)
            }
            return []
        })()

        const baseTocLinks = pluginType
            ? (page?.body.toc?.links?.map((l) => ({ ...l, children: undefined })) ?? [])
            : page?.body?.toc
              ? []
              : pluginToc

        const hasBlueprints = pluginType
            ? blueprintCounts?.[pluginType] > 0
            : effectiveSubGroup
              ? subgroupBlueprintCounts?.[`${rootPlugin?.group ?? pluginName}-${effectiveSubGroup}`] > 0
              : blueprintCounts?.[rootPlugin?.group ?? pluginName] > 0

        const isRootView = pluginType === undefined

        return [
            ...baseTocLinks,
            ...(isRootView && rootPlugin?.longDescription
                ? [tocEntry("how-to-use-this-plugin", "How to use this plugin")]
                : []),
            ...(isRootView && currentPluginVideos?.length > 0
                ? [tocEntry("see-it-in-action", "See it in action")]
                : []),
            ...(pluginType == undefined &&
            hasBlueprints &&
            blueprintsSectionHeading?.id &&
            blueprintsSectionHeading?.text
                ? [tocEntry(blueprintsSectionHeading.id, blueprintsSectionHeading.text)]
                : []),
            ...(isRootView && effectiveSubGroup === undefined && relatedBlogs.length > 0
                ? [tocEntry("latest-blog-posts", "Latest Blog Posts")]
                : []),
            ...(currentPluginCategories?.length > 0
                ? [tocEntry("more-plugins-in-this-category", "More Plugins in this Category")]
                : []),
        ]
    }

    const pageWithToc: PluginPageWithToc = page
        ? { ...page, body: { ...page.body, toc: { links: makeTOC() } } }
        : { body: { toc: { links: [] } } }

    const elementTitle = Object.fromEntries(
        pluginsWithoutDeprecated.flatMap((p) =>
            (Object.entries(p) as [string, { title?: string; cls: string }[]][])
                .filter(([k, v]) => isEntryAPluginElementPredicate(k, v))
                .flatMap(([, els]) =>
                    els.filter((el) => el?.title).map((el) => [el.cls, { title: el.title }]),
                ),
        ),
    )

    const ogImage = effectiveSubGroup
        ? `/meta/plugins/group-${subgroups.find((r) => slugify(r.title) === effectiveSubGroup)?.subGroup}.svg`
        : `/meta/plugins/${pluginType ?? pluginName}.svg`

    const prunedRootPlugin = rootPlugin ? prunePluginsForSidebar([rootPlugin])[0] : undefined
    const prunedPluginsWithoutDeprecated = prunePluginsForSidebar(pluginsWithoutDeprecated)

    return {
        headingTitle,
        headingDescription,
        ogImage,

        pageNamesHeading,
        currentPageIcon,

        prunedRootPlugin,
        prunedPluginsWithoutDeprecated,
        pageWithToc,
        currentPluginMetadata,
        currentPluginCategories,
        sidebarPluginDataResult: sidebarPluginData,

        effectiveSubGroup,
        pluginsWithoutDeprecated,
        rootPlugin,
        rootPluginTitle,
        currentSubgroupPlugin,
        subGroupWrapper,
        metadataMap,
        subGroupsIcons,
        currentPluginVideos,
        blueprintsSectionHeading,
        subgroupBlueprintCounts,
        elementTitle,
    }
}

