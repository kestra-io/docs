<template>
    <nav class="bd-sidebar scroller">
        <div class="mb-4">
            <button
                class="btn d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#plugins-menu"
                aria-expanded="false"
                aria-controls="tocContents"
            >
                <Menu /> Documentation Menu
            </button>
            <div
                class="collapse bd-menu-collapse"
                id="plugins-menu"
            >
                <nav
                    class="bd-links w-100"
                    id="bd-plugins-nav"
                    aria-label="Plugins navigation"
                >
                    <RecursivePluginsSidebar
                        :parent-slug="'/' + type"
                        :items="navigation.children"
                        :depth-level="1"
                        :active-slug="activeSlug"
                        :open="true"
                        :page-list="pageList"/>
                </nav>
            </div>
        </div>
    </nav>
</template>

<script setup>
    import Menu from "vue-material-design-icons/Menu.vue"
    import RecursivePluginsSidebar from "~/components/plugins/RecursivePluginsSidebar.vue";

    const props = defineProps({
        pageList: Array,
        type: String,
    });

    console.log('PageList: ', props.pageList);

    const route = useRoute();
    const activeSlug = computed(() => route.path);

    const navigation = computed(() => ({
        title: 'Plugins',
        _path: '/plugins',
        children: props.pageList
    }));

    // console.log('Navigation: ', navigation.value);
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