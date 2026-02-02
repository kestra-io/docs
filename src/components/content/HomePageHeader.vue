<template>
    <div class="home-page-header">
        <h2>{{ title }}</h2>
        <img :src="kestraLogo.src" alt="Kestra Logo" class="kestra-logo" />
        <slot />
    </div>
</template>

<script setup>
    import kestraLogo from "../../assets/kestra-logo-big.png"

    const props = defineProps({
        title: {
            type: String,
            default: "",
        },
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .home-page-header {
        h2 {
            padding-top: 0;
            font-size: $font-size-md !important;
            font-weight: 500;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            @include media-breakpoint-up(md) {
                margin-top: 0;
                margin-bottom: 0;
            }

            &::before {
                display: none;
            }
        }

        :deep(p) {
            font-size: $font-size-xs;
            line-height: 1.5em;
            margin: 0.5rem 0;
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