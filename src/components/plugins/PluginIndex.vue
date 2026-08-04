<template>
    <div class="d-flex flex-column gap-4">
        <!-- Root plugin page with subgroups -->
        <template v-if="subGroup === undefined && plugins.length > 1">
            <div class="pb-2">
                <div class="row g-4 last">
                    <div
                        class="col-md-6"
                        v-for="subGroupWrapper in subGroupsWrappers"
                        :key="subGroupName(subGroupWrapper)"
                    >
                        <SubgroupCard
                            :id="slugify(subGroupName(subGroupWrapper))"
                            :icon-src="icons[subGroupWrapper.subGroup] ?? icons[subGroupWrapper.group]"
                            :text="getSubgroupTitle(subGroupWrapper)"
                            :description="getSubgroupDescription(subGroupWrapper)"
                            :href="`${routePath}/${slugify(subGroupName(subGroupWrapper))}`"
                            :route-path="routePath"
                            :plugin-group="subGroupWrapper.group ?? subGroupWrapper.name"
                            :total-count="getTotalElementCount(subGroupWrapper)"
                            :blueprints-count="props.subgroupBlueprintCounts?.[`${slugify(subGroupWrapper.group ?? subGroupWrapper.name)}-${slugify(subGroupName(subGroupWrapper))}`] ?? 0"
                            :is-active="activeId?.toLowerCase() === slugify(subGroupName(subGroupWrapper))"
                            class="text-capitalize h-100"
                            @navigate="emit('navigate', $event)"
                        />
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="plugin">
            <div class="d-flex flex-column elements-section pb-3" v-for="(elements, elementType) in elementsByType" :key="elementType">
                <h2 :id="`section-${slugify(elementType)}`" class="text-capitalize">
                    {{ elementType === 'additional Plugins' ? 'Tasks' : elementType }}
                </h2>
                <div class="row g-4 last">
                    <div class="col-md-6" v-for="element in elements" :key="element">
                        <ElementCard
                            :id="slugify(element)"
                            :text="elementName(element)"
                            :plugin-class="element"
                            :href="elementHref(element)"
                            :route-path="routePath"
                            :title="schemas?.[element]?.title"
                            class="h-100"
                            @navigate="emit('navigate', $event)"
                        >
                            <template #markdown="{content}">
                                <slot name="markdown" :content="content" />
                            </template>
                        </ElementCard>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="showLongDescription && description !== undefined && plugin?.longDescription">
            <div id="how-to-use-this-plugin" class="description">
                <div ref="contentWrap" class="markdown-container" :class="{expanded: isExpanded}">
                    <div ref="contentInner" class="markdown-inner">
                        <slot name="markdown" :content="description.replace(/ *:(?![ /])/g, ': ')" />
                    </div>
                    <div v-if="isOverflow && !isExpanded" class="gradient-overlay" />
                </div>
                <div v-if="isOverflow || isExpanded" class="more-wrap text-center">
                    <button class="more-btn" @click="toggleExpand">
                        {{ isExpanded ? "See less" : "See more" }}
                        <component :is="isExpanded ? ChevronUp : ChevronDown" />
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
    import {computed, ref} from "vue";
    import {useElementSize} from "@vueuse/core";
    import {slugify} from "../../utils/slugify";
    import type {Plugin, PluginMetadata} from "../../utils/plugins/plugin";
    import {subGroupName, extractPluginElements} from "../../utils/plugins/plugin";
    import {usePluginElementCounts} from "../../composables/usePluginElementCounts";

    import ElementCard from "./ElementCard.vue";
    import SubgroupCard from "./SubgroupCard.vue";
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";

    const props = defineProps<{
        plugins: Plugin[],
        pluginName: string,
        routePath: string
        icons: Record<string, string>
        subGroup?: string | undefined,
        activeId?: string | undefined
        subgroupBlueprintCounts?: Record<string, number>,
        metadataMap?: Record<string, PluginMetadata>,
        schemas?: Record<string, { title?: string }>,
        showLongDescription?: boolean
    }>();

    const getSubgroupMetadata = (subGroupWrapper: Plugin) => {
        return props.metadataMap?.[subGroupWrapper.subGroup ?? subGroupWrapper.group];
    };

    const getSubgroupDescription = (subGroupWrapper: Plugin) => {
        return getSubgroupMetadata(subGroupWrapper)?.description ?? subGroupWrapper.description;
    };

    const getSubgroupTitle = (subGroupWrapper: Plugin) => {
        return getSubgroupMetadata(subGroupWrapper)?.title ?? subGroupWrapper.title ?? subGroupName(subGroupWrapper);
    };

    const plugin = computed(() => props.plugins.find(p => props.subGroup === undefined ? true : (slugify(subGroupName(p)) === props.subGroup)));

    const description = computed(() => {
        return plugin.value?.longDescription ?? plugin.value?.description
    });

    const subGroupsWrappers = computed(() => {
        return props.plugins
            .filter(p => p.name.toLowerCase() === props.pluginName.toLowerCase() && p.subGroup !== undefined) as (Plugin & {subGroup:string})[];
    });

    const elementName = (qualifiedName: string) => {
        let split = qualifiedName.split(".");
        return split?.[split.length - 1];
    }

    const elementHref = (element: string) => `${props.routePath}/${element.toLowerCase()}`;

    function getTotalElementCount(plugin: Plugin): number {
        const elements = extractPluginElements(plugin);
        return Object.values(elements).reduce((sum, arr) => sum + arr.length, 0);
    }

    const {elementsByType} = usePluginElementCounts(plugin);

    const contentWrap = ref<HTMLElement | null>(null);
    const contentInner = ref<HTMLElement | null>(null);
    const isExpanded = ref(false);

    const {height: wrapHeight} = useElementSize(contentWrap);
    const {height: innerHeight} = useElementSize(contentInner);

    const isOverflow = computed(() => innerHeight.value > wrapHeight.value + 2);

    const toggleExpand = () => {
        isExpanded.value = !isExpanded.value;
    }

    const emit = defineEmits<{
        (e: "navigate", url: string): void
    }>();
</script>

<style lang="scss" scoped>
    h2 {
        margin-top: 0;
    }

    .description {
        border-top: 1px solid var(--ks-border-primary);
        padding: 2rem 3rem;
        margin: 0 -3rem;
    }

    .row>* {
        padding-inline: 8px;
        margin-top: 1rem;
    }

    .markdown-container {
        position: relative;
        max-height: 384px;
        overflow: hidden;
        transition: max-height 250ms ease-in-out;

        &.expanded {
            max-height: none;
        }
    }

    .markdown-inner {
        color: var(--ks-content-primary);
    }

    .gradient-overlay {
        pointer-events: none;
        position: absolute;
        inset: auto 0 0;
        height: 140px;
        background: linear-gradient(transparent, rgba(10, 11, 13, 0.85));
    }

    .more-btn {
        background: rgba(10, 11, 13, 0.85);
        color: var(--ks-content-primary);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-weight: 400;
        font-family: 'Source Code Pro', monospace;

        :deep(svg) {
            font-size: 1.25rem;
        }
    }
</style>
