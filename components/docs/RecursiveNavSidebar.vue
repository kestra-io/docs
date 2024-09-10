<template>
    <div
        :id="pathToId(parentSlug)"
        :data-bs-parent="'#'+pathToId(parentSlug)"
        class="accordion-collapse"
        :class="activeSlug.includes(parentSlug) ? 'collapse show' : 'collapse'"
    >
        <!-- Add the index statically to avoid having sub-nav for it-->
        <template v-if="depthLevel === 1 && type === 'docs'">
            <ul class="list-unstyled mb-0">
                <li class="depth-1">
                    <NuxtLink href="/docs" class="bold" :class="activeSlug === '/docs' || activeSlug === '/docs/' ? 'active' : ''"
                    >
                            Welcome to Kestra
                    </NuxtLink>
                </li>
            </ul>
        </template>
        <template v-for="item in items">
            <ul class="list-unstyled mb-0">
                <li :class="{['depth-' + depthLevel]: true}" >
                    <NuxtLink
                        v-if="isPage(item) && !item.hideSidebar"
                        :class="getClass(item, depthLevel, false)"
                        :href="item._path">
                           {{ item.emoji }}
                            {{ item.title }}
                    </NuxtLink>
                    <NuxtLink
                        v-else-if="!item.hideSidebar"
                        :class="getClass(item, depthLevel, true)"
                        class="disabled"
                        @click="toggle(item._path, isPage(item))" data-bs-toggle="collapse"
                        :data-bs-target="'#'+pathToId(item._path)"
                    >
                            {{ item.emoji }}
                            {{ item.title }}
                    </NuxtLink>
                    <template v-if="filterChildren(item).length > 0">
                        <chevron-down
                            v-if="isShow(item._path) && !item.hideSidebar"
                            @click="toggle(item._path)"
                            class="accordion-button" data-bs-toggle="collapse"
                            :data-bs-target="'#'+pathToId(item._path)"
                            role="button"
                        />
                        <chevron-right
                            v-else-if="!item.hideSidebar"
                            @click="toggle(item._path)"
                            class="accordion-button" data-bs-toggle="collapse"
                            :data-bs-target="'#'+pathToId(item._path)"
                            role="button"
                        />
                    </template>
                </li>
                <RecursiveNavSidebar
                    v-if="filterChildren(item).length > 0"
                    :items="filterChildren(item)"
                    :depth-level="depthLevel+1"
                    :active-slug="activeSlug"
                    :open="isShow(item._path)"
                    :parent-slug="item._path"
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
            open: {
                type: Boolean,
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
        created() {
            this.showMenu = [this.activeSlug]
        },
        data: () => ({
            showMenu: [],
        }),
        methods: {
            pathToId(path) {
                return path.replaceAll(/[/.]/g, '_')
            },
            filterChildren(item) {
                return (item.children || []).filter(r => item._path !== r._path);
            },
            toggle(item) {
                if (this.showMenu.some(path => path.startsWith(item))) {
                    this.showMenu = this.showMenu.filter(i => !i.startsWith(item))
                } else {
                    this.showMenu.push(item)
                }
            },
            isShow(item) {
                return this.showMenu.some(path => path.startsWith(item))
            },
            isPage(item) {
                if (item.isPage === false) {
                    return false;
                }

                if (this.disabledPages) {
                    return !this.disabledPages.includes(item._path)
                }

                return item.isPage ?? true;
            },
            getClass(item, depthLevel, disabled) {
                let s = (this.activeSlug + '/').startsWith(item._path + '/');

                return {
                    bold: depthLevel === 1,
                    active: s,
                    disabled: s && disabled
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
                font-size: $font-size-base;
                padding: calc($spacer / 2);
                display: flex;

                &.active {
                    font-weight: 600;
                }

                &:hover, &.active {
                    color: $purple;
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
        font-weight: bold;
    }
</style>
