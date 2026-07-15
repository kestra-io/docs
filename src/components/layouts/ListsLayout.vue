<template>
    <section class="lists">
        <div class="container-xxl">
            <aside class="sidebar" v-if="showSidebar">
                <h6 class="sidebar-title">Categories</h6>
                <div class="list">
                    <label class="item" :for="`${idPrefix}-all`">
                        <input
                            class="input"
                            type="radio"
                            :id="`${idPrefix}-all`"
                            name="category"
                            :checked="modelValue === ''"
                            @change="$emit('update:modelValue', '')"
                        />
                        <span class="label">All categories</span>
                    </label>
                    <label
                        v-for="cat in categories"
                        :key="cat.id"
                        class="item"
                        :for="`${idPrefix}-${cat.id}`"
                    >
                        <input
                            class="input"
                            type="radio"
                            :id="`${idPrefix}-${cat.id}`"
                            name="category"
                            :checked="modelValue === cat.id"
                            @change="$emit('update:modelValue', cat.id)"
                        />
                        <span class="label">{{ cat.label }}</span>
                    </label>
                </div>
            </aside>

            <div class="content">
                <div class="top-bar" v-if="$slots['top-bar']">
                    <slot name="top-bar" />
                </div>
                <slot />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    export interface CategoryItem {
        id: string
        label: string
    }

    withDefaults(
        defineProps<{
            categories: CategoryItem[]
            modelValue: string
            idPrefix?: string
            showSidebar?: boolean
        }>(),
        { idPrefix: "cat", showSidebar: true },
    )

    defineEmits<{
        "update:modelValue": [value: string]
    }>()
</script>

<style lang="scss" scoped>
    section.lists {
        padding: 1.875rem 0.75rem;
        border-bottom: 1px solid var(--ks-border-secondary);

        @include media-breakpoint-down(lg) {
            padding-inline: 1rem;
        }

        .container-xxl {
            display: flex;
            gap: 2rem;
            position: relative;
            min-height: inherit;

            @include media-breakpoint-down(lg) {
                flex-direction: column;
            }
        }

        .sidebar {
            min-width: 209px;
            position: sticky;
            top: calc(4.5rem + var(--announce-height));
            z-index: 10;
            height: fit-content;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;

            @include media-breakpoint-down(lg) {
                position: static;
                width: 100%;
                overflow: visible;
                min-width: unset;
                padding: 0;
            }

            &-title {
                margin-bottom: 0.25rem;
                font-weight: 700;
                font-size: $font-size-sm;
                color: var(--ks-content-primary);

                @include media-breakpoint-down(lg) {
                    display: none;
                }
            }

            .list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;

                @include media-breakpoint-down(lg) {
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }
            }

            .item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                cursor: pointer;

                @include media-breakpoint-down(lg) {
                    gap: 0;
                }

                .input {
                    position: relative;
                    flex-shrink: 0;
                    width: 1.25rem;
                    height: 1.25rem;
                    margin: 0;
                    border: 2px solid var(--ks-border-secondary);
                    border-radius: 50%;
                    appearance: none;
                    cursor: pointer;
                    transition: border-color 0.2s;

                    &:checked {
                        border-color: var(--ks-content-link);

                        &::after {
                            content: "";
                            position: absolute;
                            inset: 0.1875rem;
                            background: var(--ks-content-link);
                            border-radius: 50%;
                        }
                    }

                    @include media-breakpoint-down(lg) {
                        display: none;
                    }
                }

                .label {
                    margin: 0;
                    font-size: $font-size-sm;
                    line-height: normal;
                    color: var(--ks-content-primary);
                    cursor: pointer;

                    @include media-breakpoint-down(lg) {
                        padding: 0.25rem 1rem;
                        border: 1px solid var(--ks-border-secondary);
                        border-radius: 2rem;
                        white-space: nowrap;
                        background: var(--ks-background-secondary);
                        transition: all 0.2s ease;

                        &:hover {
                            border-color: var(--ks-content-link);
                        }
                    }
                }

                .input:checked + .label {
                    @include media-breakpoint-down(lg) {
                        border-color: var(--ks-border-active);
                        background: var(--ks-background-tag-category);
                        color: var(--ks-content-tag-category);
                        font-weight: 600;
                    }
                }
            }
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2rem;

            @include media-breakpoint-down(lg) {
                display: contents;
            }

            .top-bar {
                display: flex;
                flex-direction: column;
                padding: 4rem 2.625rem;
                background: url("~/components/blueprints/assets/bar-bg.webp")
                    center / cover no-repeat;
                border-radius: $border-radius-lg;
                color: $white;

                @include media-breakpoint-down(lg) {
                    padding: 2rem 1.5rem;
                    order: -1;
                }

                :deep(h1),
                :deep(h2) {
                    margin-bottom: 0.5rem;
                }

                :deep(p) {
                    margin-bottom: 2rem;
                    color: var(--ks-content-tertiary);
                }
            }
        }
    }
</style>