    import { computed } from 'vue';

    /**
     * Fetches blueprints counts per plugin element (cls), subgroup, and plugin.
     * Server-side aggregation provides countsByCls, countsBySubgroup, and countsByPlugin.
     */
    export function useBlueprintsCounts() {
        const { data } = useAsyncData<{
            countsByCls: Record<string, number>;
            countsBySubgroup: Record<string, number>;
            countsByPlugin: Record<string, number>;
            total: number;
        }>(
            'BlueprintsCounts', 
            () => $fetch('/api/blueprints-counts'),
        );

        const counts = computed(() => data.value ?? {
            countsByCls: {},
            countsBySubgroup: {},
            countsByPlugin: {},
            total: 0
        });

        return {
            countsByCls: computed(() => counts.value.countsByCls),
            countsBySubgroup: computed(() => counts.value.countsBySubgroup),
            countsByPlugin: computed(() => counts.value.countsByPlugin),
            isFetched: computed(() => !!data.value)
        } as const;
    }
