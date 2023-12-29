<template>
    <Topology
        class="topology-root"
        :flow-graph="flowGraph"
        :id="id"
        :source="source"
        :enable-subflow-interaction="false"
        :icon-component="TaskIcon"
    />
</template>

<script setup>
    import TaskIcon from "../common/TaskIcon.vue";
</script>

<script>
    import {Topology} from '@kestra-io/ui-libs'

    export default {
        components: {Topology},
        props: {
            flowGraph: {
                type: Object,
                required: true,
                default: () => ({})
            },
            source: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
        }
    }
</script>

<style scoped lang="scss">
    .topology-root {
        width: 100%;
        height: 400px;
    }
</style>