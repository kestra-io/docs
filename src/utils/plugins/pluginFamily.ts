import type { Plugin } from "./plugin"
import { filterPluginsWithoutDeprecated } from "./plugin"
import { PREFIX_MAP } from "./resolveGithubRepo"

// Multi-artifact plugin groups (Debezium, JDBC, Scripts, ...) ship one unrelated
// top-level plugin per sub-technology, named `<artifact-prefix>-<tech>`. Their
// GitHub repo (and the "/plugins/<repo>" URL this synthesizes a page for) is
// named after the family, but the artifact prefix isn't always the same string
// - plugin-scripts ships plugin-script-* (singular). PREFIX_MAP already carries
// this repo <-> artifact-prefix mapping (used to resolve GitHub releases); invert
// it here so family names are limited to that same known set instead of matching
// any arbitrary "/plugins/<prefix>-..." name.
const FAMILY_ARTIFACT_PREFIX: Record<string, string> = Object.fromEntries(
    Object.entries(PREFIX_MAP).map(([artifactPrefix, repo]) => [repo, artifactPrefix]),
)

export function familyArtifactPrefix(familyName: string): string | undefined {
    return FAMILY_ARTIFACT_PREFIX[familyName]
}

/** The family (e.g. "plugin-jdbc") a top-level plugin (e.g. "plugin-jdbc-oracle") belongs to, if any. */
export function familyNameForPlugin(pluginName: string): string | undefined {
    return Object.entries(FAMILY_ARTIFACT_PREFIX).find(
        ([familyName, prefix]) => pluginName !== familyName && pluginName.startsWith(`${prefix}-`),
    )?.[0]
}

export function findFamilySiblings(plugins: Plugin[], familyName: string): Plugin[] {
    const prefix = familyArtifactPrefix(familyName)
    if (!prefix) return []
    return filterPluginsWithoutDeprecated(plugins).filter(
        (p) => !p.subGroup && p.name !== familyName && p.name?.startsWith(`${prefix}-`),
    )
}
