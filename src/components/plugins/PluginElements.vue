<template>
    <div class="subgroup-content" :class="wrapperClass">
        <div v-if="showLine" class="vertical-line">
            <div
                v-for="(element, index) in flatElements"
                :key="element.cls"
                class="line-segment"
                :class="{
                    active: isElementActive(element),
                    hovered: hoveredIndex === index,
                }"
            ></div>
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
                    @mouseleave="hoveredIndex = -1"
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
    import { subGroupName, slugify, type PluginElement, type Plugin } from "@kestra-io/ui-libs"
    import { formatElementName } from "~/utils/pluginUtils"
    import { computed, ref } from "vue"

    const { groupedElements, pluginName, subGroup, wrapperClass, showLine, routeParts } =
        defineProps<{
            groupedElements: Record<string, PluginElement[]>
            pluginName: string
            subGroup?: Plugin
            wrapperClass?: string
            showLine?: boolean
            routeParts: string[]
        }>()

    const getElementHref = (element: PluginElement) => {
        const base = `/plugins/${pluginName}`
        return subGroup
            ? `${base}/${slugify(subGroupName(subGroup))}/${element.cls}`
            : `${base}/${element.cls}`
    }

    const isElementActive = (element: PluginElement) => {
        const parts = routeParts ?? []
        return subGroup
            ? parts.length >= 3 &&
                  slugify(subGroupName(subGroup)) === parts[1] &&
                  slugify(element.cls) === parts[2]
            : parts.length >= 2 && slugify(element.cls) === parts[1]
    }

    const flatElements = computed(() => Object.values(groupedElements).flat())

    const hoveredIndex = ref(-1)
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .subgroup-content {
        position: relative;
        padding-left: 10px;
        display: flex;
        flex-direction: column;

        .vertical-line {
            position: absolute;
            left: 17px;
            top: 0;
            bottom: 0;
            width: 1px;
            background: var(--kestra-io-token-color-border-secondary);
            display: flex;
            flex-direction: column;

            .line-segment {
                flex: 1;
                background: $purple-36;
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
            padding-left: var(--spacer, 1rem);

            .element-list {
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;

                li {
                    a {
                        display: block;
                        padding: calc(var(--spacer, 1rem) / 4);
                        font-size: $font-size-sm;
                        color: $white-1;
                        text-decoration: none;
                        border-left: 2px solid transparent;
                        transition: color 0.2s ease;

                        &:hover,
                        &.active {
                            color: $purple-36;
                        }

                        &.active {
                            font-weight: 500;
                        }
                    }
                }
            }
        }
    }
</style>