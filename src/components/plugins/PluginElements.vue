<template>
    <div class="subgroup-content">
        <div v-if="showLine" class="vertical-line">
            <div
                v-for="(element, index) in flatElements"
                :key="element.cls"
                class="line-segment"
                :class="{
                    active: isElementActive(element),
                    hovered: hoveredIndex === index,
                }"
            />
        </div>

        <div
            v-for="(elements, elementType) in groupedElements"
            :key="elementType"
            class="element-type"
        >
            <ul class="element-list">
                <li
                    v-for="element in elements"
                    :key="element.cls"
                    @mouseover="hoveredIndex = flatElements.indexOf(element)"
                    @mouseleave="hoveredIndex = NO_HOVER"
                >
                    <a
                        :href="getElementHref(element)"
                        :class="{ active: isElementActive(element) }"
                    >
                        {{ formatElementName(element.cls) }}
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import {
        subGroupName,
        type Plugin,
        type PluginElement,
    } from "~/utils/plugins/plugin"
    import { slugify } from "~/utils/slugify"
    import { formatElementName } from "~/utils/plugins/pluginUtils"

    const {
        groupedElements,
        pluginName,
        subGroup,
        showLine,
        routeParts = [],
    } = defineProps<{
        groupedElements: Record<string, PluginElement[]>
        pluginName: string
        subGroup?: Plugin
        showLine?: boolean
        routeParts: string[]
    }>()

    const NO_HOVER = -1
    const hoveredIndex = ref(NO_HOVER)

    const flatElements = computed(() =>
        Object.values(groupedElements).flat(),
    )

    const getElementHref = (element: PluginElement) => {
        const base = `/plugins/${pluginName}`
        const slug = element.cls.toLowerCase()
        return subGroup
            ? `${base}/${slugify(subGroupName(subGroup))}/${slug}`
            : `${base}/${slug}`
    }

    const isElementActive = (element: PluginElement) => {
        if (subGroup) {
            return (
                routeParts.length >= 3 &&
                slugify(subGroupName(subGroup)) === routeParts[1] &&
                slugify(element.cls) === routeParts[2]
            )
        }
        return routeParts.length >= 2 && slugify(element.cls) === routeParts[1]
    }
</script>

<style scoped lang="scss">
    .subgroup-content {
        position: relative;
        display: flex;
        flex-direction: column;
        margin-top: 4px;

        .vertical-line {
            position: absolute;
            left: 3px;
            top: 0;
            bottom: 0;
            width: 1px;
            background: var(--ks-border-secondary);
            display: flex;
            flex-direction: column;

            .line-segment {
                flex: 1;
                background: var(--ks-content-link);
                opacity: 0;
                transition: opacity 0.2s ease;

                &.active,
                &.hovered {
                    opacity: 1;
                }
            }
        }

        .element-type {
            display: flex;
            flex-direction: column;
            gap: calc(var(--spacer, 1rem) / 3);
            padding-left: 10px;

            .element-list {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;

                a {
                    display: block;
                    padding: calc(var(--spacer, 1rem) / 4);
                    font-size: $font-size-xs;
                    color: var(--ks-content-primary);
                    text-decoration: none;
                    border-left: 2px solid transparent;
                    transition: color 0.2s ease;

                    &:hover,
                    &.active {
                        color: var(--ks-content-link);
                    }

                    &.active {
                        font-weight: 500;
                    }
                }
            }
        }
    }
</style>