<template>
    <div
        :id="parentSlug.replaceAll('/', '_')"
        :data-bs-parent="'#'+parentSlug.replaceAll('/', '_')"
        class="accordion-collapse"
        :class="activeSlug.includes(parentSlug) ? 'collapse show' : 'collapse'"
    >
        <template v-for="item in items">
            <ul class="list-unstyled mb-0">
                <li :class="{['depth-' + depthLevel]: true}" >
                    <NuxtLink
                        v-if="isPage(item)"
                        :class="getClass(item, depthLevel, !item.children || item.children.length === 0)"
                        :href="item._path">
                        {{ item.title }}
                    </NuxtLink>
                    <NuxtLink
                        v-else
                        :class="getClass(item, depthLevel, true)"
                        class="disabled"
                        @click="toggle(item._path, isPage(item))"
                        data-bs-toggle="collapse"
                        :data-bs-target="'#' + item._path.replaceAll('/', '_')"
                    >
                        {{ item.title  }}
                    </NuxtLink>
                    <template v-if="item.children && item.children.length > 0">
                        <chevron-up
                            v-if="isShow(item._path)"
                            @click="toggle(item._path)"
                            class="accordion-button" data-bs-toggle="collapse"
                            :data-bs-target="'#'+item._path.replaceAll('/', '_')"
                            role="button"
                        />
                        <chevron-down
                            v-else
                            @click="toggle(item._path)"
                            class="accordion-button" data-bs-toggle="collapse"
                            :data-bs-target="'#'+item._path.replaceAll('/', '_')"
                            role="button"
                        />
                        <RecursivePluginsSidebar
                            :items="item.children"
                            :depth-level="depthLevel+1"
                            :active-slug="activeSlug"
                            :open="isShow(item._path)"
                            :parent-slug="item._path"
                        />
                    </template>
                </li>
            </ul>
        </template>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"

    const props = defineProps({
        items: Array,
        depthLevel: Number,
        activeSlug: String,
        open: Boolean,
        parentSlug: String,
        pageList: Array,
    });

    const showMenu = ref([props.activeSlug]);

    const toggle = (path) => {
        const index = showMenu.value.indexOf(path);
        if (index >= 0) {
            showMenu.value.splice(index, 1);
        } else {
            showMenu.value.push(path);
        }
    };

    const isPage = (item) => props.pageList && props.pageList.includes(item._path);

    const isShow = (path) => showMenu.value.includes(path);

    const getClass = (item, depthLevel, isLeaf) => ({
        'bold': depthLevel === 1,
        'active': props.activeSlug.startsWith(item._path),
        'disabled': isLeaf
    });
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
