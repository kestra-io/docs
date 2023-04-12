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
                        :items="navigation[0].children"
                        :depth-level="1"
                        :active-slug="activeSlug"
                        :open="true" />
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
    import {fetchContentNavigation, useAsyncData} from "#imports";
    import {hash} from "ohash";

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
        },
        async setup(props) {
            const queryBuilder = queryContent('/' + props.type + '/');

            const {data: navigation} = await useAsyncData(
                `NavSideBar-${hash(props.type)}`,
                () => fetchContentNavigation(queryBuilder)
            );

            return {navigation};
        },
        computed: {
            activeSlug() {
                return this.$route.path
            },
        },
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .bd-sidebar {
        @include media-breakpoint-up(lg) {
            position: sticky;
            top: 5rem;
            display: block !important;
            height: subtract(100vh, 6rem);
            padding-left: .25rem;
            margin-left: -.25rem;
            overflow-y: auto;
            overflow-x: hidden;
            padding-right: calc($spacer / 4);
        }


        button.btn {
            border: 1px solid var(--bs-gray-300);
            font-weight: bold;
            width: 100%;
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