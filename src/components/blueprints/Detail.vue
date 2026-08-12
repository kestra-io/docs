<template>
    <div class="card">
        <div class="card-body">
            <Topology :flow-graph="graph" :source="flow" :id="page.id" />
        </div>
    </div>
</template>

<script setup lang="ts">
    // This island is client:only because the vue-flow topology can't SSR.
    // The flow snippet and the description markdown used to live here too;
    // they now render as their own server-rendered islands (BlueprintSnippet
    // and BlueprintMarkdown), and the two-column layout is static markup in
    // pages/blueprints/[id].astro.
    import Topology from "~/components/blueprints/Topology.client.vue"

    defineProps<{
        page: {
            id: string | number;
            title: string;
        }
        flow: string
        graph?: any
    }>()
</script>

<style lang="scss" scoped>
    .card {
        flex: 1;
        border-radius: 8px;
        border: $block-border;
        overflow: clip;

        .card-body {
            height: 100%;
            padding: 0;
            background-color: var(--ks-background-secondary);
            display: flex;
            flex-direction: column;

            & > * {
                flex: 1;
            }
        }
    }
</style>
