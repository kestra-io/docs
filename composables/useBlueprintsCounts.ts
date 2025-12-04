import { ref, computed } from 'vue';

interface BlueprintsCounts {
    countsByCls: Record<string, number>;
    countsBySubgroup: Record<string, number>;
    countsByPlugin: Record<string, number>;
    total: number;
}

/**
 * Fetches blueprints counts per plugin element (cls), subgroup, and plugin.
 * Server-side aggregation provides countsByCls, countsBySubgroup, and countsByPlugin.
 * Cache: uses useAsyncData so counts are only fetched once per key.
 */
export async function useBlueprintsCounts() {
    const { data } = await useAsyncData<BlueprintsCounts>('BlueprintsCounts', () => $fetch('/api/blueprints-counts'));

    const defaultCounts: BlueprintsCounts = {
        countsByCls: {},
        countsBySubgroup: {},
        countsByPlugin: {},
        total: 0
    };

    const counts = computed(() => data.value ?? defaultCounts);

    return {
        countsByCls: computed(() => counts.value.countsByCls),
        countsBySubgroup: computed(() => counts.value.countsBySubgroup),
        countsByPlugin: computed(() => counts.value.countsByPlugin),
        isFetched: computed(() => !!data.value)
    } as const;
}
