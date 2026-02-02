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

    const emit = defineEmits<{
        openSearch: []
    }>()

    function openSearch(): void {
        emit("openSearch")
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .header {
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;

            span {
                color: $white;
                font-weight: 700;
            }
        }

        .actions {
            display: flex;
            align-items: center;
            gap: 1rem;

            .search-btn {
                background: #252526;
                border: none;
                color: $white-3;
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
                    outline: none;
                }
                .magnify-icon {
                    font-size: 20px;
                    color: $white-3;
                    margin-top: -4px;
                }
            }

            .esc {
                color: $black-10;
                font-size: 9px;
                text-transform: uppercase;
            }
        }
    }

    @include media-breakpoint-down(md) {
        .header {
            padding: 0.875rem 1rem;

            .brand {
                gap: 0.5rem;
            }
        }
    }

    @include media-breakpoint-down(sm) {
        .header .actions .esc {
            display: none;
        }
    }
</style>