import type { Plugin } from "./plugin"
import { filterPluginsWithoutDeprecated } from "./plugin"

type ArtifactRelease = { artifactId: string; repository?: string }
export type ArtifactsResponse = { artifacts: Record<string, ArtifactRelease[]> }

export type FamilyIndex = {
    /** Plugin name -> family name, only for plugins whose repo ships more than one artifact. */
    familyByPlugin: Record<string, string>
    /** Family name -> its member plugin names. */
    membersByFamily: Record<string, string[]>
}

const repoFamilyName = (repository: string): string =>
    repository.replace(/\/+$/, "").split("/").pop() ?? repository

/**
 * Multi-artifact plugin groups (Debezium, JDBC, Scripts, Transform, ...) ship one
 * independent top-level plugin per sub-technology from a single shared GitHub repo,
 * instead of a single plugin exposing subgroups, so there is no natural "/plugins/<repo>"
 * page for them and no shared ancestor in the nav tree.
 *
 * Detected here from real release metadata (any repo backing more than one artifact)
 * rather than a maintained name-prefix allowlist, so a new multi-module repo is picked
 * up automatically as soon as its 2nd artifact ships a release, while a single-artifact
 * repo (plugin-redis, plugin-aws, ...) is never affected.
 */
export function buildFamilyIndex(response: ArtifactsResponse): FamilyIndex {
    const artifactIdsByRepo: Record<string, Set<string>> = {}
    for (const versions of Object.values(response.artifacts ?? {})) {
        const latest = versions[0]
        if (!latest?.repository) continue
        ;(artifactIdsByRepo[latest.repository] ??= new Set()).add(latest.artifactId)
    }

    const familyByPlugin: Record<string, string> = {}
    const membersByFamily: Record<string, string[]> = {}
    for (const [repository, artifactIds] of Object.entries(artifactIdsByRepo)) {
        if (artifactIds.size < 2) continue
        const family = repoFamilyName(repository)
        // A repo's aggregator module can publish an artifact literally named after the
        // repo itself; that one is the (non-existent as a page) family root, not a sibling.
        const members = [...artifactIds].filter((id) => id !== family)
        if (members.length === 0) continue
        membersByFamily[family] = members
        for (const id of members) familyByPlugin[id] = family
    }
    return { familyByPlugin, membersByFamily }
}

/** The family (e.g. "plugin-jdbc") a top-level plugin (e.g. "plugin-jdbc-oracle") belongs to, if any. */
export function familyNameForPlugin(pluginName: string, index: FamilyIndex): string | undefined {
    return index.familyByPlugin[pluginName]
}

export function findFamilySiblings(plugins: Plugin[], familyName: string, index: FamilyIndex): Plugin[] {
    const members = new Set(index.membersByFamily[familyName] ?? [])
    if (members.size === 0) return []
    return filterPluginsWithoutDeprecated(plugins).filter(
        (p) => !p.subGroup && members.has(p.name),
    )
}
