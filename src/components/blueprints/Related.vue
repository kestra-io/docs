<script setup lang="ts">
    import LayoutSection from "~/components/layout/Section.vue"
    import BlueprintsListCard from "~/components/blueprints/ListCard.vue"
    defineProps<{
        relatedBlueprints: Array<{
            id: string
            title: string
            description: string
            tags: { id: string; name: string }[]
        }>
        tags: { id: string; name: string }[]
    }>()
    function generateCardHref(blueprint: { id: string }) {
        return `/blueprints/${blueprint.id}`
    }
</script>

<template>
    <LayoutSection subtitle="More Related" subtitle-after="Blueprints">
        <div class="row">
            <div
                class="col-lg-4 col-md-6 mb-4"
                v-for="blueprint in relatedBlueprints"
                data-usal="zoomin"
                :key="blueprint.id"
            >
                <BlueprintsListCard
                    :blueprint="blueprint"
                    :tags="tags"
                    :href="generateCardHref(blueprint)"
                />
            </div>
        </div>
    </LayoutSection>
</template>