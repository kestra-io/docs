<template>
    <div class="mb-3">
        <p class="fw-bold d-flex gap-2 flex-wrap">Available on:
            <span v-for="edition in editions" class="badge d-flex align-items-center" :class="`bg-${editionInfo(edition).color}`">{{ editionInfo(edition).label }}</span>
            <span v-if="version" class="badge d-flex align-items-center bg-body-tertiary">{{ version }}</span>
        </p>
    </div>
    <div class="mb-3" v-if="deprecated">
        <p class="fw-bold d-flex gap-2 flex-wrap">Deprecated since:
            <NuxtLink v-if="deprecated.migrationGuide" class="badge d-flex align-items-center bg-secondary text-white" :href="deprecated.migrationGuide">
                Migration Guide
            </NuxtLink>
            <span v-if="deprecated.since" class="badge d-flex align-items-center bg-body-tertiary">{{ deprecated.since }}</span>
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
            },
            deprecated: {
              type: Object,
              default: undefined
            },
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