<template>
    <li v-if="item.isSection" class="section">
        {{ item.title }}
    </li>
    <li v-else :class="{['depth-' + depthLevel]: true}" >
        <a
            v-if="isPage(item) && !item.hideSidebar"
            :class="getClass(item, depthLevel, false)"
            :href="item.path"
            @click="handleNavClick($event, item.path)"
        >
            {{ item.emoji }}
            {{ item.title }}
        </a>
        <a
            v-else-if="!item.hideSidebar"
            :class="getClass(item, depthLevel, true)"
            @click="toggleWithChildrenHandling(item.path)"
        >
            {{ item.emoji }}
            {{ item.title }}
        </a>
        <template v-if="filterChildren(item).length > 0 && !item.hideSubMenus">
            <ChevronDown
                v-if="isActiveOrExpanded(item)"
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
        v-if="!item.hideSubMenus && filterChildren(item).length > 0"
        class="list-unstyled mb-0 accordion-collapse"
        :class="['ks-collapse', {'ks-open': isActiveOrExpanded(item)}]"
    >
        <RecursiveNavSidebar
            v-for="item in filterChildren(item)"
            :ref="`childSideBar-${pathToId(item.path)}`"
            :item="item"
            :depth-level="depthLevel+1"
            :parent-slug="item.path"
            :disabled-pages="disabledPages"
            :type="type"
        />
    </ul>
</template>
<script lang="ts">
export const activeSlugInjectionKey = Symbol('activeSlug') as InjectionKey<Ref<string>>
</script>

<script setup lang="ts">
import { ref, nextTick, onMounted, inject, type InjectionKey, type Ref } from "vue"
import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
import { useSidebarScroll } from "../../composables/useSidebarScroll"

export interface NavigationItem {
    isSection?: boolean;
    isPage?: boolean;
    path: string;
    title: string;
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

const toggled = ref<string[]>([])

onMounted(() => {
    const { restoreScrollPosition, scrollToActiveIfNeeded } = useSidebarScroll()

    nextTick(() => {
        const wasRestored = restoreScrollPosition()

        if (!wasRestored) {
            scrollToActiveIfNeeded()
        }
    })
})

const handleNavClick = (_event: Event, path: string) => {
    activeSlug.value = path
    const { preserveScrollPosition } = useSidebarScroll()
    preserveScrollPosition()
}

const toggleWithChildrenHandling = (path: string) => {
    props.item.children?.filter(i => i.path.startsWith(path))
        .forEach(i => {
            if (isActiveOrExpanded(i) || i.path === path) {
                const childRef = document.querySelector(`#childSideBar-${pathToId(i.path)}`)
                if (childRef && 'toggleWithChildrenHandling' in childRef) {
                    (childRef as any).toggleWithChildrenHandling(i.path)
                }
            }

            if (isActiveOrExpanded(i) && i.path !== path) {
                rawToggle(i.path)
            }
        })

    rawToggle(path)
}

const rawToggle = (path: string) => {
    if (toggled.value.includes(path)) {
        toggled.value = toggled.value.filter(p => p !== path)
    } else {
        toggled.value.push(path)
    }
}

const pathToId = (path: string) => {
    return path.replaceAll("/", '_').replaceAll(".", "-").replaceAll("#", "__")
}

const filterChildren = (item: NavigationItem) => {
    return (item.children || []).filter((r: any) => item.path !== r.path)
}

const isActive = (item: NavigationItem) => {
    if(!activeSlug.value) {
        return false
    }

    if (item.path.includes("#") && item.children?.some((c: any) => isActive(c))) {
        return true
    }

    if (item.path.match(/[^/]*\.[^/]*$/)) {
        return activeSlug.value === item.path
    }

    const normalizePath = (path: string) => `${path}${path.endsWith('/') ? '' : '/'}`
    return normalizePath(activeSlug.value).startsWith(normalizePath(item.path))
}

const isActiveOrExpanded = (item: NavigationItem) => {
    if(item.isSection) {
        return true
    }
    if (isActive(item)) {
        return !toggled.value.includes(item.path)
    }

    return toggled.value.includes(item.path)
}

const isPage = (item: NavigationItem) => {
    if (item.isPage === false) {
        return false
    }

    if (props.disabledPages) {
        return !props.disabledPages.includes(item.path)
    }

    return item.isPage ?? true
}

const getClass = (item: any, depthLevel: number, disabled: boolean) => {
    return {
        bold: depthLevel === 1,
        section: item.isSection,
        active: isActive(item),
        disabled: disabled
    }
}

const activeSlug = inject(activeSlugInjectionKey, ref(''))
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable.scss";

    .ks-collapse {
        transition: height 0.2s ease-in-out;
        transition-behavior: allow-discrete;
        overflow: hidden;
        height: 0;
        @starting-style {
            height: 0;
        }
        &.ks-open{
            height: calc-size(auto, size);
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