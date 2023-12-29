<template>
    <Topology
        class="topology-root"
        :flow-graph="flowGraph"
        :id="id"
        :source="source"
        :icons="icons"
        :enable-subflow-interaction="false"
    />
</template>

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
            icons: {
                type: Object,
                default: undefined
            }
        }
    }
</script>

<style scoped lang="scss">
    .topology-root {
        width: 100%;
        height: 400px;
    }
</style>