<template>
    <div>
        <Topology :flow-graph="flowGraph" :id="id" :source="source" />
    </div>
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
            }
        }
    }
</script>

<style scoped lang="scss">
</style>