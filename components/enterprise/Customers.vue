<template>
    <div class="container-fluid pt-4 pb-4">
        <Companies />
    </div>
</template>

<script>
    import Companies from "../layout/Companies.vue";

    export default {
        components: {Companies},
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
</style>