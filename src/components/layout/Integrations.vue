<template>
    <div ref="container" class="container-fluid ">
        <div class="container">
            <div class="mb-5">
                <h2 class="title">
                    Integrate with {{ totalPlugins }} plugins you already <span>know</span> and
                    <span>love</span>
                </h2>
                <LayoutPlugins />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { usePluginsCount } from "~/composables/usePluginsCount"

    const { totalPlugins } = usePluginsCount()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        color: $white;
        padding: 0;
        .container {
            padding: 4rem 0;
            border-bottom: $block-border;
            border-top: $block-border;
        }
        .title {
            margin: 0;
            color: $white;
            text-align: center;
            font-size: calc($font-size-base * 3.125);
            font-weight: 400;
            line-height: 4rem;
            padding: 0 20%;
            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
                line-height: 2.563rem;
            }
            @include media-breakpoint-down(lg) {
                padding: 0;
            }
            span {
                background: linear-gradient(91deg, #e151f7 43.87%, #5c47f5 55.51%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
        .row {
            div:nth-child(2) {
                @include media-breakpoint-up(lg) {
                    padding: calc($spacer * 4) calc($spacer * 4) 0;
                }
                h2 {
                    margin-bottom: calc($spacer * 2);
                    background: linear-gradient(90.03deg, #e151f7 2.16%, #5c47f5 65.09%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                }
                p {
                    font-size: $font-size-lg;
                }
            }
        }
    }
</style>