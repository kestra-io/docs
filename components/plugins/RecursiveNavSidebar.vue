<template>
    <div
        :id="parentSlug.replaceAll('/', '_')"
        :data-bs-parent="'#'+parentSlug.replaceAll('/', '_')"
        class="accordion-collapse"
        :class="activeSlug.includes(parentSlug) ? 'collapse show' : 'collapse'"
    >
        <template v-for="menuItem in menuList">
            <ul class="list-unstyled mb-0" v-if="menuItem && menuItem !== undefined">
                <li :class="{['depth-' + depthLevel]: true}" >
                    <NuxtLink
                        v-if="menuItem.isChildMenu || menuItem.isParent"
                        :class="getClass(menuItem, depthLevel, false)"
                        :href="menuItem.url"
                    >
                        {{ menuItem.title }}
                    </NuxtLink>
                    <NuxtLink
                        v-else
                        :class="getClass(menuItem, depthLevel, true)"
                        class="disabled"
                        @click="toggle(menuItem.url, menuItem.isParent)" data-bs-toggle="collapse"
                        :data-bs-target="'#'+menuItem.url.replaceAll('/', '_')"
                    >
                        {{ menuItem.title }}
                    </NuxtLink>
                    <span v-if="!menuItem.isChildMenu">
                        <chevron-up
                            v-if="isShow(menuItem.url)"
                            @click="toggle(menuItem.url)"
                            class="accordion-button"
                            data-bs-toggle="collapse"
                            :data-bs-target="'#'+menuItem.url.replaceAll('/', '_')"
                            role="button"
                        />
                        <chevron-down
                            v-else
                            @click="toggle(menuItem.url)"
                            class="accordion-button"
                            data-bs-toggle="collapse"
                            :data-bs-target="'#'+menuItem.url.replaceAll('/', '_')"
                            role="button"
                        />
                    </span>
                </li>
                <RecursiveNavSidebar
                    v-if="menuItem.subMenu"
                    :depth-level="depthLevel+1"
                    :active-slug="activeSlug"
                    :open="isShow(menuItem.url)"
                    :parent-slug="menuItem.url"
                    :menu-list="menuItem.subMenu"
                />
            </ul>
        </template>
    </div>
</template>

<script>
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"

    export default {
        name: "RecursiveNavSidebar",
        components: {
            ChevronDown,
            ChevronUp
        },
        props: {
            depthLevel: {
                type: Number,
                required: true
            },
            activeSlug: {
                type: String,
                required: true
            },
            open: {
                type: Boolean,
                required: true
            },
            parentSlug: {
                type: String,
                required: true
            },
            menuList: {
                type: Array,
                required: true
            }
        },
        created() {
            this.showMenu = [this.activeSlug];
        },
        data: () => ({
            showMenu: [],
        }),
        methods: {
            filterChildren(item) {
                return [];
            },
            toggle(item) {
                if (this.showMenu.some(path => path.startsWith(item))) {
                    this.showMenu = this.showMenu.filter(i => !i.startsWith(item))
                } else {
                    this.showMenu.push(item)
                }
            },

            isShow(href) {
                return this.showMenu.some(path => path.startsWith(href))
            },
            getClass(item, depthLevel, disabled) {
                return {
                    bold: depthLevel === 1,
                    active: this.activeSlug.startsWith(item._path),
                    disabled: this.activeSlug.startsWith(item._path) && disabled
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .accordion-collapse {
        li {
            display: flex;
            align-items: center;

            .accordion-button {
                width: 16px;

                .material-design-icon > .material-design-icon__svg {
                    bottom: 0;
                }
            }

            @for $i from 0 through 6 {
                &.depth-#{$i} {
                    a {
                        padding-left: calc(.75rem * ($i));
                    }
                }
            }

            a {
                color: var(--bs-body-color);
                font-size: $font-size-sm;
                border-left: 2px solid var(--bs-gray-200);
                padding: calc($spacer / 2);
                display: flex;
                width: 100%;
                text-transform: capitalize;

                &.active {
                    font-weight: 600;
                }

                &:hover {
                    border-left: 2px solid var(--bs-primary);
                    color: var(--bs-primary);
                }

                &.active {
                    color: var(--bs-primary);
                    border-left: 2px solid var(--bs-primary);
                }

                &.disabled {
                    cursor: pointer;
                    color: var(--bs-gray-500);
                }
            }

            &.depth-1 {
                a {
                    padding-left: 0.25rem;
                    border-left: 0;
                }
            }

            &:not(.depth-1) a {
                font-size: $font-size-sm;
            }
        }
    }

    .bold {
        font-weight: bold;
    }
</style>
