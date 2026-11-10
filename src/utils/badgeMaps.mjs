/**
 * Maps edition prefixes to their labels, Bootstrap colors (used by the remark
 * `::badge` directive and the versioned-doc renderer), the visual `tone` and
 * marketing `link` used by the docs FeatureScopeMarker pills.
 * @type {Record<string, {label: string, color: string, tone?: string, link?: string}>}
 */
export const editionLabelAndColorByPrefix = {
    OSS: { label: "Open Source Edition", color: "primary", tone: "oss", link: "/features" },
    EE: { label: "Enterprise Edition", color: "secondary", tone: "ee", link: "/enterprise" },
    Cloud: { label: "Cloud", color: "secondary", tone: "cloud", link: "/cloud" },
    CLOUD_TEAM: { label: "Cloud Team plan", color: "success" },
    CLOUD_PRO: { label: "Cloud Pro plan", color: "info" },
}
