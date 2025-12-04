<template>
    <div v-if="relatedBlueprints?.length > 0" class="more">
        <div class="header">
            <h4 :id="headerTextId">{{ headerText }}</h4>
            <div v-if="relatedBlueprints.length > currentPageSize" class="nav-actions">
                <button class="btn-nav prev" :disabled="isFirstPage" @click="prev" aria-label="Previous blueprints">
                    <ChevronLeft />
                </button>
                <button class="btn-nav next" :disabled="isLastPage" @click="next" aria-label="Next blueprints">
                    <ChevronRight />
                </button>
            </div>
        </div>
        <div class="row g-3">
            <div v-for="blueprint in visibleBlueprints" :key="blueprint.id" class="col-md-4 col-lg-6 col-xl-6 col-xxl-4">
                <LayoutBlueprintCard :blueprint="blueprint" :tags="tags" :href="`/blueprints/${blueprint.id}`" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, watch, ref } from "vue";
    import { useMediaQuery } from "@vueuse/core";
    import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue";
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue";
    import type { Plugin } from "@kestra-io/ui-libs";

    const props = defineProps<{
        pluginName: string;
        pluginWrapper?: Plugin;
        subGroupName?: string;
        pluginType?: string;
        tags?: any[];
        size?: number;
        customId?: string | null;
    }>();

    const pluginNameFormatted = computed(() =>
        formatPluginName(props.pluginWrapper?.group ?? props.pluginWrapper?.name ?? props.pluginName)
    );

    const headerText = computed(() => {
        if (props.pluginType) {
            const elementTypeKey = Object.entries(props.pluginWrapper || {})
                .find(([_, v]) => Array.isArray(v) && v.some((el: any) => el.cls === props.pluginType))?.[0];

            const className = formatElementName(props.pluginType)?.charAt(0).toUpperCase() + formatElementName(props.pluginType)?.slice(1);
            
            const subGroup = props.subGroupName ? formatPluginName(props.subGroupName) : "";
            const prefix = subGroup ? `${subGroup} ` : "";

            return `Create automations with ${prefix} ${className} ${formatElementType(elementTypeKey ?? "Tasks")}`;
        } else if (props.subGroupName) {
            return `Create automations with ${pluginNameFormatted.value} ${formatPluginName(props.subGroupName)}`;
        } else {
            return `Create automations with ${pluginNameFormatted.value} Plugins`;
        }
    });

    const headerTextId = computed(() => {
        if (props.customId) return props.customId;

        return headerText.value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    });

    const queryKey = computed(
        () => `similar-blueprints-${props.pluginName}-${props.subGroupName ?? ""}-${props.pluginType ?? ""}`
    );

    const { data } = await useAsyncData(queryKey, () => {
        const params = new URLSearchParams();
        const pluginParam = props.pluginWrapper?.group ?? props.pluginWrapper?.name ?? props.pluginName;

        if (pluginParam) params.append("plugin", pluginParam);
        if (props.subGroupName) params.append("subgroup", props.subGroupName);
        if (props.pluginType) params.append("type", props.pluginType);
        params.append("size", String(props.size ?? 500));

        return $fetch(`/api/blueprint?${params.toString()}`);
    });

    const relatedBlueprints = computed(() => data.value?.results ?? []);

    const isTwoPerRowScreen = useMediaQuery('(min-width: 992px) and (max-width: 1399px)');

    const currentPageSize = computed(() => isTwoPerRowScreen.value ? 4 : 3);

    import {useSimplePagination} from "../../utils/pluginFormat";

    const {currentPage, total, isFirstPage, isLastPage, prev, next, visibleItems} = useSimplePagination(relatedBlueprints, currentPageSize);

    const visibleBlueprints = visibleItems;
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";

.more {
    border-top: 1px solid var(--kestra-io-token-color-border-secondary);
    padding: 2rem 0;

    @include media-breakpoint-up(lg) {
        margin: 0 -3rem;
        padding: 2rem 3rem;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h4 {
            padding: 0 !important;
            font-size: 20px;
            font-weight: 600;
            margin: 0;
            color: var(--ks-content-primary);
        }

        .nav-actions {
            display: flex;
            gap: 0.5rem;
            align-items: center;

            .btn-nav {
                width: 40px;
                height: 32px;
                border: 1px solid var(--ks-border-secondary);
                background: var(--kestra-io-neutral-gray300);
                padding: 8px 12px;
                border-radius: 4px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--ks-content-primary);
                transition: background-color 0.12s ease;

                &:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }

                :deep(svg) {
                    bottom: 0 !important;
                }
            }
        }
    }
}
</style>
