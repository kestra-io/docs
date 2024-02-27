<template>
    <aside class="bd-sidebar scroller">
        <div class="mb-4">
            <button
                class="btn d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#docs-menu"
                aria-expanded="false"
                aria-controls="tocContents"
            >
                <Menu /> Documentation Menu
            </button>
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

<script>
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import Menu from "vue-material-design-icons/Menu.vue"
    import RecursiveNavSidebar from "./RecursiveNavSidebar.vue";

    export default defineComponent({
        components: {
            RecursiveNavSidebar,
            ChevronDown,
            ChevronUp,
            Menu
        },
        props: {
            type: {
                type: String,
                required: true
            },
            navigation: {
                type: Object,
            },
        },
        data() {
          return {
              disabledPages: [
                  '/docs/terraform/data-sources',
                  '/docs/terraform/guides',
                  '/docs/terraform/resources'
              ]
          }
        },
        computed: {
            activeSlug() {
                return this.$route.path
            },
            items() {
                return this.navigation?.[0]?.children ?? []
            }
        },
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .bd-sidebar {
        &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: darkgray;
        }

        @include media-breakpoint-up(lg) {
            position: sticky;
            top: 7rem;
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
                font-size: $font-size-sm
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
    }
</style>
