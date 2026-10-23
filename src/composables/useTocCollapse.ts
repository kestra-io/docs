import { computed, ref } from "vue"
import { useMediaQuery, useMounted } from "@vueuse/core"

/** Mobile TOC disclosure. Above lg the panel always shows while `expanded`
 *  stays false, so `collapsed` (which drives `inert`) checks the viewport. */
export function useTocCollapse() {
    const expanded = ref(false)
    const belowLg = useMediaQuery("(max-width: 991.98px)")
    // False until mounted: the server can't know the viewport, so the first
    // client render must match its `inert`.
    const mounted = useMounted()
    const collapsed = computed(
        () => mounted.value && belowLg.value && !expanded.value,
    )
    const close = () => {
        expanded.value = false
    }
    return { expanded, collapsed, close }
}
