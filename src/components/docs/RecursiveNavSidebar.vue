<template>
    <li v-if="item.isSection" class="section">
        {{ title }}
    </li>
    <li v-else :class="{ ['depth-' + depthLevel]: true }">
        <a v-if="isPage && !item.hideSidebar" :class="classes" :href="item.path"
            @click="handleNavClick($event, item.path)" ref="root-link">
            {{ item.emoji }}
            {{ title }}
        </a>
        <a v-else-if="!item.hideSidebar" class="disabled" :class="classes"
            @click="toggleWithChildrenHandling(item.path)">
            {{ item.emoji }}
            {{ title }}
        </a>
        <template v-if="filteredChildren.length > 0 && !item.hideSubMenus">
            <ChevronDown v-if="toggled" class="accordion-button" @click="toggleWithChildrenHandling(item.path)"
                role="button" />
            <ChevronRight v-else class="accordion-button" @click="toggleWithChildrenHandling(item.path)"
                role="button" />
        </template>
    </li>
    <ul v-if="!item.hideSubMenus && filteredChildren.length > 0" class="list-unstyled mb-0 accordion-collapse"
        :class="['ks-collapse', { 'ks-open': toggled }]">
        <RecursiveNavSidebar v-for="item in filteredChildren" :ref="`childSideBar-${pathToId(item.path)}`" :item="item"
            :depth-level="depthLevel + 1" :parent-slug="item.path" :disabled-pages="disabledPages" :type="type" />
    </ul>
</template>
<script lang="ts">
    export const activeSlugInjectionKey = Symbol('activeSlug') as InjectionKey<Ref<string>>
    export const closeSidebarInjectionKey = Symbol('closeSidebar') as InjectionKey<() => void>
    const normalizePath = (path: string) => `${path}${path.endsWith('/') ? '' : '/'}`
</script>

<script setup lang="ts">
    import { ref, nextTick, onMounted, inject, type InjectionKey, type Ref, computed, watch, useTemplateRef } from "vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
    import { useSidebarScroll } from "~/composables/useSidebarScroll"

    const rootLink = useTemplateRef<HTMLAnchorElement | null>('root-link')

    export interface NavigationItem {
        isSection?: boolean;
        isPage?: boolean;
        path: string;
        title: string;
        sidebarTitle?: string;
        hideSubMenus?: boolean;
        hideSidebar?: boolean;
        emoji?: string;
        children?: NavigationItem[];
    }

    const props = defineProps<{
        item: NavigationItem
        depthLevel: number
        parentSlug: string
        disabledPages?: Array<string>
        type?: string
    }>()

    const activeSlug = inject(activeSlugInjectionKey, ref(''))
    const closeSidebar = inject(closeSidebarInjectionKey, () => { })
    const isActive = computed(() => normalizePath(activeSlug.value).startsWith(normalizePath(props.item.path)))
    const toggled = ref<boolean>(isActive.value || props.item.isSection === true)
    const title = computed(() => props.item.sidebarTitle ?? props.item.title)

    watch(activeSlug, (v) => {
        if(props.item.isSection === true) return
        toggled.value = isActive.value
        if(isActive.value && (props.item.hideSubMenus || !props.item.isPage)){
            nextTick(() => {
                rootLink.value?.scrollIntoView()
            })
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

    function handleNavClick(_event: Event, path: string){
        closeSidebar()
        activeSlug.value = path
        toggled.value = true
        const { preserveScrollPosition } = useSidebarScroll()
        preserveScrollPosition()
    }

    function toggleWithChildrenHandling(path: string){
        props.item.children?.filter(i => i.path.startsWith(path))
            .forEach(i => {
                if (isActiveOrExpanded(i) || i.path === path) {
                    const childRef = document.querySelector(`#childSideBar-${pathToId(i.path)}`)
                    if (childRef && 'toggleWithChildrenHandling' in childRef) {
                        (childRef as any).toggleWithChildrenHandling(i.path)
                    }
                }

                if (isActiveOrExpanded(i) && i.path !== path) {
                    toggled.value = true
                }
            })
        toggled.value = !toggled.value
    }

    const pathToId = (path: string) => {
        return path.replaceAll("/", '_').replaceAll(".", "-").replaceAll("#", "__")
    }

    const filterChildren = (item: NavigationItem) => {
        return (item.children || []).filter((r: any) => item.path !== r.path)
    }

    const filteredChildren = computed(() => {
        return filterChildren(props.item)
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

    const getClass = (item: any, depthLevel: number) => {
        return {
            bold: depthLevel === 1,
            section: item.isSection,
            active: isActive.value,
        }
    }

    const classes = computed(() => {
        return getClass(props.item, props.depthLevel)
    })

</script>

<style lang="scss" scoped>
@import "~/assets/styles/variable";

.ks-collapse {
    transition: height 0.2s ease-in-out;
    transition-behavior: allow-discrete;
    overflow: hidden;
    height: 0;

    @starting-style {
        height: 0;
    }

    &.ks-open {
        height: auto;

        @supports (height: calc-size(auto, size)) {
            height: calc-size(auto, size);
        }
    }
}

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

        &:hover,
        &.active {
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
