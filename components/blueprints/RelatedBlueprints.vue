<script>
    export default {
        props: {
            relatedBlueprints: {
                type: Array,
                default: []
            },
            icons: {
                type: Object,
                default: undefined
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
            <div class="col-lg-4 col-md-6 mb-4" v-for="blueprint in relatedBlueprints" :key="blueprint.id">
                <BlueprintsBlueprintCard :blueprint="blueprint" :icons="icons" data-aos="zoom-in"  :tags="tags"/>
            </div>
        </div>
    </LayoutSection>
</template>