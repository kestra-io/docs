<template>
    <div ref="container" class="container-fluid bg-dark-4">
        <div class="container">
            <div class="mb-5">
                <h1 data-usal="fade-l" class="title text-center card-title fw-light">
                    Connect Your <span>Entire Stack</span> <br />
                    with Dedicated Plugins
                </h1>
                <Plugins />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Plugins from "~/components/layout/Plugins.vue"
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .plugins {
        max-width: $container-max-width;
    }

    .title {
        font-size: $font-size-3xl;
        font-weight: 400;

        span {
            background: var(--Text_gradient, linear-gradient(90deg, #e151f7 2%, #5c47f5 65%));
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .btn-dark {
        --bs-btn-bg: $black-4;
        --bs-btn-hover-bg: $black-4;
        border: 1px solid $black-6;
    }

    .container-fluid {
        color: var(--bs-white);
        padding: 0;

        .container {
            padding: 4rem 0;
            border-bottom: $block-border;
            border-top: $block-border;
        }
    }
</style>