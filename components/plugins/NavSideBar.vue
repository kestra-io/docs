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
                        parent-slug="/plugins"
                        :depth-level="1"
                        :open="true"
                        :active-slug="activeSlug"
                        :menu-list="menuList"
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
    import {hash} from "ohash";

    export default defineComponent({
        components: {
            RecursiveNavSidebar,
            ChevronDown,
            ChevronUp,
            Menu
        },
        props: {
            plugins: {
                type: Array,
                required: true,
            },
        },
        data: () => ({
            showMenu: [],
        }),
        async setup(props) {
            const subMenuItemNames = ['tasks', 'triggers', 'conditions', 'controllers', 'storages', 'secrets', 'guides']

            const getSubPageList = (page, subMenuItem) => {
                return buildSubMenuHierarchy(subMenuItem, page);
            };
            const buildSubMenuHierarchy = (subMenuItemName, page) =>{
                const hierarchy = {};
                page[subMenuItemName].forEach(item => {
                    const words = item.split('.');
                    let menuName = words[words.length - 1];

                    let currentLevel = hierarchy;
                    currentLevel[menuName] = currentLevel[menuName] || {};
                    currentLevel = currentLevel[menuName];
                    currentLevel['name'] = menuName;
                    currentLevel['url'] = item;

                });
                return convertHierarchyToArray(page.name, subMenuItemName, hierarchy);
            };
            const convertHierarchyToArray = (pageName, subMenuItemName, hierarchy) => {
                return Object.entries(hierarchy).map(([key, value]) => {
                    return {
                        title: key,
                        isChildMenu: true,
                        item: value['url'],
                        url: value['name'] ? `/plugins/${pageName}/${subMenuItemName}/${value['url']}` : '',
                        subMenu: value['name'] ? null : convertHierarchyToArray(value),
                    }
                });
            };

            const menuList = props.plugins.map(page => {
                let subMenu = subMenuItemNames.map(subMenuItemName => {
                    if (page[subMenuItemName].length > 0) {
                        return {
                            title: subMenuItemName,
                            isSubMenu: true,
                            url: `/plugins/${page.name}/${subMenuItemName}`,
                            subMenu: getSubPageList(page, subMenuItemName)
                        }
                    }
                });
                return {
                    title: page.title,
                    url: '/plugins' + '/' + page.name,
                    isParent: true,
                    subMenu: subMenu
                }
            });
            return { menuList };
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