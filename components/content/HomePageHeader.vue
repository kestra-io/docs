<template>
    <div class="home-page-header">
        <h2>{{ title }}</h2>
        <NuxtImg src="/docs/ui/kestra-logo-big.png" alt="Kestra Logo" class="kestra-logo" />
        <slot/>
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
        font-size: 11pt !important;
        h2 {
            padding-top: 0;
            font-size: $font-size-xl;
        }

        :deep(p){
            font-size: $font-size-sm;
        }

        .kestra-logo {
            float: right;
            width: 132px;
            margin: 1rem;
            margin-bottom: 3rem;
        }
    }
</style>