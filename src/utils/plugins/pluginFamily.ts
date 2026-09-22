import type { Plugin } from "./plugin"

// Multi-artifact plugin groups (Debezium, JDBC, Scripts, ...) ship one unrelated
// top-level plugin per sub-technology, named `plugin-<family>-<tech>`. Their GitHub
// repo is named after the family (e.g. kestra-io/plugin-scripts), but the artifacts
// inside don't always share that exact prefix — plugin-scripts ships plugin-script-*
// (singular). Map the repo/family name to the artifact prefix it actually uses.
const FAMILY_PREFIX_ALIASES: Record<string, string> = {
    "plugin-scripts": "plugin-script",
}

export function familyArtifactPrefix(familyName: string): string {
    return FAMILY_PREFIX_ALIASES[familyName] ?? familyName
}

export function findFamilySiblings(plugins: Plugin[], familyName: string): Plugin[] {
    const prefix = `${familyArtifactPrefix(familyName)}-`
    return plugins.filter((p) => !p.subGroup && p.name !== familyName && p.name?.startsWith(prefix))
}
