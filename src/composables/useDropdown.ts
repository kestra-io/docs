import { ref, type Ref } from "vue"
import { onClickOutside, useEventListener } from "@vueuse/core"

/** Open/close state for a CSS-positioned menu, with light-dismiss and Escape.
 *  Replaces bootstrap's Dropdown; the menu itself is styled by the caller. */
export function useDropdown(root: Ref<HTMLElement | null | undefined>) {
    const open = ref(false)

    const close = () => (open.value = false)
    const toggle = () => (open.value = !open.value)

    onClickOutside(root, close)
    useEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key !== "Escape" || !open.value) return
        close()
        root.value?.querySelector<HTMLElement>("[aria-expanded]")?.focus()
    })

    return { open, close, toggle }
}
