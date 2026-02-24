<template>
    <div
        id="nav-toc-global"
        class="bd-toc d-lg-flex justify-content-end"
        :class="{ plugin: isPluginPage }"
    >
        <div>
            <template v-if="links?.length" class="bd-contents-list">
                <button
                    class="btn toc-toggle d-lg-none"
                    :class="{ collapsed: !tableOfContentsExpanded }"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#tocContents"
                    :aria-expanded="tableOfContentsExpanded"
                    aria-controls="tocContents"
                    @click="tableOfContentsExpanded = !tableOfContentsExpanded"
                >
                    <span class="toc-label">Table of Contents</span>
                    <span class="toc-chevron" aria-hidden>
                        <ChevronUp class="chev-icon" v-if="tableOfContentsExpanded" />
                        <ChevronDown class="chev-icon" v-else />
                    </span>
                </button>

                <OverviewPanel
                    v-show="isPluginPage"
                    :version
                    :releasesUrl
                    :categories
                    :metadata="props.metadata"
                />

                <div class="collapse bd-toc-collapse" id="tocContents">
                    <slot name="header"></slot>
                    <strong class="d-none d-lg-block h6 mb-2">Table of Contents</strong>
                    <nav id="nav-toc">
                        <ul class="ps-0 pt-2 pt-lg-0 mb-2" v-for="tableOfContent in links">
                            <li
                                v-if="
                                    (tableOfContent.depth ?? 0) > 1 &&
                                    (tableOfContent.depth ?? 0) < 6 &&
                                    tableOfContent.text
                                "
                                @click="closeToc"
                                class="table-content"
                            >
                                <a
                                    @click.prevent="menuNavigate"
                                    :href="`#${tableOfContent.id}`"
                                    :class="{
                                        [`depth-${tableOfContent.depth}`]: true,
                                        active: tableOfContent.id === activeLinkId
                                    }"
                                    >{{ tableOfContent.text }}</a
                                >
                            </li>
                            <ul class="ps-0 pt-2 pt-lg-0" v-if="tableOfContent?.children?.length">
                                <template v-for="item in tableOfContent?.children">
                                    <li
                                        v-if="(item.depth ?? 0) > 1 && (item.depth ?? 0) < 6"
                                        @click="closeToc"
                                        :class="{ 'mt-3': item.depth === 2 }"
                                    >
                                        <a
                                            @click.prevent="menuNavigate"
                                            :href="`#${item.id}`"
                                            :class="{
                                                [`depth-${item.depth}`]: true,
                                                active: item.id === activeLinkId
                                            }"
                                            >{{ item.text }}</a
                                        >
                                    </li>
                                </template>
                            </ul>
                        </ul>
                    </nav>
                </div>
            </template>

            <div class="d-none d-lg-block pt-2 bd-social-list">
                <SocialsList :editUrl :stem :extension />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { nextTick, ref, onUnmounted } from "vue"
    import { useEventListener, useScroll } from "@vueuse/core"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import SocialsList from "~/components/common/SocialsList.vue"
    import OverviewPanel from "~/components/plugins/OverviewPanel.vue"
    import type { PluginMetadata } from "@kestra-io/ui-libs"
    import type { ReleaseInfo } from "../../pages/api/github-releases"

    export interface TocLink {
        id: string
        depth: number
        text: string
        children?: TocLink[]
    }

    const throttle = (fn: Function, delay: number) => {
        let lastCall = 0;
        return (...args: any[]) => {
            const now = Date.now();
            if (now - lastCall < delay) return;
            lastCall = now;
            return fn(...args);
        }
    }

    const props = withDefaults(
        defineProps<{
            links?: TocLink[],
            editLink?: boolean,
            extension?: string,
            stem?: string,
            editUrl?: string,
            capitalize?: boolean,
            version?: { versions?: ReleaseInfo[] } | null,
            releasesUrl?: string | null,
            categories?: string[],
            metadata?: PluginMetadata[],
            isPluginPage?: boolean,
            class?: string
        }>(),
        {
            links: () => [],
            version: null,
            releasesUrl: null,
            categories: () => [],
            metadata: () => []
        }
    )

    const { y: scrollY } = useScroll(typeof window !== "undefined" ? window : undefined)
    const tableOfContentsExpanded = ref(false)
    const activeLinkId = ref("")
    const isManualScrolling = ref(false)
    let manualScrollTimer: ReturnType<typeof setTimeout> | undefined

    const getFixedHeaderOffset = () => {
        const selectors = [
            "header",
            ".site-header",
            ".navbar",
            ".topbar",
            ".bd-title",
            ".page-header"
        ]
        for (const sel of selectors) {
            const el = document.querySelector(sel) as HTMLElement | null
            if (el) {
                const style = window.getComputedStyle(el)
                const isFixed = ["fixed", "sticky"].includes(style.position) || 
                               Math.round(el.getBoundingClientRect().top) === 0
                if (isFixed) return el.getBoundingClientRect().height
            }
        }
        return 160
    }

    const scrollToElement = (id: string) => {
        const element = document.getElementById(id)
        if (!element) return
        
        const offset = getFixedHeaderOffset()
        const rectTop = element.getBoundingClientRect().top + window.pageYOffset
        const top = Math.max(0, rectTop - offset - 8)
        
        window.scrollTo({ top, behavior: "smooth" })
    }

    const updateActiveLink = (id: string) => {
        if (activeLinkId.value === id) return
        activeLinkId.value = id
        
        nextTick(() => {
            const container = document.querySelector("#nav-toc")
            const link = document.querySelector(`#nav-toc a.active`) as HTMLElement
            
            if (container && link) {
                const cRect = container.getBoundingClientRect()
                const lRect = link.getBoundingClientRect()
                
                if (lRect.top < cRect.top || lRect.bottom > cRect.bottom) {
                    link.scrollIntoView({ block: "nearest" })
                }
            }
        })
    }

    const menuNavigate = (e: Event) => {
        const id = (e.currentTarget as HTMLAnchorElement).getAttribute("href")?.substring(1)
        if (!id) return
        isManualScrolling.value = true
        if (manualScrollTimer) clearTimeout(manualScrollTimer)
        scrollToElement(id)
        updateActiveLink(id)
        try {
            history.pushState(null, "", `#${id}`)
            window.dispatchEvent(new Event("hashchange"))
        } catch {
            if (window?.location) window.location.hash = id
        }
        manualScrollTimer = setTimeout(() => isManualScrolling.value = false, 1000)
    }

    const closeToc = () => {
        tableOfContentsExpanded.value = false
        document.getElementById("tocContents")?.classList.remove("show")
    }

    const handleScroll = throttle(() => {
        if (isManualScrolling.value || scrollY.value === 0) {
            if (scrollY.value === 0) activeLinkId.value = ""
            return
        }
        
        const offset = getFixedHeaderOffset() + 20
        const allLinks = props.links?.flatMap(l => [l, ...(l.children || [])]) || []
        
        let currentActive = ""
        for (const link of allLinks) {
            const el = document.getElementById(link.id)
            if (el && el.getBoundingClientRect().top <= offset) {
                currentActive = link.id
            } else if (el) {
                break
            }
        }
        
        if (currentActive) updateActiveLink(currentActive)
    }, 100)

    useEventListener("scroll", handleScroll)
    onUnmounted(() => manualScrollTimer && clearTimeout(manualScrollTimer))
</script>

<style lang="scss" scoped>
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "~/assets/styles/variable";

    .bd-toc {
        @include media-breakpoint-down(lg) {
            margin: $rem-1 0;
            width: 100%;
            box-sizing: border-box;
        }
        @include media-breakpoint-up(lg) {
            padding: 2rem 0;
            max-height: 100%;
            min-width: 250px;
            z-index: 10;
            &:not(.plugin) {
                border: 0;
                border-left-width: 1px;
                border-style: solid;
                border-image: linear-gradient(to bottom, #181818, #5c5c5c, #181818) 1 100%;
                html.light & {
                    border-image: linear-gradient(to bottom, #e5e5e5, #9c9c9c, #e5e5e5) 1 100%;
                }
            }
            &.plugin {
                border-left: $block-border;
            }
        }
        &::-webkit-scrollbar {
            display: none;
        }
        > div {
            height: fit-content;
            @include media-breakpoint-up(lg) {
                position: sticky;
                top: 80px;
                width: 100%;
                overflow-x: hidden;
                overflow-y: auto;
            }
        }
        &.plugin > div {
            @include media-breakpoint-up(lg) {
                top: 0;
            }
        }
        nav {
            @include font-size(0.875rem);
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--ks-border-primary);
            position: relative;
            @include media-breakpoint-up(lg) {
                overflow-y: auto;
                max-height: 600px;
                overflow-x: hidden;
            }
            @include media-breakpoint-down(lg) {
                overflow: visible;
            }
            &::-webkit-scrollbar {
                width: 4px;
                height: 4px;
            }
            &::-webkit-scrollbar-track {
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background: var(--ks-content-color-highlight);
                &:hover {
                    background: color-palette.$base-purple-600;
                }
            }
            a {
                display: block;
                padding: 0 0.75rem;
                color: inherit;
                text-decoration: none;
                font-size: 12px;
                border-left: 1px solid transparent;
                code {
                    font: inherit;
                }
            }
            ul {
                margin-bottom: 0;
                list-style: none;
                li {
                    font-size: 0.875rem;
                    line-height: var(--bs-body-line-height) !important;
                }
                li a {
                    padding-left: 0.75rem;
                    color: var(--ks-content-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    scroll-margin: 3rem;
                    @for $i from 2 through 6 {
                        &.depth-#{$i} {
                            font-size: if($i == 2, 14px, if($i == 3, 13px, 12px));
                            padding-left: ($i - 2) * 1rem + 1.5rem;
                        }
                    }
                    &:hover,
                    &.active {
                        color: var(--ks-content-link);
                        border-left: 1px solid var(--ks-content-link) !important;
                    }
                }
            }
        }
        .h6 {
            color: var(--ks-content-primary);
            font-size: $font-size-sm;
            line-height: 1.875rem;
            font-weight: 600;
            padding-top: 0;
        }
        hr {
            border-color: var(--bs-gray-600);
        }
    }

    .btn {
        display: inline-block;
        width: 100%;
        padding: 0;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 8px;
        background: var(--ks-background-body);
        color: var(--ks-content-secondary);
        font-size: $font-size-sm;
        text-align: center;
        &.collapsed {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        &:hover,
        &:focus,
        &:active,
        &[aria-expanded="true"] {
            background: var(--ks-background-body);
            color: var(--ks-content-primary);
            font-size: 16px;
        }
    }

    .toc-toggle[aria-expanded="true"] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--ks-content-primary);
        border-radius: 8px 8px 0 0;
    }

    .bd-toc-collapse {
        border-radius: var(--bs-border-radius, 8px);
        overflow: hidden;
        strong {
            margin-left: 1.5rem;
        }
        @include media-breakpoint-down(lg) {
            border-top-width: 0 !important;
            border: 1px solid var(--ks-border-secondary);
            border-radius: 0 0 8px 8px;
            nav {
                padding-bottom: $spacer;
                border-radius: inherit;
            }
        }
        @include media-breakpoint-up(lg) {
            display: block !important;
        }
        &.show {
            border-radius: 0 0 8px 8px;
        }
    }

    .bd-social-list {
        @include media-breakpoint-down(lg) {
            border-top-width: 0 !important;
            border: 1px solid var(--ks-border-secondary);
            border-radius: 0 0 8px 8px;
        }
        button:hover {
            color: var(--ks-content-color-highlight) !important;
        }
        ul,
        :deep(ul) {
            li a {
                font-weight: 500;
                &:hover {
                    color: var(--ks-content-color-highlight) !important;
                    border-left: 1px solid var(--ks-content-color-highlight) !important;
                }
            }
        }
    }
</style>