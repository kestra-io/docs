<template>
    <div class="home-page-header">
        <h2>{{ title }}</h2>
        <slot></slot>
    </div>
</template>

<script setup>
    const props = defineProps({
        title: {
            type: String,
            default: ''
        }
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .home-page-header {
        font-size: $font-size-xl;
        line-height: 1.375rem;
    }
</style>