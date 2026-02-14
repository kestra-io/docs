<script setup lang="ts">
    import ListCard from "~/components/blueprints/ListCard.vue"
    defineProps<{
        relatedBlueprints: Blueprint[]
        tags: BlueprintTag[]
    }>()
    function generateCardHref(blueprint: { id: number | string }) {
        return `/blueprints/${blueprint.id}`
    }
</script>

<template>
    <section>
        <div class="container">
            <h2 class="text-center mb-4">More related <span class="highlight">blueprints</span></h2>
            <div class="row">
                <div
                    class="col-lg-4 col-md-6 mb-4"
                    v-for="blueprint in relatedBlueprints"
                    data-usal="zoomin"
                :key="blueprint.id"
            >
                <ListCard
                    :blueprint="blueprint"
                    :tags="tags"
                    :href="generateCardHref(blueprint)"
                />
            </div>
        </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    section {
        padding: $rem-3 0;
    }
</style>