import { $fetch } from "~/utils/fetch.ts";

export async function useBlueprintsList({ page = 1, size = 24, tags = '', q = '' } = {}) {
    let apiUrl = `https://api.kestra.io/v1/blueprints/versions/latest?page=${page}&size=${size}`;
    if (tags) {
        apiUrl += `&tags=${tags}`;
    }
    if (q) {
        apiUrl += `&q=${q}`;
    }
    const data = await $fetch(apiUrl);

    if (!data.results) {
        return { results: [], total: 0 };
    }

    const shuffledResults = [...data.results].sort(() => Math.random() - 0.5);
    return Object.assign({}, data, { results: shuffledResults });
}