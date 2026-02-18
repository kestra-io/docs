<template>
    <aside class="bd-sidebar scroller">
        <div>
            <button
                ref="menuToggleBtn"
                class="btn d-lg-none mt-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#docs-menu"
                aria-expanded="false"
                aria-controls="tocContents"
            >
                <Menu /> Documentation Menu
            </button>
            <div class="ai-button-wrapper mb-2">
                <button
                    class="ai-button"
                    title="Ask Kestra AI"
                    data-bs-toggle="modal"
                    data-bs-target="#search-ai-modal"
                >
                    <img v-bind="KSAIImg" alt="Kestra AI" width="30" height="30" />
                    Ask Kestra AI
                </button>
            </div>
            <div
                class="search"
                data-bs-toggle="modal"
                data-bs-target="#search-modal"
                title="Search"
            >
                <div class="input-group">
                    <div class="input-icon">
                        <span class="input-group-text">
                            <Magnify />
                        </span>
                        <p>Search</p>
                    </div>
                    <div class="align-items-center d-flex input-group-append">
                        <Keyboard />
                        <span class="command">Ctrl + K</span>
                    </div>
                </div>
            </div>
            <div class="collapse bd-menu-collapse" id="docs-menu">
                <nav class="bd-links w-100" id="bd-docs-nav" aria-label="Docs navigation">
                    <ul class="list-unstyled mb-0">
                        <RecursiveNavSidebar
                            v-for="item in items"
                            :key="item.path"
                            :parent-slug="'/' + type"
                            :type="type"
                            :item="item"
                            :depth-level="0"
                            :disabled-pages="disabledPages"
                        />
                    </ul>
                </nav>
            </div>
        </div>
    </aside>
</template>

<script lang="ts" setup>
    import { computed, onMounted, provide, ref, type PropType } from "vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import Keyboard from "vue-material-design-icons/Keyboard.vue"
    import Menu from "vue-material-design-icons/Menu.vue"
    import RecursiveNavSidebar, {
        closeSidebarInjectionKey,
        type NavigationItem,
    } from "~/components/docs/RecursiveNavSidebar.vue"
    import KSAIImg from "./assets/ks-ai.svg"
    import { activeSlug } from "~/utils/store"

    const props = defineProps({
        type: {
            type: String,
            required: true,
        },
        navigation: {
            type: Object as PropType<{ children: NavigationItem[] }[]>,
        },
        slug: {
            type: String,
        },
    })

    onMounted(() => {
        activeSlug.value = props.slug || ""
    })

    const disabledPages = [
        "/docs/terraform/data-sources",
        "/docs/terraform/guides",
        "/docs/terraform/resources",
    ]

    const menuToggleBtn = ref<HTMLButtonElement | null>(null)

    const closeSidebar = () => {
        if (
            window.innerWidth < 992 &&
            menuToggleBtn.value &&
            menuToggleBtn.value.getAttribute("aria-expanded") === "true"
        ) {
            menuToggleBtn.value.click()
        }
    }

    provide(closeSidebarInjectionKey, closeSidebar)

    const items = computed(() => props.navigation?.[0]?.children ?? [])
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .bd-sidebar {
        &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: var(--ks-border-primary);
        }
        @include media-breakpoint-up(lg) {
            margin-top: 4rem;
            position: sticky;
            top: 8rem;
            display: block !important;
            height: fit-content;
            max-height: subtract(100vh, 9rem);
            padding-left: 0.25rem;
            margin-left: -0.25rem;
            overflow-y: auto;
            overflow-x: hidden;
            padding-right: calc($spacer / 4);
            min-width: 250px;
        }
        button.btn {
            border: 1px solid var(--bs-gray-300);
            font-weight: bold;
            width: 100%;
            color: var(--ks-content-primary);
            @include media-breakpoint-down(lg) {
                background-color: var(--ks-background-primary);
                font-size: $font-size-sm;
                border-radius: 0.5rem;
                border: $block-border;
                :deep(.material-design-icon__svg) {
                    path {
                        color: var(--ks-content-primary);
                    }
                }
            }
        }
        .bd-menu-collapse {
            @include media-breakpoint-down(lg) {
                nav {
                    padding: calc($spacer / 2) $spacer;
                    border: $block-border;
                    box-shadow: $box-shadow-sm;
                    @include border-radius(var(--bs-border-radius));
                }
            }
            @include media-breakpoint-up(lg) {
                display: block !important; // stylelint-disable-line declaration-no-important
            }
        }
        .search,
        .ai-button-wrapper {
            min-width: 209px;
            width: 98%;
            height: 32px;
            @include media-breakpoint-down(lg) {
                width: 100%;
                margin-top: $spacer;
            }
        }
        .ai-button-wrapper {
            .ai-button {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 12px;
                padding-left: 0;
                min-width: 0;
            }
        }
        .search {
            padding: calc($spacer * 0.3) calc($spacer * 0.8);
            gap: 8px;
            border-radius: calc($spacer * 0.25);
            background-color: var(--ks-background-secondary);
            border: $block-border;
            margin-bottom: $spacer;
            cursor: pointer;
            &:hover {
                border: $block-border;
            }
            :deep(.material-design-icon__svg) {
                bottom: 0;
                fill: #8b8b8d;
            }
            .input-group {
                width: 100%;
                height: 100%;
                display: flex;
                gap: calc($spacer * 0.5);
                align-items: center;
                justify-content: space-between;
                .input-icon {
                    max-height: 100%;
                    display: flex;
                    gap: calc($spacer * 0.5);
                    align-items: center;
                    color: var(--ks-content-primary);
                }
                @include media-breakpoint-down(lg) {
                    justify-content: space-between;
                    gap: calc($spacer * 2);
                }
                p {
                    color: var(--ks-content-primary);
                    font-size: $font-size-sm;
                    font-weight: 400;
                    margin: 0;
                }
                .input-group-text {
                    max-height: 100%;
                    background-color: transparent;
                    border: none;
                    padding: 0;
                    color: var(--ks-content-primary);
                }
            }
            .input-group-append {
                display: flex;
                align-items: center;
                gap: calc($spacer * 0.25);
                .command {
                    color: var(--ks-content-tertiary);
                    font-size: calc($font-size-base * 0.62);
                }
            }
        }
    }
</style>