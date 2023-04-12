<template>
    <div class="text-end mt-3 mb-3">
        <NuxtLink class="btn btn-outline-primary" :href="href">
            <ChevronRight />
            <slot />
        </NuxtLink>
    </div>
</template>

<script setup>
    import ChevronRight from 'vue-material-design-icons/ChevronRight'
</script>

<script>
    export default {
        props: {
            href: {
                type: String,
                required: true
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    div {
        :deep(p) {
            display: inline;
            margin-bottom: 0 !important;
        }
    }


</style>