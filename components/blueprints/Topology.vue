<template>
    <div>
        <topology :flow-graph="{}" id="todo" source="id:todo" />
    </div>
</template>

<script>
    import {Topology} from '@kestra-io/ui-libs'

    export default {
        components: {Topology},
    }
</script>

<style scoped lang="scss">
</style>