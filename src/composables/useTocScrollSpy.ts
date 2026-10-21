import { nextTick, ref } from "vue"
import { useEventListener, useThrottleFn, useTimeoutFn } from "@vueuse/core"

/** TOC scroll-spy: `activeId` tracks the last heading above the header, and
 *  `navigateTo(id)` smooth-scrolls there, marks it active, pushes the hash. */
export function useTocScrollSpy(
    ids: () => string[],
    /** Selector of the scrolling list, so the active link is kept in view. */
    { container }: { container?: string } = {},
) {
    const activeId = ref("")
    /** Pending while a click-driven scroll runs, so the spy stays out. */
    const manual = useTimeoutFn(() => {}, 1000, { immediate: false })

    const getFixedHeaderOffset = () => {
        for (const sel of [
            "header",
            ".site-header",
            ".navbar",
            ".topbar",
            ".bd-title",
            ".page-header",
        ]) {
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
        const element = document.getElementById(id)
        if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY
            window.scrollTo({
                top: Math.max(0, top - getFixedHeaderOffset() - 8),
                behavior: "smooth",
            })
        }
        setActive(id)
        try {
            history.pushState(null, "", `#${id}`)
            window.dispatchEvent(new Event("hashchange"))
        } catch {
            window.location.hash = id
        }
        manual.start()
    }

    const handleScroll = useThrottleFn(
        () => {
            if (window.scrollY === 0) {
                activeId.value = ""
                return
            }
            if (manual.isPending.value) return
            const offset = getFixedHeaderOffset() + 20
            let current = ""
            for (const id of ids()) {
                const el = document.getElementById(id)
                if (!el) continue
                if (el.getBoundingClientRect().top <= offset) current = id
                else break
            }
            if (current) setActive(current)
        },
        100,
        true,
    )

    useEventListener("scroll", handleScroll)

    return { activeId, navigateTo }
}
