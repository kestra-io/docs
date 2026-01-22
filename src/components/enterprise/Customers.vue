<template>
    <div class="container-fluid pt-4 pb-4">
        <Companies class="mb-4" />
    </div>
</template>

<script>
    import Companies from "~/components/layout/Companies.vue"

    export default {
        components: { Companies },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
</style>