<template>
    <div
        :id="parentSlug"
        :data-bs-parent="'#'+parentSlug"
        class="accordion-collapse"
        :class="activeSlug.includes(parentSlug) ? 'collapse show' : 'collapse'"
    >
        <div v-for="item in items">
            <ul class="bd-links-nav list-unstyled mb-0">
                <li :class="{['depth-' + depthLevel]: true}" class="bd-links-group">
                    <NuxtLink
                        :class="activeSlug.startsWith(item._path) ? 'active' : ''"
                        class="bd-links-link d-inline-block"
                        :href="item._path">
                            {{ item.title }}
                    </NuxtLink>
                    <template v-if="filterChildren(item).length > 0">
                        <chevron-down
                            v-if="showMenu.includes(item._path)"
                            @click="toggle(item._path)"
                            class="accordion-button" data-bs-toggle="collapse"
                            :data-bs-target="'#'+item._path"
                            role="button"
                        />
                        <chevron-up
                            v-else
                            @click="toggle(item._path)"
                            class="accordion-button" data-bs-toggle="collapse"
                            :data-bs-target="'#'+item._path"
                            role="button"
                        />
                    </template>
                </li>
                <RecursiveNavSidebar
                    v-if="filterChildren(item).length > 0"
                    :items="filterChildren(item)"
                    :depth-level="depthLevel+1"
                    :active-slug="activeSlug"
                    :open="showMenu.includes(item._path)"
                    :parent-slug="item._path"
                />
            </ul>
        </div>
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
            }
        },
        created() {
            this.showMenu = [this.activeSlug]
        },
        data: () => ({
            showMenu: [],
        }),
        methods: {
            filterChildren(item) {
                return (item.children || []).filter(r => item._path !== r._path);
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
                font-size: .8rem;
                border-left: 2px solid var(--bs-gray-200);
                padding: calc($spacer/2);
                display: flex;
                width: 100%;

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
            }

            &.depth-1 {
                a {
                    padding-left: 0;
                    border-left: 0;
                }
            }

        }
    }
</style>