/**
 * Maps edition prefixes to their corresponding labels and colors.
 * @type {Record<string, {label: string, color: string}>}
 */
export const editionLabelAndColorByPrefix = {
    OSS: { label: "Open Source Edition", color: "primary" },
    EE: { label: "Enterprise Edition", color: "secondary" },
    CLOUD_TEAM: { label: "Cloud Team plan", color: "success" },
    CLOUD_PRO: { label: "Cloud Pro plan", color: "info" },
}