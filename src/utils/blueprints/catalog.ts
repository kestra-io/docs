import { $fetchApiCached } from "~/utils/fetch"

export async function fetchFullCatalog(): Promise<Blueprint[]> {
    try {
        const PAGE = 200
        const first = await $fetchApiCached<{
            results: Blueprint[]
            total: number
        }>(`/blueprints/versions/latest?size=${PAGE}&page=1&sort=A-Z`)
        const results = first?.results ?? []
        const total = first?.total ?? results.length
        const pages = Math.min(Math.ceil(total / PAGE), 5)
        if (pages > 1) {
            const rest = await Promise.all(
                Array.from({ length: pages - 1 }, (_, i) =>
                    $fetchApiCached<{ results: Blueprint[] }>(
                        `/blueprints/versions/latest?size=${PAGE}&page=${i + 2}&sort=A-Z`,
                    ).catch(() => null),
                ),
            )
            for (const r of rest) results.push(...(r?.results ?? []))
        }
        return results
    } catch {
        return []
    }
}
