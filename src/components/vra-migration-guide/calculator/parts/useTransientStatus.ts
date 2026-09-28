import { onBeforeUnmount, ref } from "vue"

export function useTransientStatus(ms = 4000) {
    const status = ref("")
    let timer: ReturnType<typeof setTimeout> | undefined

    function show(message: string) {
        status.value = message
        clearTimeout(timer)
        timer = setTimeout(() => {
            if (status.value === message) status.value = ""
        }, ms)
    }

    onBeforeUnmount(() => clearTimeout(timer))

    return { status, show }
}
