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
        }
    }
</script>

<template>
    <LayoutSection title="More Related Blueprints">
        <div class="row">
            <div class="col-lg-4 col-md-6 mb-4" v-for="blueprint in relatedBlueprints" data-aos="zoom-in" :key="blueprint.id">
                <BlueprintsListCard :blueprint="blueprint"  :tags="tags"/>
            </div>
        </div>
    </LayoutSection>
</template>