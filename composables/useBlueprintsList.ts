import { computed, ref, watch, type Ref } from "vue";
import { $fetch } from "~/utils/fetch";

export async function useBlueprintsList(
    { page, size, tags, q }: { page: Ref<number>; size: Ref<number>; tags: Ref<{id: string}[]>; q: Ref<string | null> }
) {
    const apiUrl = computed(() => {
        let apiUrl = `https://api.kestra.io/v1/blueprints/versions/latest?page=${page.value}&size=${size.value}`;
        if (tags.value?.length) {
            apiUrl += `&tags=${tags.value.map(tag => tag.id).join(',')}`;
        }
        if (q.value) {
            apiUrl += `&q=${q.value}`;
        }

        return apiUrl;
    })

    watch(apiUrl, async (newUrl) => {
        console.log("Fetching blueprints from", newUrl);
        const data = await $fetch(newUrl);
        if(!data || !data.results) {
            console.warn("No data received from API");
            blueprints.value = [];
            total.value = 0;
            return;
        }
        blueprints.value = [...data.results].sort(() => Math.random() - 0.5);
        total.value = data.total;
    }, { immediate: true });

    const blueprints = ref<any[]>([]);
    const total = ref(0);

    return {
        blueprints,
        total,
    };
}