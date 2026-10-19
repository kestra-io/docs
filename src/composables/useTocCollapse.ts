import { computed, onMounted, ref } from "vue"
import { useMediaQuery } from "@vueuse/core"

/**
 * The mobile "Table of contents" disclosure shared by the docs and guide
 * TOCs. Below lg the panel collapses behind a toggle; above lg it is always
 * shown while `expanded` stays false, so `collapsed` (what drives `inert`)
 * takes the viewport into account.
 */
export function useTocCollapse() {
    const expanded = ref(false)
    const belowLg = useMediaQuery("(max-width: 991.98px)")
    // The server cannot know the viewport, so `collapsed` stays false until
    // the component is mounted; otherwise the first client render disagrees
    // with the server-rendered `inert` attribute below lg.
    const mounted = ref(false)
    onMounted(() => {
        mounted.value = true
    })
    const collapsed = computed(
        () => mounted.value && belowLg.value && !expanded.value,
    )
    const close = () => {
        expanded.value = false
    }
    return { expanded, belowLg, collapsed, close }
}
