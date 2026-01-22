<template>
    <div class="header-container">
        <div class="header container d-flex flex-column align-items-center gap-3">
            <slot>
                <h1 data-usal="fade-l">Join our <span>Team</span></h1>
                <h4 data-usal="fade-r">
                    Drive innovation in a globally distributed, collaborative environment
                </h4>
                <a
                    :href="(fullPath === '/careers' ? '' : '/careers') + '#positions'"
                    class="btn btn-animated btn-purple-animated"
                    data-usal="zoomin"
                >
                    Open positions
                </a>
            </slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .header-container {
        margin-top: $rem-6;
        background: url("~/assets/dotted-bg.svg") no-repeat top;
        .header {
            padding-bottom: calc($spacer * 4.125);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);

            :deep(h1),
            :deep(h4) {
                color: $white;
                text-align: center;
                font-weight: 400;
                margin-bottom: 0;
            }

            :deep(h1) {
                font-size: $font-size-4xl;

                @include media-breakpoint-down(sm) {
                    font-size: 1.875rem !important;
                }

                span {
                    background: linear-gradient(90deg, #e151f7 58.97%, #5c47f5 85.36%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            :deep(h4) {
                font-size: $font-size-xl;

                @include media-breakpoint-down(sm) {
                    font-size: $h6-font-size !important;
                }
            }
        }
    }
</style>

<script setup lang="ts">
    defineProps<{
        fullPath: string
    }>()
</script>