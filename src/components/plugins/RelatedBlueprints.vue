<template>
    <div v-if="relatedBlueprints?.length > 0" class="more">
        <div class="header">
            <h4 :id="headerID">{{ headerText }}</h4>
            <NavActions
                :items="relatedBlueprints"
                :page-size="currentPageSize"
                :show="relatedBlueprints.length > currentPageSize"
                @page-changed="startIndex = $event"
            />
        </div>
        <div class="row g-3">
            <div
                v-for="blueprint in visibleBlueprints"
                :key="blueprint.id"
                class="col-md-4 col-lg-6 col-xl-6 col-xxl-4"
            >
                <LayoutBlueprintCard :blueprint="blueprint" :href="`/blueprints/${blueprint.id}`" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from "vue"
    import type { Plugin } from "@kestra-io/ui-libs"
    import { useMediaQuery } from "@vueuse/core"
    import { getBlueprintsHeading } from "~/utils/pluginUtils"
    import NavActions from "~/components/common/NavActions.vue"
    import LayoutBlueprintCard from "~/components/layout/BlueprintCard.vue"

    const props = defineProps<{
        pluginName: string
        pluginWrapper?: Plugin
        subGroupName?: string
        pluginType?: string
        customId?: string | null
        currentSubgroupPlugin?: Plugin
        relatedBlueprints: Blueprint[]
    }>()

    const createWithBlueprints = computed(() =>
        getBlueprintsHeading(
            props.pluginName,
            props.pluginWrapper,
            props.subGroupName,
            props.pluginType,
            props.customId,
        ),
    )

    const headerText = computed(() => createWithBlueprints.value.text)
    const headerID = computed(() => createWithBlueprints.value.id)

    const isTwoPerRowScreen = useMediaQuery("(min-width: 992px) and (max-width: 1399px)")

    const currentPageSize = computed(() => (isTwoPerRowScreen.value ? 4 : 3))

    const startIndex = ref(0)

    const visibleBlueprints = computed<Array<Blueprint>>(() => {
        return props.relatedBlueprints.slice(
            startIndex.value,
            startIndex.value + currentPageSize.value,
        )
    })
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .more {
        border-top: 1px solid var(--kestra-io-token-color-border-secondary);
        padding: 2rem 0;

        @include media-breakpoint-up(lg) {
            margin: 0 -2rem;
            padding: 2rem;
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
                line-height: normal;
            }
        }
    }
</style>