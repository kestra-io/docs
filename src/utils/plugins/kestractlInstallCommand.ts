/**
 * Builds a kestractl command using Kestra compatibility rather than the
 * symbolic LATEST version, which kestractl intentionally rejects.
 */
export function getKestractlPluginGetCommand(
    coordinate: string | undefined,
    exactVersion?: string,
): string {
    if (!coordinate) return ""

    const version = exactVersion?.trim()
    const versionedCoordinate = version ? `${coordinate}:${version}` : coordinate
    const compatibilityFlag = version ? "" : " --compatible-for $KESTRA_VERSION"

    return `kestractl plugins get ${versionedCoordinate}${compatibilityFlag}`
}
