<template>
    <div v-if="relatedBlueprints?.length > 0" class="more">
        <div class="header">
            <h2 :id="headerId" v-html="headerText" />

            <NavActions
                :items="relatedBlueprints"
                :page-size="PAGE_SIZE"
                :show="relatedBlueprints.length > PAGE_SIZE"
                @page-changed="startIndex = $event"
            />
        </div>

        <div class="row g-3">
            <div
                v-for="blueprint in visibleBlueprints"
                :key="blueprint.id"
                class="col-md-6"
            >
                <BlueprintCard
                    :blueprint="blueprint"
                    :href="`/blueprints/${blueprint.id}`"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import type { BlueprintPreview } from "~/utils/plugins/types"
    import NavActions from "~/components/common/NavActions.vue"
    import BlueprintCard from "./BlueprintCard.vue"

    const { relatedBlueprints, headerText, headerId } = defineProps<{
        relatedBlueprints: BlueprintPreview[]
        headerText: string
        headerId: string
    }>()

    const PAGE_SIZE = 2
    const startIndex = ref(0)

    const visibleBlueprints = computed(() =>
        relatedBlueprints.slice(
            startIndex.value,
            startIndex.value + PAGE_SIZE,
        ),
    )
</script>

<style scoped lang="scss">
    .more {
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
    }
</style>