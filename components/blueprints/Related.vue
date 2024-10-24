<script>
    export default {
        props: {
            relatedBlueprints: {
                type: Array,
                default: []
            },
            tags: {
                type: Array,
                default: []
            }
        },
        methods: {
          generateCardHref (blueprint) {
            return `/blueprints/${blueprint.id}`
          }
        },
    }
</script>

<template>
    <LayoutSection subtitle="More Related" subtitle-after="Blueprints">
        <div class="row">
            <div class="col-lg-4 col-md-6 mb-4" v-for="blueprint in relatedBlueprints" data-aos="zoom-in" :key="blueprint.id">
                <BlueprintsListCard :blueprint="blueprint"  :tags="tags" :href="generateCardHref(blueprint)"/>
            </div>
        </div>
    </LayoutSection>
</template>