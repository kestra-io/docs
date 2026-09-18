<template>
    <div class="features-grid" :class="`grid-surface-${surface}`">
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
                <component
                    :is="headingLevel"
                    class="feature-title"
                    data-usal="fade-r"
                >
                    {{ item.description }}
                </component>
            </template>
            <template v-else>
                <component
                    :is="headingLevel"
                    class="feature-title"
                    data-usal="fade-r"
                >
                    {{ item.title }}
                </component>
                <small
                    class="feature-desc"
                    data-usal="fade-l delay-20"
                >
                    {{ item.description }}
                </small>
            </template>
            <Link
                v-if="item.link"
                class="feature-link"
                :href="item.link.href"
                :text="item.link.text"
                :target="item.link.external ? '_blank' : undefined"
                :rel="item.link.external ? 'noopener' : undefined"
            />
        </div>
        <slot />
    </div>
</template>

<script setup lang="ts">
    import type { Component } from 'vue'
    import Link from '~/components/common/Link.vue'

    export interface NoGapGridItem {
        icon: Component;
        title: string;
        description: string | number;
        link?: {
            text: string;
            href: string;
            external?: boolean;
        };
    }

    withDefaults(
        defineProps<{
            items: NoGapGridItem[];
            inverted?: boolean;
            /**
             * `inverse` paints the grid with the *-inverse tokens (dark in the light theme); `primary` follows the page surface.
             * Emitted as `grid-surface-*`: the bare `surface-inverse` class is a global section marker in app.scss that
             * re-points `.btn-secondary` tokens, and consumers pass secondary buttons into the slot.
             */
            surface?: 'inverse' | 'primary';
            headingLevel?: 'h3' | 'h6';
        }>(),
        { surface: 'inverse', headingLevel: 'h6' },
    )
</script>

<style lang="scss" scoped>
    .features-grid {
        --grid-border: var(--ks-border-secondary-inverse);
        --grid-shadow: var(--ks-shadows-light-inverse);
        --grid-cell-background: transparent;
        --grid-icon: var(--ks-content-color-highlight-inverse);
        --grid-title: var(--ks-content-primary-inverse);
        --grid-desc: var(--ks-content-secondary-inverse);

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border: 1px solid var(--grid-border);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 2px 3px 16px 0 var(--grid-shadow);

        &.grid-surface-primary {
            --grid-border: var(--ks-border-secondary);
            --grid-shadow: var(--ks-shadows-light);
            --grid-cell-background: var(--ks-background-primary);
            --grid-icon: var(--ks-content-color-highlight);
            --grid-title: var(--ks-content-primary);
            --grid-desc: var(--ks-content-secondary);

            gap: 1px;
            background: var(--grid-border);

            .feature-card {
                box-shadow: none;
            }
        }

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
            background: var(--grid-cell-background);
            box-shadow: 1px 1px 0 0 var(--grid-border);

            @include media-breakpoint-down(lg) {
                padding: 2rem;
            }

            @include media-breakpoint-down(md) {
                width: 100%;
            }

            .feature-icon {
                font-size: 1.5rem;
                color: var(--grid-icon);
                align-self: start;
                width: 1.5rem;
                height: 1.5rem;
                margin-bottom: 4px;
            }

            .feature-title {
                color: var(--grid-title);
                margin: 0;
            }

            .feature-desc {
                color: var(--grid-desc);
                font-size: $font-size-sm;
                margin: 0;
            }

            .feature-link {
                margin-top: auto;
                padding-top: 8px;
                color: var(--grid-icon);
                font-size: $font-size-sm;
            }
        }
    }
</style>
