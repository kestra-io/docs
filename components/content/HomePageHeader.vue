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
        h2 {
            padding-top: 0;
            font-size: $font-size-xl;
            font-weight: 600;
        }

        :deep(p){
            font-size: $font-size-sm;
            line-height: 1.5em;
        }

        .kestra-logo {
            float: right;
            width: 132px;
            margin: 3rem;
            margin-top: 0;
        }
    }
</style>