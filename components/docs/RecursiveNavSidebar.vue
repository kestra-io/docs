<template>
    <div
        :id="pathToId(parentSlug)"
        :data-bs-parent="'#'+pathToId(parentSlug)"
        class="accordion-collapse collapse"
        :class="{show: isActiveOrExpanded({path: parentSlug, children: items})}"
    >
        <template v-for="item in items">
            <ul class="list-unstyled mb-0">
                <li v-if="item.isSection" class="section">
                    {{ item.title }}
                </li>
                <li v-else :class="{['depth-' + depthLevel]: true}" >
                    <NuxtLink
                        v-if="isPage(item) && !item.hideSidebar"
                        :class="getClass(item, depthLevel, false)"
                        :href="item.path">
                           {{ item.emoji }}
                            {{ item.title }}
                    </NuxtLink>
                    <NuxtLink
                        v-else-if="!item.hideSidebar"
                        :class="getClass(item, depthLevel, true)"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#'+pathToId(item.path)"
                        @click="toggleWithChildrenHandling(item.path)"
                    >
                            {{ item.emoji }}
                            {{ item.title }}
                    </NuxtLink>
                    <template v-if="filterChildren(item).length > 0 && !item.hideSubMenus">
                        <chevron-down
                            v-if="isActiveOrExpanded(item)"
                            class="accordion-button"
                            data-bs-toggle="collapse"
                            :data-bs-target="'#'+pathToId(item.path)"
                            @click="toggleWithChildrenHandling(item.path)"
                            role="button"
                        />
                        <chevron-right
                            v-else
                            class="accordion-button"
                            data-bs-toggle="collapse"
                            :data-bs-target="'#'+pathToId(item.path)"
                            @click="toggleWithChildrenHandling(item.path)"
                            role="button"
                        />
                    </template>
                </li>
                    <RecursiveNavSidebar
                        v-if="!item.hideSubMenus && filterChildren(item).length > 0"
                        :ref="`childSideBar-${pathToId(item.path)}`"
                        :items="filterChildren(item)"
                        :depth-level="depthLevel+1"
                        :active-slug="activeSlug"
                        :parent-slug="item.path"
                        :disabled-pages="disabledPages"
                        :type="type"
                    />
            </ul>
        </template>
    </div>
</template>

<script>
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"

    export default {
        name: "RecursiveNavSidebar",
        components: {
            ChevronDown,
            ChevronRight
        },
        props: {
            items: {
                type: Array,
                required: true
            },
            depthLevel: {
                type: Number,
                required: true
            },
            activeSlug: {
                type: String,
                required: true
            },
            parentSlug: {
                type: String,
                required: true
            },
            disabledPages: {
                type: Array,
                required: false
            },
            type: {
                type: String,
                required: false
            }
        },
        data: () => ({
            toggled: [],
        }),
        mounted() {
            this.$nextTick(() => {
                const activeItem = document.querySelector('.bd-sidebar a.active');
                if (activeItem) {
                    activeItem.scrollIntoView({ behavior: 'instant', block: 'center' });
                }
            });
        },
        methods: {
            toggleWithChildrenHandling(path) {
                this.items.filter(i => i.path.startsWith(path))
                    .forEach(i => {
                        if (this.isActiveOrExpanded(i) || i.path === path) {
                            this.$refs["childSideBar-" + this.pathToId(i.path)]?.[0]?.toggleWithChildrenHandling(i.path);
                        }

                        if (this.isActiveOrExpanded(i) && i.path !== path) {
                            this.rawToggle(i.path);
                        }
                    });

                this.rawToggle(path);
            },
            rawToggle(path) {
                if (this.toggled.includes(path)) {
                    this.toggled = this.toggled.filter(p => p !== path);
                } else {
                    this.toggled.push(path);
                }
            },
            pathToId(path) {
                return path.replaceAll("/", '_').replaceAll(".", "-").replaceAll("#", "__");
            },
            filterChildren(item) {
                return (item.children || []).filter(r => item.path !== r.path);
            },
            isActive(item) {
                if (item.path.includes("#") && item.children?.some(c => this.isActive(c))) {
                    return true;
                }

                return item.path.match(/[^/]*\.[^/]*$/) ? this.activeSlug === item.path : this.activeSlug.startsWith(item.path);
            },
            isActiveOrExpanded(item) {
                if (this.isActive(item)) {
                    return !this.toggled.includes(item.path);
                }

                return this.toggled.includes(item.path);
            },
            isPage(item) {
                if (item.isPage === false) {
                    return false;
                }

                if (this.disabledPages) {
                    return !this.disabledPages.includes(item.path)
                }

                return item.isPage ?? true;
            },
            getClass(item, depthLevel, disabled) {
                return {
                    bold: depthLevel === 1,
                    section: item.isSection,
                    active: this.isActive(item),
                    disabled: disabled
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

                :deep(.material-design-icon__svg) {
                    bottom: 0;
                    color: $black-10;
                }
            }

            @for $i from 0 through 6 {
                &.depth-#{$i} {
                    a {
                        padding-left: calc(.5rem * ($i));
                    }
                }
            }

            a {
                color: $white-1;
                font-size: $font-size-sm;
                padding: calc($spacer / 2);
                display: flex;

                &.active {
                    font-weight: 500;
                }

                &:hover, &.active {
                    color: $purple !important;
                }

                &.disabled {
                    cursor: pointer;
                }
            }

            &.depth-1 {
                a {
                    padding-left: 0.25rem;
                    border-left: 0;
                    color: $white-1;
                }
            }

            &:not(.depth-1) a {
                font-size: $font-size-sm;
            }
        }
    }

    .bold {
        font-weight: 400;
    }
    .section {
        font-size: $font-size-xs;
        font-weight: 500;
        color: $white-3;
        text-transform: uppercase;
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        padding-left: 0.25rem;
    }
</style>
