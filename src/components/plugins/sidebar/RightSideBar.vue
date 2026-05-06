<template>
    <div class="right-side">
        <div class="d-none d-xl-block">
            <OverviewPanel
                :version="version"
                :releases-url="releasesUrl"
                :categories="categories"
                :metadata="metadata"
            />
        </div>

        <div v-if="links?.length" class="toc-section">
            <button
                class="toc-toggle d-xl-none"
                :class="{ collapsed: !tocExpanded }"
                type="button"
                @click="tocExpanded = !tocExpanded"
            >
                <span class="toc-label">Table of Contents</span>
                <span class="toc-chevron" aria-hidden="true">
                    <ChevronUp v-if="tocExpanded" />
                    <ChevronDown v-else />
                </span>
            </button>

            <strong class="toc-heading d-none d-xl-block">Table of Contents</strong>

            <div class="toc-collapse" :class="{ show: tocExpanded }">
                <nav class="toc-nav">
                    <ul>
                        <li
                            v-for="link in flatLinks"
                            :key="link.id"
                            :class="`depth-${link.depth}`"
                        >
                            <a
                                :href="`#${link.id}`"
                                :class="{ active: link.id === activeLinkId }"
                                @click.prevent="navigateToSection(link.id)"
                            >
                                {{ formatLinkText(link.text) }}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <div class="socials-section d-none d-xl-block">
            <SocialsList />
        </div>

        <div class="share-section d-none d-xl-block">
            <Share :title="title" :url="url" titleText="Share this Plugin" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, ref } from "vue"
    import { useEventListener, useThrottleFn, useWindowScroll } from "@vueuse/core"
    import type { PluginMetadata } from "@kestra-io/ui-libs"

    import OverviewPanel from "~/components/plugins/versions/OverviewPanel.vue"
    import SocialsList from "~/components/common/SocialsList.vue"
    import Share from "~/components/common/Share.vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"

    import type { ReleaseInfo } from "../../../pages/api/github-releases"
    import type { TocLink } from "~/utils/plugins/types"

    const MIN_DEPTH = 2
    const MAX_DEPTH = 5
    const DEFAULT_HEADER_HEIGHT = 80
    const SCROLL_OFFSET = 8
    const SCROLL_DETECT_OFFSET = 20
    const SCROLL_THROTTLE_MS = 100
    const MANUAL_SCROLL_TIMEOUT_MS = 1000

    const isValidLink = (l: TocLink) =>
        l.depth >= MIN_DEPTH && l.depth <= MAX_DEPTH && l.text

    const {
        links = [],
        version = null,
        releasesUrl = null,
        categories = [],
        metadata = [],
        title = "",
        url = "",
    } = defineProps<{
        links?: TocLink[]
        version?: { versions?: ReleaseInfo[] } | null
        releasesUrl?: string | null
        categories?: string[]
        metadata?: PluginMetadata[]
        title?: string
        url?: string
    }>()

    const { y: scrollY } = useWindowScroll()
    const activeLinkId = ref("")
    const tocExpanded = ref(false)
    const isManualScrolling = ref(false)
    let manualScrollTimer: ReturnType<typeof setTimeout>

    const TEXT_MAP: Record<string, string> = {
        "Additional Plugins": "Tasks",
    }

    const formatLinkText = (text: string) => TEXT_MAP[text] ?? text

    const flatLinks = computed(() =>
        links.flatMap((l) => [
            ...(isValidLink(l) ? [l] : []),
            ...(l.children?.filter(isValidLink) ?? []),
        ]),
    )

    const getHeaderOffset = () =>
        (document.querySelector("header") as HTMLElement)
            ?.getBoundingClientRect().height ?? DEFAULT_HEADER_HEIGHT

    const scrollToElement = (id: string) => {
        const el = document.getElementById(id)
        if (!el) return

        const top = Math.max(
            0,
            el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset() - SCROLL_OFFSET,
        )
        window.scrollTo({ top, behavior: "smooth" })
    }

    const scrollActiveIntoNav = () => {
        const nav = document.querySelector(".toc-nav") as HTMLElement
        const active = nav?.querySelector("a.active") as HTMLElement
        if (!nav || !active) return

        const navRect = nav.getBoundingClientRect()
        const activeRect = active.getBoundingClientRect()

        if (activeRect.top < navRect.top) {
            nav.scrollTop += activeRect.top - navRect.top
        } else if (activeRect.bottom > navRect.bottom) {
            nav.scrollTop += activeRect.bottom - navRect.bottom
        }
    }

    const setActiveLink = (id: string) => {
        if (activeLinkId.value === id) return
        activeLinkId.value = id
        nextTick(scrollActiveIntoNav)
    }

    const navigateToSection = (id: string) => {
        isManualScrolling.value = true
        clearTimeout(manualScrollTimer)
        scrollToElement(id)
        setActiveLink(id)
        history.pushState(null, "", `#${id}`)
        manualScrollTimer = setTimeout(
            () => (isManualScrolling.value = false),
            MANUAL_SCROLL_TIMEOUT_MS,
        )
        tocExpanded.value = false
    }

    useEventListener("scroll", useThrottleFn(() => {
        if (isManualScrolling.value) return
        if (scrollY.value === 0) {
            activeLinkId.value = ""
            return
        }

        const offset = getHeaderOffset() + SCROLL_DETECT_OFFSET
        let current = ""

        for (const link of flatLinks.value) {
            const el = document.getElementById(link.id)
            if (el && el.getBoundingClientRect().top <= offset) current = link.id
            else if (el) break
        }

        if (current) setActiveLink(current)
    }, SCROLL_THROTTLE_MS))
</script>

<style lang="scss" scoped>
    .right-side {
        @include media-breakpoint-down(xl) {
            margin: $spacer 0;
            width: 100%;
        }
    }

    .toc-section {
        padding: 1rem 0;

        @include media-breakpoint-up(xl) {
            border-top: 1px solid var(--ks-border-primary);
        }

        @include media-breakpoint-down(xl) {
            padding: 0;
        }
    }

    .toc-heading {
        font-size: $font-size-sm;
        font-weight: 600;
        color: var(--ks-content-primary);
        margin-bottom: 0.5rem;
    }

    .toc-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 8px;
        background: var(--ks-background-secondary);
        color: var(--ks-content-secondary);
        font-size: $font-size-sm;
        cursor: pointer;

        &:not(.collapsed) {
            color: var(--ks-content-primary);
            border-radius: 8px 8px 0 0;
        }

        &:hover,
        &:focus {
            color: var(--ks-content-primary);
        }

        .toc-label {
            font-weight: 500;
        }
    }

    .toc-collapse {
        background-color: var(--ks-background-primary);
        position: relative;
        z-index: 10;

        @include media-breakpoint-down(xl) {
            display: none;
            border: 1px solid var(--ks-border-secondary);
            border-top: 0;
            border-radius: 0 0 8px 8px;
            overflow: hidden;

            &.show {
                display: block;
            }
        }

        @include media-breakpoint-up(xl) {
            display: block !important;
        }
    }

    .toc-nav {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: var(--ks-background-button-primary-hover);
            border-radius: 4px;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0 0 0 3px;
            border-left: 1px solid var(--ks-border-secondary);

            @include media-breakpoint-down(xl) {
                border-left: none;
                padding: 0.75rem 0;
            }
        }

        li a {
            display: block;
            padding: 0.2rem 0.75rem 0.2rem 1rem;
            margin-left: -1px;
            border-left: 1px solid transparent;
            font-size: $font-size-xs;
            font-weight: 500;
            color: var(--ks-content-tertiary);
            text-decoration: none;
            cursor: pointer;
            scroll-margin: 3rem;
            transition: color 0.15s ease, border-color 0.15s ease;

            @for $i from 2 through 6 {
                &.depth-#{$i} {
                    padding-left: ($i - 2) * 0.75rem;
                }
            }

            &:hover,
            &.active {
                color: var(--ks-content-link);
                border-left-color: var(--ks-content-link);
                @include media-breakpoint-down(xl) {
                    border: none;
                }
            }
        }
    }

    .share-section {
        padding: 1rem 0;
        border-top: 1px solid var(--ks-border-primary);

        :deep(.title) {
            font-size: $font-size-sm;
        }
    }

    :deep(.socials-section) {
        padding: 1rem 0;
        border-top: 1px solid var(--ks-border-primary);

        strong {
            margin-left: 0 !important;
        }

        .social ul li a {
            padding-left: 0.5rem !important;

            &:hover,
            &.active {
                border-left: none !important;
            }
        }
    }
</style>

