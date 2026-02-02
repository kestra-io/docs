import { useSessionStorage } from "@vueuse/core"

export const useSidebarScroll = () => {
    const scrollPosition = useSessionStorage("sidebar-scroll-position", "")

    const getSidebarElement = (): HTMLElement | null =>
        document.querySelector(".bd-sidebar") as HTMLElement | null

    const getActiveItem = (): HTMLElement | null =>
        document.querySelector(".bd-sidebar a.active") as HTMLElement | null

    const preserveScrollPosition = (): void => {
        const sidebar = getSidebarElement()
        if (!sidebar) return

        scrollPosition.value = sidebar.scrollTop.toString()
    }

    const restoreScrollPosition = (): boolean => {
        const sidebar = getSidebarElement()
        const savedPosition = scrollPosition.value

        if (!savedPosition || !sidebar) return false

        sidebar.scrollTop = parseInt(savedPosition, 10)
        scrollPosition.value = ""
        return true
    }

    const isElementInView = (element: HTMLElement, container: HTMLElement): boolean => {
        const { top: containerTop, bottom: containerBottom } = container.getBoundingClientRect()
        const { top: elementTop, bottom: elementBottom } = element.getBoundingClientRect()

        return elementTop >= containerTop && elementBottom <= containerBottom
    }

    const scrollToActiveIfNeeded = (): void => {
        const activeItem = getActiveItem()
        const sidebar = getSidebarElement()

        if (!activeItem || !sidebar) return

        if (!isElementInView(activeItem, sidebar)) {
            activeItem.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
            })
        }
    }

    return {
        preserveScrollPosition,
        restoreScrollPosition,
        scrollToActiveIfNeeded,
    }
}