<template>
    <div class="features-grid">
        <div
            v-for="(item, index) in items"
            :key="index"
            class="feature-card"
        >
            <component
                :is="item.icon"
                class="feature-icon"
                data-usal="zoomin"
            />
            <template v-if="inverted">
                <small
                    class="feature-desc"
                    data-usal="fade-l delay-20"
                >
                    {{ item.title }}
                </small>
                <h6
                    class="feature-title"
                    data-usal="fade-r"
                >
                    {{ item.description }}
                </h6>
            </template>
            <template v-else>
                <h6
                    class="feature-title"
                    data-usal="fade-r"
                >
                    {{ item.title }}
                </h6>
                <small
                    class="feature-desc"
                    data-usal="fade-l delay-20"
                >
                    {{ item.description }}
                </small>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Component } from 'vue'

    export interface NoGapGridItem {
        icon: Component;
        title: string;
        description: string | number;
    }

    defineProps<{
        items: NoGapGridItem[];
        inverted?: boolean;
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border: 1px solid var(--ks-border-secondary-inverse);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 2px 3px 16px 0 var(--ks-shadows-light-inverse);

        @include media-breakpoint-down(lg) {
            grid-template-columns: repeat(2, 1fr);
        }

        @include media-breakpoint-down(md) {
            grid-template-columns: 1fr;
        }

        .feature-card {
            width: 100%;
            padding: 2rem 4rem;
            display: flex;
            flex-direction: column;
            gap: 8px;
            box-shadow: 1px 1px 0 0 var(--ks-border-secondary-inverse);

            @include media-breakpoint-down(lg) {
                padding: 2rem;
            }

            @include media-breakpoint-down(md) {
                width: 100%;
            }

            .feature-icon {
                font-size: 1.5rem;
                color: var(--ks-content-color-highlight-inverse);
                align-self: start;
                width: 1.5rem;
                height: 1.5rem;
            }

            .feature-title {
                color: var(--ks-content-primary-inverse);
                margin: 0;
            }

            .feature-desc {
                color: var(--ks-content-secondary-inverse);
                font-size: $font-size-sm;
                margin: 0;
            }
        }
    }
</style>
