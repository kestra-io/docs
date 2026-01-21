import { computed } from "vue"

export async function useBlueprintsCounts() {
	const { data } = await useAsyncData<{
		countByPlugins: Record<string, number>
	}>("BlueprintsCounts", () => $fetch("/api/blueprint?counts=true"))

	const counts = computed(() => data.value?.countByPlugins ?? {})

	return {
		counts,
	} as const
}
