<template>
    <li v-if="item.isSection" class="section">
        {{ title }}
    </li>
    <li v-else :class="{ ['depth-' + depthLevel]: true }">
        <a
            v-if="isPage && !item.hideSidebar"
            :class="classes"
            :href="item.path"
            @click="handleNavClick($event, item.path)"
            ref="root-link"
        >
            {{ item.emoji }}
            <span class="title">{{ title }}</span>
        </a>
        <a
            v-else-if="!item.hideSidebar"
            class="disabled"
            :class="classes"
            @click="toggleWithChildrenHandling(item.path)"
        >
            {{ item.emoji }}
            <span class="title">{{ title }}</span>
        </a>
        <template v-if="filteredChildren.length > 0 && !item.hideSubMenus">
            <ChevronDown
                v-if="toggled"
                class="accordion-button"
                @click="toggleWithChildrenHandling(item.path)"
                role="button"
            />
            <ChevronRight
                v-else
                class="accordion-button"
                @click="toggleWithChildrenHandling(item.path)"
                role="button"
            />
        </template>
    </li>
    <ul
        v-if="!item.hideSubMenus && filteredChildren.length > 0"
        class="list-unstyled mb-0 accordion-collapse"
        :class="['ks-collapse', { 'ks-open': toggled }]"
        :style="{ '--depth': depthLevel }"
    >
        <div v-if="depthLevel > 0" class="vertical-line"></div>
        <RecursiveNavSidebar
            v-for="item in filteredChildren"
            :ref="`childSideBar-${pathToId(item.path)}`"
            :item="item"
            :depth-level="depthLevel + 1"
            :parent-slug="item.path"
            :disabled-pages="disabledPages"
            :type="type"
        />
    </ul>
</template>
<script lang="ts">
    import type { ComputedRef, InjectionKey } from "vue"
    function scrollIntoViewIfNotVisible(target?: HTMLElement | null) {
        const bounds = target?.getBoundingClientRect()
        if (bounds && target && (bounds.bottom > window.innerHeight || bounds.top < 0)) {
            target.scrollIntoView({ block: "nearest" })
        }
    }
    export const activeSlugInjectionKey = Symbol("activeSlug") as InjectionKey<ComputedRef<string>>
    export const closeSidebarInjectionKey = Symbol("closeSidebar") as InjectionKey<() => void>
    const normalizePath = (path: string) => `${path}${path.endsWith("/") ? "" : "/"}`

    export interface NavigationItem {
        isSection?: boolean
        isPage?: boolean
        path: string
        title: string
        sidebarTitle?: string
        hideSubMenus?: boolean
        hideSidebar?: boolean
        emoji?: string
        children?: NavigationItem[]
    }
</script>

<script setup lang="ts">
    import { computed, inject, nextTick, onMounted, ref, useTemplateRef, watch } from "vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
    import { useSidebarScroll } from "~/composables/useSidebarScroll"
    import { activeSlug } from "~/utils/store"

    const rootLink = useTemplateRef<HTMLAnchorElement | null>("root-link")

    const props = defineProps<{
        item: NavigationItem
        depthLevel: number
        parentSlug: string
        disabledPages?: Array<string>
        type?: string
    }>()

    const closeSidebar = inject(closeSidebarInjectionKey, () => {})
    const isActive = computed(() =>
        activeSlug.value
            ? normalizePath(activeSlug.value).startsWith(normalizePath(props.item.path))
            : false,
    )
    const toggled = ref<boolean>(isActive.value || props.item.isSection === true)
    const title = computed(() => props.item.sidebarTitle ?? props.item.title)

    watch(activeSlug, (v) => {
        if (isActive.value && (props.item.hideSubMenus || !props.item.isPage)) {
            setTimeout(() => {
                scrollIntoViewIfNotVisible(rootLink.value)
            }, 200)
        }
    })

    onMounted(() => {
        const { restoreScrollPosition, scrollToActiveIfNeeded } = useSidebarScroll()

        nextTick(() => {
            const wasRestored = restoreScrollPosition()

            if (!wasRestored) {
                scrollToActiveIfNeeded()
            }
        })
    })

    function handleNavClick(_event: Event, path: string) {
        closeSidebar()
        toggled.value = true
        activeSlug.value = path
        const { preserveScrollPosition } = useSidebarScroll()
        preserveScrollPosition()
    }

    function toggleWithChildrenHandling(path: string) {
        props.item.children
            ?.filter((i) => i.path.startsWith(path))
            .forEach((i) => {
                if (isActiveOrExpanded(i) || i.path === path) {
                    const childRef = document.querySelector(`#childSideBar-${pathToId(i.path)}`)
                    if (childRef && "toggleWithChildrenHandling" in childRef) {
                        ;(childRef as any).toggleWithChildrenHandling(i.path)
                    }
                }

                if (isActiveOrExpanded(i) && i.path !== path) {
                    toggled.value = true
                }
            })
        toggled.value = !toggled.value
    }

    const pathToId = (path: string) => {
        return path.replaceAll("/", "_").replaceAll(".", "-").replaceAll("#", "__")
    }

    const filteredChildren = computed(() => {
        return (props.item.children ?? []).filter((r: any) => props.item.path !== r.path)
    })

    const isActiveOrExpanded = (item: NavigationItem) => {
        if (item.isSection) {
            return true
        }

        return toggled.value
    }

    const isPage = computed(() => {
        const item = props.item
        if (item.isPage === false) {
            return false
        }

        if (props.disabledPages) {
            return !props.disabledPages.includes(item.path)
        }

        return item.isPage ?? true
    })

    const classes = computed(() => {
        return {
            bold: props.depthLevel === 1,
            section: props.item.isSection,
            active: isActive.value,
        }
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .ks-collapse {
        transition: height 0.2s ease-in-out;
        transition-behavior: allow-discrete;
        overflow: hidden;
        height: 0;
        position: relative;
        @starting-style {
            height: 0;
        }
        &.ks-open {
            height: auto;
            @supports (height: calc-size(auto, size)) {
                height: calc-size(auto, size);
            }
        }
        .vertical-line {
            position: absolute;
            left: calc(1.15rem * (var(--depth, 0)) + 7px);
            top: 6px;
            bottom: 0;
            width: 1px;
            height: calc(100% - 10px);
            background: var(--ks-border-secondary);
        }
    }

    li {
        display: flex;
        align-items: center;
        .accordion-button {
            width: 16px;
            :deep(.material-design-icon__svg) {
                color: var(--ks-content-tertiary);
                position: absolute;
                bottom: -0.20rem;
                font-size: 20px;
            }
        }
        @for $i from 0 through 6 {
            &.depth-#{$i} {
                padding-left: calc(1.25rem * ($i));
            }
        }
        a {
            color: var(--ks-content-secondary);
            font-size: 0.875rem;
            padding: calc($spacer / 4) 0.25rem 0.25rem 0;
            display: flex;
            scroll-margin: 80px;
            &.active {
                font-weight: 500;
                color: var(--ks-content-link) !important;
            }
            &:hover {
                color: var(--ks-content-link) !important;
            }
            &.disabled {
                cursor: pointer;
            }
        }
        &:not(.depth-1) a {
            font-size: 0.875rem;
        }
    }

    .bold {
        font-weight: 400;
    }

    .section {
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--ks-content-primary);
        text-transform: uppercase;
        margin: 1.5rem 0 0.75rem 0.25rem;
    }
</style>