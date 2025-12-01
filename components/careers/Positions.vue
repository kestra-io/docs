<template>
    <PositionsRenderer :positions="pageData" />
</template>

<script setup>
import PositionsRenderer from './PositionsRenderer.vue';

    const {data: pageData} = await useAsyncData(
        `Career-Positions`,
        () => $fetch(`/api/careers`),
    );
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    :deep(section) {
        .baseline {
            font-size: $h6-font-size;
        }
    }

    li {
        a {
            padding: 1.313rem 2rem;
            border-radius: 0.5rem;
            border: $block-border;

            span.loc {
                font-weight: normal !important;
            }

            div:first-of-type {
                flex-grow: 1;

                span {
                    color: $white;
                    font-size: $h6-font-size;
                    font-weight: 700;
                }
            }

            div:last-of-type {
                span {
                    border-radius: 4px;
                    padding: 0.25rem 0.5rem;
                    background-color: $purple-35;
                    color: $white;
                    font-size: $font-size-sm;
                    font-weight: 700;
                }
            }
        }
    }

</style>