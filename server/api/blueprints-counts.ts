    import {buildPluginMappings} from "@kestra-io/ui-libs";

    const fetchData = async <T>(url: string, fallback: T): Promise<T> =>
        $fetch<T>(url).catch((e) => {
            console.warn("Failed to fetch from API", e);
            return fallback;
        });

    const resolveBlueprintTasks = (tasks: string[] = [], shortNameToCls: Record<string, string[]>): Set<string> =>
        new Set(
            tasks.flatMap((task) =>
                task ? (task.includes(".") ? [task] : shortNameToCls[task.toLowerCase()] ?? [task]) : []
            )
        );

    export default defineEventHandler(async () => {
        const config = useRuntimeConfig();

        const [plugins, blueprintsData] = await Promise.all([
            fetchData(`${config.public.apiUrl}/plugins/subgroups`, []),
            fetchData(`${config.public.apiUrl}/blueprints/versions/latest?page=1&size=500`, {results: []})
        ]);

        const {clsToSubgroup, clsToPlugin, shortNameToCls} = buildPluginMappings(plugins);

        const results = blueprintsData.results ?? [];

        const counts = results.reduce(
            (acc, blueprint) => {
                const clsSet = resolveBlueprintTasks(blueprint.includedTasks, shortNameToCls);
                const pluginSet = new Set<string>();
                const subgroupSet = new Set<string>();

                for (const cls of clsSet) {
                    acc.cls[cls] = (acc.cls[cls] ?? 0) + 1;

                    const plugin = clsToPlugin[cls];
                    if (plugin?.slug) {
                        pluginSet.add(plugin.slug);
                    }

                    const subgroup = clsToSubgroup[cls];
                    if (subgroup) subgroupSet.add(plugin?.slug 
                        ? `${plugin.slug}-${subgroup}` 
                        : subgroup
                    );
                }

                for (const p of pluginSet) acc.plugin[p] = (acc.plugin[p] ?? 0) + 1;
                for (const s of subgroupSet) acc.subgroup[s] = (acc.subgroup[s] ?? 0) + 1;

                return acc;
            },
            {
                cls: {} as Record<string, number>,
                plugin: {} as Record<string, number>,
                subgroup: {} as Record<string, number>
            }
        );

        return {
            countsByCls: counts.cls,
            countsBySubgroup: counts.subgroup,
            countsByPlugin: counts.plugin,
            total: results.length
        };
    });
