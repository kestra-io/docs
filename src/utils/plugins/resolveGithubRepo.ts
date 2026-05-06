const EXACT_MAP: Record<string, string> = {
    core: "kestra",
}

const PREFIX_MAP: Record<string, string> = {
    "plugin-jdbc": "plugin-jdbc",
    "plugin-script": "plugin-scripts",
    "plugin-debezium": "plugin-debezium",
    "plugin-transform": "plugin-transform",
}

export function resolveGithubReleaseRepo(pluginName: string): string {
    if (EXACT_MAP[pluginName]) return EXACT_MAP[pluginName]
    if (PREFIX_MAP[pluginName]) return PREFIX_MAP[pluginName]

    for (const [prefix, repo] of Object.entries(PREFIX_MAP)) {
        if (pluginName.startsWith(`${prefix}-`)) return repo
    }

    return pluginName
}

