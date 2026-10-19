import { nextTick, onUnmounted, ref } from "vue"
import { useEventListener, useScroll, useThrottleFn } from "@vueuse/core"

/** One entry of a table of contents, as docs/NavToc.vue and the guide TOC render it. */
export interface TocLink {
    id: string
    depth: number
    text: string
    children?: TocLink[]
}

interface Options {
    /** Selector of the scrolling list, so the active link is kept in view. */
    container?: string
}

/**
 * Scroll-spy for an in-page table of contents: `activeId` follows the last
 * heading above the fixed header, and `navigateTo(id)` smooth-scrolls to a
 * heading, marks it active and pushes its hash. Shared by docs/NavToc.vue
 * and the resource guide TOC.
 */
export function useTocScrollSpy(
    ids: () => string[],
    { container }: Options = {},
) {
    const { y: scrollY } = useScroll(
        typeof window !== "undefined" ? window : undefined,
    )
    const activeId = ref("")
    const isManualScrolling = ref(false)
    let manualScrollTimer: ReturnType<typeof setTimeout> | undefined

    const getFixedHeaderOffset = () => {
        const selectors = [
            "header",
            ".site-header",
            ".navbar",
            ".topbar",
            ".bd-title",
            ".page-header",
        ]
        for (const sel of selectors) {
            const el = document.querySelector<HTMLElement>(sel)
            if (el) {
                const style = window.getComputedStyle(el)
                const isFixed =
                    ["fixed", "sticky"].includes(style.position) ||
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
        window.scrollTo({
            top: Math.max(0, rectTop - offset - 8),
            behavior: "smooth",
        })
    }

    const setActive = (id: string) => {
        if (activeId.value === id) return
        activeId.value = id
        if (!container) return
        nextTick(() => {
            const list = document.querySelector(container)
            const link = list?.querySelector<HTMLElement>(
                `a[href="#${CSS.escape(id)}"]`,
            )
            if (!list || !link) return
            const cRect = list.getBoundingClientRect()
            const lRect = link.getBoundingClientRect()
            if (lRect.top < cRect.top || lRect.bottom > cRect.bottom) {
                link.scrollIntoView({ block: "nearest" })
            }
        })
    }

    const navigateTo = (id: string) => {
        isManualScrolling.value = true
        if (manualScrollTimer) clearTimeout(manualScrollTimer)
        scrollToElement(id)
        setActive(id)
        try {
            history.pushState(null, "", `#${id}`)
            window.dispatchEvent(new Event("hashchange"))
        } catch {
            if (window?.location) window.location.hash = id
        }
        manualScrollTimer = setTimeout(() => {
            isManualScrolling.value = false
        }, 1000)
    }

    const handleScroll = useThrottleFn(() => {
        if (isManualScrolling.value || scrollY.value === 0) {
            if (scrollY.value === 0) activeId.value = ""
            return
        }
        const offset = getFixedHeaderOffset() + 20
        let current = ""
        for (const id of ids()) {
            const el = document.getElementById(id)
            if (!el) continue
            if (el.getBoundingClientRect().top <= offset) current = id
            else break
        }
        if (current) setActive(current)
    }, 100, true)

    useEventListener("scroll", handleScroll)
    onUnmounted(() => manualScrollTimer && clearTimeout(manualScrollTimer))

    return { activeId, navigateTo }
}
