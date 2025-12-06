import { buildPluginMappings, type PluginMappings } from "@kestra-io/ui-libs";

async function fetchData<T>(url: string, fallbackValue: T): Promise<T> {
    try {
        return await $fetch<T>(url);
    } catch (e) {
        console.warn("Failed to fetch from API", e);
        return fallbackValue;
    }
}

function resolveBlueprintTasks(tasks: string[] = [], shortNameToCls: Record<string, string[]>): Set<string> {
    return new Set(
        tasks.flatMap((task) => {
            if (!task) return [] as string[];
            if (task.includes(".")) return [task];
            return shortNameToCls[task.toLowerCase()] ?? [task];
        })
    );
}

export default defineEventHandler(async () => {
    const config = useRuntimeConfig();

    const [plugins, blueprintsData] = await Promise.all([
        fetchData(`${config.public.apiUrl}/plugins/subgroups`, []),
        fetchData(`${config.public.apiUrl}/blueprints/versions/latest?page=1&size=500`, { results: [] })
    ]);

    const { clsToSubgroup, clsToPlugin, shortNameToCls }: PluginMappings = buildPluginMappings(
        plugins
    );

    const results = (blueprintsData?.results as Array<{ includedTasks?: string[] }>) ?? [];

    const countsByCls: Record<string, number> = {};
    const countsByPlugin: Record<string, number> = {};
    const countsBySubgroup: Record<string, number> = {};

    for (const blueprint of results) {
        const clsSet = resolveBlueprintTasks(blueprint.includedTasks, shortNameToCls);
        const pluginSet = new Set<string>();
        const subgroupSet = new Set<string>();

        for (const cls of clsSet) {
            countsByCls[cls] = (countsByCls[cls] ?? 0) + 1;

            const plugin = clsToPlugin[cls];
            if (plugin?.slug) pluginSet.add(plugin.slug);

            const subgroup = clsToSubgroup[cls];
            if (subgroup) subgroupSet.add(plugin?.slug ? `${plugin.slug}-${subgroup}` : subgroup);
        }

        for (const p of pluginSet) countsByPlugin[p] = (countsByPlugin[p] ?? 0) + 1;
        for (const s of subgroupSet) countsBySubgroup[s] = (countsBySubgroup[s] ?? 0) + 1;
    }

    return {
        countsByCls,
        countsBySubgroup,
        countsByPlugin,
        total: results.length
    };
});
