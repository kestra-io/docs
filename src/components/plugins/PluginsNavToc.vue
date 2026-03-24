<template>
    <NavToc
        :links="tocLinks"
        :edit-link="page?.editLink"
        :extension="page?.extension"
        :stem="page?.stem"
        :version="githubVersions"
        :releases-url="githubReleasesUrl"
        :categories="currentPluginCategories"
        :metadata="currentPluginMetadata"
        capitalize
        is-plugin-page
        class="right-sidebar"
    />
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from "vue"
    import {
        isEntryAPluginElementPredicate,
        slugify,
        subGroupName,
        type Plugin,
        type PluginMetadata,
    } from "@kestra-io/ui-libs"
    import NavToc, { type TocLink } from "../docs/NavToc.vue"
    import { formatElementType } from "~/utils/pluginUtils"
    import { $fetch } from "~/utils/fetch"

    const props = defineProps<{
        page?: {
            editLink?: boolean
            extension?: string
            stem?: string
            body: {
                toc?: {
                    links: TocLink[]
                }
            }
        } | null
        pluginName: string
        rootPlugin?: Plugin
        subGroup?: string
        currentSubgroupPlugin?: Plugin
        pluginsWithoutDeprecated?: Plugin[]
        pluginType?: string
        relatedBlogs?: { data: any }[]
        blueprintCounts?: Record<string, number>
        blueprintsSectionHeading?: { id: string; text: string }
        currentPluginCategories?: string[]
        currentPluginMetadata?: PluginMetadata[]
        currentPluginVideos?: string[]
    }>()

    const isSubgroupIndex = computed(() => props.pluginType === undefined)

    const generateTocForPluginElements = (wrapper: Plugin): TocLink[] =>
        Object.entries(wrapper)
            .filter(([key]) =>
                isEntryAPluginElementPredicate(
                    key,
                    wrapper[key as keyof Plugin],
                ),
            )
            .map(([key]) => {
                const formattedElementType = key.replace(
                    /[A-Z]/g,
                    (match) => ` ${match}`,
                )
                return {
                    id: `section-${slugify(formattedElementType)}`,
                    depth: 2,
                    text: formatElementType(key),
                }
            })

    const tocLinks = computed<TocLink[]>(() => {
        if (!props.page) return []

        const pluginToc = (() => {
            if (!props.rootPlugin) return []

            if (props.subGroup && props.currentSubgroupPlugin) {
                return generateTocForPluginElements(props.currentSubgroupPlugin)
            }

            if (!props.subGroup && isSubgroupIndex.value) {
                const subGroups =
                    props.pluginsWithoutDeprecated?.filter((p) => p.subGroup) ??
                    []
                return subGroups.length
                    ? subGroups.map((sub) => ({
                          id: slugify(subGroupName(sub)),
                          depth: 2,
                          text: subGroupName(sub),
                      }))
                    : generateTocForPluginElements(props.rootPlugin)
            }

            return []
        })()

        const subgroupBlueprintCounts: Record<string, number> = {}
        props.pluginsWithoutDeprecated?.forEach((subgroupWrapper) => {
            const subgroupKey = subgroupWrapper.subGroup
            if (subgroupKey !== undefined) {
                const formattedKey = `${subgroupWrapper.group ?? subgroupWrapper.name}-${slugify(subGroupName(subgroupWrapper))}`
                subgroupBlueprintCounts[formattedKey] =
                    props.blueprintCounts?.[subgroupKey] ?? 0
            }
        })

        const baseTocLinks = isSubgroupIndex.value
            ? props.page?.body?.toc
                ? []
                : pluginToc
            : (props.page?.body.toc?.links?.map((l) => ({
                  ...l,
                  children: undefined,
              })) ?? [])

        const hasBlueprints = !isSubgroupIndex.value
            ? (props.blueprintCounts?.[props.pluginType!] ?? 0) > 0
            : props.subGroup
              ? subgroupBlueprintCounts[
                    `${props.rootPlugin?.group ?? props.pluginName}-${props.subGroup}`
                ] > 0
              : (props.blueprintCounts?.[
                    props.rootPlugin?.group ?? props.pluginName
                ] ?? 0) > 0

        return [
            ...baseTocLinks,
            ...(isSubgroupIndex.value && props.rootPlugin?.longDescription
                ? [
                      {
                          id: "how-to-use-this-plugin",
                          depth: 2,
                          text: "How to use this plugin",
                      },
                  ]
                : []),
            ...(isSubgroupIndex.value &&
            (props.currentPluginVideos?.length ?? 0) > 0
                ? [
                      {
                          id: "see-it-in-action",
                          depth: 2,
                          text: "See it in action",
                      },
                  ]
                : []),
            ...(hasBlueprints &&
            props.blueprintsSectionHeading?.id &&
            props.blueprintsSectionHeading?.text
                ? [
                      {
                          id: props.blueprintsSectionHeading.id,
                          depth: 2,
                          text: props.blueprintsSectionHeading.text,
                      },
                  ]
                : []),
            ...(isSubgroupIndex.value && (props.relatedBlogs?.length ?? 0) > 0
                ? [
                      {
                          id: "latest-blog-posts",
                          depth: 2,
                          text: "Latest Blog Posts",
                      },
                  ]
                : []),
            ...((props.currentPluginCategories?.length ?? 0) > 0
                ? [
                      {
                          id: "more-plugins-in-this-category",
                          depth: 2,
                          text: "More Plugins in this Category",
                      },
                  ]
                : []),
        ]
    })

    const githubVersions = ref<{ versions: any[] }>({ versions: [] })
    const githubReleasesUrl = ref<string | undefined>(undefined)

    onMounted(async () => {
        try {
            const { versions, releasesUrl } = await $fetch<{
                versions?: any[]
                releasesUrl?: string | null
            }>(
                `/api/plugin-versions?pluginName=${encodeURIComponent(props.pluginName)}`,
            )

            githubVersions.value = { versions: versions ?? [] }
            githubReleasesUrl.value = releasesUrl ?? undefined
        } catch (e) {
            console.error("Version fetch failed", e)
        }
    })
</script>
