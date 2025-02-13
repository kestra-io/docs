<template>
    <aside class="bd-sidebar scroller">
        <div class="mb-4">
            <button
                class="btn d-lg-none mt-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#docs-menu"
                aria-expanded="false"
                aria-controls="tocContents"
            >
                <Menu /> Documentation Menu
            </button>
            <div class="search" data-bs-toggle="modal" data-bs-target="#search-modal" title="Search">
                <div class="input-group">
                    <div class="input-icon">
                        <span class="input-group-text"><Magnify/></span>
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
                    <RecursiveNavSidebar
                        :parent-slug="'/' + type"
                        :type="type"
                        :items="items"
                        :depth-level="1"
                        :active-slug="activeSlug"
                        :disabled-pages="disabledPages"
                        :open="true"
                    />
                </nav>
            </div>
        </div>

    </aside>

</template>

<script setup>
  import Magnify from "vue-material-design-icons/Magnify.vue"
  import Keyboard from "vue-material-design-icons/Keyboard.vue"
  import Menu from "vue-material-design-icons/Menu.vue"
  import RecursiveNavSidebar from "./RecursiveNavSidebar.vue";
  const props = defineProps({
        type: {
            type: String,
            required: true
        },
        navigation: {
            type: Object,
        },
    })

    const disabledPages = [
        '/docs/terraform/data-sources',
        '/docs/terraform/guides',
        '/docs/terraform/resources'
    ]

    const route = useRoute()

    console.log("navigation", toRaw(props.navigation)[0].children)

    const activeSlug = computed(() => route.path)
    const items = computed(() => props.navigation?.[0]?.children ?? [])
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .bd-sidebar {
        &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: $black-9;
        }

        @include media-breakpoint-up(lg) {
            margin-top: 4rem;
            position: sticky;
            top: 8rem;
            display: block !important;
            height: fit-content;
            max-height: subtract(100vh, 9rem);
            padding-left: .25rem;
            margin-left: -.25rem;
            overflow-y: auto;
            overflow-x: hidden;
            padding-right: calc($spacer / 4);
            min-width: 250px;
        }


        button.btn {
            border: 1px solid var(--bs-gray-300);
            font-weight: bold;
            width: 100%;
            color: $white;
            @include media-breakpoint-down(lg) {
                background-color: $black-3;
                font-size: $font-size-sm;
                border-radius: 0.5rem;
                border: 1px solid $black-6;

                :deep(.material-design-icon__svg) {
                    path {
                        color: $white;
                    }
                }
            }
        }

        .bd-menu-collapse {
            @include media-breakpoint-down(lg) {
                nav {
                    padding: calc($spacer / 2) $spacer;
                    border: 1px solid var(--bs-border-color);
                    box-shadow: $box-shadow-sm;
                    @include border-radius(var(--bs-border-radius));
                }
            }

            @include media-breakpoint-up(lg) {
                display: block !important; // stylelint-disable-line declaration-no-important
            }
        }

        .search {
            width: 209px;
            height: 32px;
            padding: calc($spacer * 0.3) calc($spacer * 0.8);
            gap: 8px;
            border-radius: calc($spacer * 0.25);
            background-color: $black-2;
            border: 1px solid $black-3;
            margin-bottom: $spacer;
            cursor: pointer;

            &:hover {
                background-color: $black-4;
                border: 1px solid $black-6;
            }

            @include media-breakpoint-down(lg) {
                width: 100%;
                margin-top: $spacer;
            }

            :deep(.material-design-icon__svg) {
                bottom: 0;
                fill: #8B8B8D;
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
                    color: $white;
                }

                @include media-breakpoint-down(lg) {
                    justify-content: space-between;
                    gap: calc($spacer * 2);
                }

                p {
                    color: $white;
                    font-size: $font-size-sm;
                    font-weight: 400;
                    margin: 0;
                }

                .input-group-text {
                    max-height: 100%;
                    background-color: transparent;
                    border: none;
                    padding: 0;
                    color: $white;
                }
            }

            .input-group-append {
                display: flex;
                align-items: center;
                gap: calc($spacer * 0.25);

                .command {
                    color: $black-8;
                    font-family: $font-family-sans-serif;
                    font-size: calc($font-size-base * 0.62);
                }
            }


        }
    }
</style>
