<template>
    <div class="header">
        <div class="brand">
            <span>Ask Kestra AI</span>
        </div>

        <div class="actions">
            <button
                class="search-btn"
                title="Search Documentation"
                data-bs-toggle="modal"
                data-bs-target="#search-modal"
                @click="$emit('openSearch')"
            >
                <Magnify />
                <span>Search</span>
            </button>
            <span class="esc">ESC</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Magnify from "vue-material-design-icons/Magnify.vue"

    defineEmits<{
        openSearch: []
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .header {
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        @include media-breakpoint-down(md) {
            padding: 0.875rem 1rem;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            @include media-breakpoint-down(md) {
                gap: 0.5rem;
            }
            span {
                color: var(--ks-content-primary);
                font-weight: 700;
                font-size: $font-size-xl;
            }
        }
        .actions {
            display: flex;
            align-items: center;
            gap: 1rem;
            .search-btn {
                background: var(--ks-background-secondary);
                border: $block-border;
                color: var(--ks-content-primary);
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                cursor: pointer;
                &:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
                }
                .magnify-icon {
                    font-size: 20px;
                    color: var(--ks-content-secondary);
                    margin-top: -4px;
                }
            }
            .esc {
                color: var(--ks-content-tertiary);
                font-size: 9px;
                text-transform: uppercase;
                @include media-breakpoint-down(sm) {
                    display: none;
                }
            }
        }
    }
</style>