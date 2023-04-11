<template>
    <aside class="bd-sidebar scroller">
        <div class="offcanvas-lg offcanvas-start" tabindex="-1" id="bdSidebar"
             aria-labelledby="bdSidebarOffcanvasLabel">
            <div class="offcanvas-header border-bottom">
                <h5 class="offcanvas-title" id="bdSidebarOffcanvasLabel">Browse docs</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"
                        data-bs-target="#bdSidebar"></button>
            </div>

            <div class="offcanvas-body">
                <nav class="bd-links w-100" id="bd-docs-nav" aria-label="Docs navigation">
                    <ContentNavigation v-slot="{ navigation }" v-if="contents" :query="contents">
                        <template v-for="item in navigation[0].children">
                            <div id="accordionMenu">
                                <ul class="bd-links-nav list-unstyled mb-0">
                                    <li :class="'depth-' + depthLevel" class="bd-links-group accordion-header">
                                        <a
                                            :class="item._path === activeSlug ? 'active' : ''"
                                            class="bd-links-link d-inline-block fw-bold"
                                            :href="item._path">
                                            {{ item.title || "TODO" }}
                                        </a>
                                        <chevron-down
                                            v-if="showMenu.includes(item._path) && item.children.length > 0"
                                            @click="toggle(item._path)"
                                            class="accordion-button" data-bs-toggle="collapse"
                                            :data-bs-target="'#'+item._path"
                                            role="button"
                                        />
                                        <chevron-up
                                            v-else-if="item.children.length > 0 "
                                            @click="toggle(item._path)"
                                            class="accordion-button" data-bs-toggle="collapse"
                                            :data-bs-target="'#'+item._path"
                                            role="button"
                                        />
                                    </li>
                                    <RecursiveNavSidebar
                                        :parent-slug="item._path"
                                        v-if="item.children" :items="item.children" :depth-level="depthLevel+1"
                                        :active-slug="activeSlug"
                                        :open="showMenu.includes(item._path)"/>
                                </ul>
                            </div>
                        </template>
                    </ContentNavigation>
                </nav>
            </div>
        </div>
    </aside>

</template>

<script>
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import RecursiveNavSidebar from "./RecursiveNavSidebar.vue";

    export default {
        name: "NavSideBar",
        components: {
            RecursiveNavSidebar,
            ChevronDown,
            ChevronUp
        },
        props: {
            depthLevel: {
                type: Number,
                required: true
            }
        },
        created() {
            this.showMenu = [this.activeSlug]
        },
        data: () => ({
            showMenu: [],
        }),
        computed: {
            contents() {
                return queryContent('/docs/')
            },
            activeSlug() {
                return this.$route.path
            },
        },
        methods: {
            depth(item) {
                return item._path.split("/").length
            },
            haveArrow(item) {
                return this.items.filter(i => i._path.startsWith(item._path)).length > 1
            },
            toggle(item) {
                if (this.showMenu.includes(item)) {
                    this.showMenu = this.showMenu.filter(i => i !== item)
                } else {
                    this.showMenu.push(item)
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .bd-sidebar {
        @include media-breakpoint-up(lg) {
            position: sticky;
            top: 5rem;
            // Override collapse behaviors
            // stylelint-disable-next-line declaration-no-important
            display: block !important;
            height: subtract(100vh, 6rem);
            // Prevent focus styles to be cut off:
            padding-left: .25rem;
            margin-left: -.25rem;
            overflow-y: auto;
            overflow-x: hidden;
        }

        @include media-breakpoint-down(lg) {
            .offcanvas-lg {
                border-right-color: var(--bs-border-color);
                box-shadow: $box-shadow-lg;
            }
        }
    }

    .bd-links-heading {
        color: var(--bs-emphasis-color);
    }

    .bd-links-nav {
        @include media-breakpoint-down(lg) {
            font-size: .875rem;
        }

        li {
            @for $i from 0 through 6 {
                &.depth-#{$i} {
                    padding-left: calc(.75rem * ($i));
                }
            }
        }

        @include media-breakpoint-between(xs, lg) {
            column-count: 2;
            column-gap: 1.5rem;

            .bd-links-group {
                break-inside: avoid;
            }

            .bd-links-span-all {
                column-span: all;
            }
        }
    }

    .bd-links-group {
        display: flex;
        align-items: center;

        &:hover,
        &:focus,
        &.active {
            color: var(--bs-emphasis-color);
            text-decoration: if($link-hover-decoration == underline, none, null);
        }
    }

    .bd-links-link {
        padding: 0.4rem .5rem;
        margin-left: 1.125rem;
        color: var(--bs-body-color);
        text-decoration: if($link-decoration == none, null, none);
        font-size: 0.85rem;


        &.active {
            font-weight: 600;
        }

        &:hover {

            color: var(--bs-primary);
        }
    }

    .active {
        color: var(--bs-primary)
    }

    .scroller {
        overflow-x: hidden;
    }

    .scroller::-webkit-scrollbar {
        width: 5px;
    }

    .scroller::-webkit-scrollbar-track {
        //-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        -webkit-border-radius: 10px;
    }

    .scroller::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        background: var(--bs-primary);
    }

    .accordion-button {
        width: 16px;
    }
</style>