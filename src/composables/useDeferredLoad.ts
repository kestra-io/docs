import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue"

const DELAY_MS = 150

// The delay keeps a request from firing for every row the pointer crosses.
export function useDeferredLoad<T>(
    load: () => Promise<T>,
    isLoaded: () => boolean,
) {
    const value = shallowRef<T | null>(null)
    const failed = ref(false)
    let timer: ReturnType<typeof setTimeout> | undefined

    onMounted(() => {
        timer = setTimeout(
            () =>
                load()
                    .then((result) => (value.value = result))
                    .catch(() => (failed.value = true)),
            isLoaded() ? 0 : DELAY_MS,
        )
    })
    onBeforeUnmount(() => clearTimeout(timer))

    return { value, failed }
}
