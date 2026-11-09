import type { PluginMetadata } from "./plugin"

function toArtifactCoordinate(
    metadata: PluginMetadata | null | undefined,
): string | undefined {
    if (
        !metadata?.artifactGroupId ||
        !metadata.artifactId ||
        metadata.artifactId === "core"
    ) {
        return undefined
    }

    return `${metadata.artifactGroupId}:${metadata.artifactId}`
}

/**
 * Builds the CLI command used to install the artifact that provides a plugin type.
 * The most specific metadata group wins because a plugin artifact can expose
 * several nested packages. Core is bundled with Kestra and does not need installation.
 *
 * Some artifacts ship tasks outside their own group (e.g. `plugin-script-dotnet`
 * provides `io.kestra.plugin.scripts.csharp`). When no metadata group matches the
 * task package, the artifact of the page documenting it is used instead.
 */
export function getPluginInstallCommand(
    pluginType: string | undefined,
    metadata: PluginMetadata[] = [],
    pageMetadata?: PluginMetadata | null,
): string | undefined {
    if (!pluginType) return undefined

    const groupMatches = metadata.filter(
        ({ group }) =>
            typeof group === "string" && pluginType.startsWith(`${group}.`),
    )

    if (!groupMatches.length) return toArtifactCoordinate(pageMetadata)

    const matchingMetadata = groupMatches
        .filter((m) => toArtifactCoordinate(m))
        .toSorted((a, b) => b.group.length - a.group.length)[0]

    return toArtifactCoordinate(matchingMetadata)
}
