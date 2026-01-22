import { $fetchApi } from "~/utils/fetch.ts"

interface BlueprintsOptions {
    page?: number
    size?: number
    tags?: string
    q?: string
}

export async function useBlueprintsList(options: BlueprintsOptions = {}): Promise<any> {
    const { page = 1, size = 24, tags = "", q = "" } = options
    const PARAMS = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    })
    if (tags) {
        PARAMS.append("tags", tags)
    }
    if (q) {
        PARAMS.append("q", q)
    }
    return await $fetchApi(`/blueprints/versions/latest?${PARAMS}`).then((DATA) => ({
        ...DATA,
        results: [...DATA.results].sort(() => Math.random() - 0.5),
    }))
}