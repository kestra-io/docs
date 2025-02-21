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
            font-size: $font-size-md !important;
            font-weight: 500;
            margin-top: 2rem;
            margin-bottom: .75rem;
            @include media-breakpoint-up(md) {
                margin-top: 0;
                margin-bottom: 0;
            }
        }

        :deep(p){
            font-size: $font-size-xs;
            line-height: 1.5em;
            margin: .5rem 0;
            @include media-breakpoint-up(md) {
                font-size: $font-size-sm;
                margin: 1rem 0;
            }
        }

        .kestra-logo {
            display: none;
            @include media-breakpoint-up(md) {
                display: block;
            }
            float: right;
            width: 132px;
            margin: 3rem;
            margin-top: 0;
        }
    }
</style>