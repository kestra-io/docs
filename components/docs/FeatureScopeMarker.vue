<template>
    <div class="mb-3">
        <p class="fw-bold d-flex gap-2 flex-wrap">Available on:
            <span v-for="edition in editions" class="badge d-flex align-items-center" :class="`bg-${editionInfo(edition).color}`">{{ editionInfo(edition).label }}</span>
            <span v-if="version" class="badge d-flex align-items-center bg-body-tertiary">{{ version }}</span>
        </p>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        data() {
            return {
                editionLabelAndColorByPrefix: {
                    OSS: {label: "Open-Source Edition", color: "primary"},
                    EE: {label: "Enterprise Edition", color: "secondary"},
                    CLOUD_TEAM: {label: "Cloud Team plan", color: "success"},
                    CLOUD_PRO: {label: "Cloud Pro plan", color: "info"},
                }
            }
        },
        props: {
            editions: {
                type: Array,
                default: []
            },
            version: {
                type: String,
                default: undefined
            }
        },
        methods: {
            editionInfo(edition) {
                return this.editionLabelAndColorByPrefix?.[edition] ?? {
                    label: edition,
                    color: "dark-3"
                }
            }
        }
    }
</script>