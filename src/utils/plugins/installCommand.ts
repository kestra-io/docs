import type { PluginMetadata } from "./plugin"

/**
 * Builds the CLI command used to install the artifact that provides a plugin type.
 * The most specific metadata group wins because a plugin artifact can expose
 * several nested packages. Core is bundled with Kestra and does not need installation.
 */
export function getPluginInstallCommand(
    pluginType: string | undefined,
    metadata: PluginMetadata[] = [],
): string | undefined {
    if (!pluginType) return undefined

    const matchingMetadata = metadata
        .filter(
            ({ group, artifactGroupId, artifactId }) =>
                typeof group === "string" &&
                pluginType.startsWith(`${group}.`) &&
                Boolean(artifactGroupId) &&
                Boolean(artifactId) &&
                artifactId !== "core",
        )
        .toSorted((a, b) => {
            // Prefer the metadata group with the most specific package name.
            // When multiple groups have the same depth, prefer the longer group.
            const depthA = a.group.split(".").length
            const depthB = b.group.split(".").length
            return depthB - depthA || b.group.length - a.group.length
        })[0]

    if (!matchingMetadata) return undefined

    return `./kestra plugins install ${matchingMetadata.artifactGroupId}:${matchingMetadata.artifactId}:LATEST`
}
