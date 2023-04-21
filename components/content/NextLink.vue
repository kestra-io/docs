<template>
    <div class="text-end mt-3 mb-3">
        <div class="btn btn-outline-primary">
            <ChevronRight />
            <slot />
        </div>
    </div>
</template>

<script setup>
    import ChevronRight from 'vue-material-design-icons/ChevronRight'
</script>

<script>
    export default {

    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    div {
        &:hover {
            :deep(a), :deep(a:hover) {
                color: var(--bs-white) !important;
            }
        }

        :deep(p) {
            display: inline;
            margin-bottom: 0 !important;
        }
    }


</style>