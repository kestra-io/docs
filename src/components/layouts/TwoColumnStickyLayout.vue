<template>
    <section class="layout-wrapper">
        <div class="container" :class="{ reverse: props.reverse }">
            <div class="left">
                <div class="content">
                    <slot name="sidebar" />
                </div>
            </div>
            <div class="right">
                <slot />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">


    const props = withDefaults(defineProps<{
        reverse?: boolean
    }>(), {
        reverse: false,
    })


</script>

<style scoped lang="scss">
    .layout-wrapper {
        padding: $rem-4 0;
        @include media-breakpoint-down(xl) {
            padding: $rem-2 $rem-1;
        }
        .container {
            display: flex;
            gap: 4rem;
            padding: 0;
            max-width: 1180px;

            &.reverse {
                flex-direction: row-reverse;
            }

            @include media-breakpoint-between(lg, xl) {
                gap: 2rem;
                padding: 0;
                :deep(.btn-primary) {
                    padding: 8px 12px;
                    font-size: 15px;
                }
            }
            @include media-breakpoint-down(lg) {
                flex-direction: column;
                gap: 0;
                align-items: center;
            }
        }
    }

    .left {
        @include media-breakpoint-up(lg) {
            min-width: 315px;
            width: 315px;
            flex: 0 0 315px;
        }
        width: 100%;
        height: fit-content;
        position: static;
        margin-bottom: 3rem;
        @media (min-width: 992px) {
            position: sticky;
            top: calc(100px + var(--announce-height));
        }

        .content {
            width: 100%;
        }


    }

    .right {
        height: fit-content;
        width: 100%;
    }
</style>

