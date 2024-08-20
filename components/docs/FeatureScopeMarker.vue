<template>
    <div class="mb-3">
        <p class="fw-bold d-flex gap-2 flex-wrap" v-if="page?.editions?.length || page?.version">Available on:
            <span v-bind:v-if="edition" v-for="edition in page?.editions" class="badge d-flex align-items-center" :class="`bg-${editionInfo(edition).color}`">{{ editionInfo(edition).label }}</span>
            <span v-if="page?.version" class="badge d-flex align-items-center bg-body-tertiary">{{ page.version }}</span>
        </p>
    </div>
    <div class="mb-3" v-if="page?.deprecated">
        <p class="fw-bold d-flex gap-2 flex-wrap">Deprecated since:
            <span v-if="page?.deprecated.since" class="badge d-flex align-items-center bg-body-tertiary">{{ page?.deprecated.since }}</span>
            <NuxtLink v-if="page?.deprecated.migrationGuide" class="badge d-flex align-items-center bg-secondary text-white" :href="page?.deprecated.migrationGuide">
                Migration Guide
            </NuxtLink>
        </p>
    </div>
    <div class="mb-3" v-if="page?.release">
        <p class="fw-bold d-flex gap-2 flex-wrap">Release:
            <span class="badge d-flex align-items-center bg-body-tertiary">{{ page?.release }}</span>
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
                    OSS: {label: "Open Source Edition", color: "primary"},
                    EE: {label: "Enterprise Edition", color: "secondary"},
                    CLOUD_TEAM: {label: "Cloud Team plan", color: "success"},
                    CLOUD_PRO: {label: "Cloud Pro plan", color: "info"},
                }
            }
        },
        props: {
            page: {
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