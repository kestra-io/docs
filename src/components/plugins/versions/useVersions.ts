import { computed } from "vue"
import type { ReleaseInfo } from "../../../pages/api/github-releases"

export interface VersionProps {
    releaseVersions: ReleaseInfo[]
    releasesUrl?: string | null
    pluginName?: string
    pluginType?: string
    currentTail?: string
    currentVersion?: string
}

// Shared version logic for the versions panel (selector dropdown + details).
export function useVersions(props: VersionProps) {
    const latestVersion = computed(() => props.releaseVersions[0]?.version ?? "")
    const activeVersion = computed(() => props.currentVersion ?? latestVersion.value)
    const activeVersionInfo = computed<ReleaseInfo | undefined>(
        () => props.releaseVersions.find(v => v?.version === activeVersion.value),
    )
    const isOnLatest = computed(
        () => !props.currentVersion || props.currentVersion === latestVersion.value,
    )
    const isActive = (v?: string | null) => !!v && v === activeVersion.value
    const isLatestVersion = (v?: string | null) => !!v && v === latestVersion.value

    const releaseNotesHref = computed(() => {
        const info = activeVersionInfo.value
        if (!info) return undefined
        if (props.releasesUrl) return `${props.releasesUrl}/tag/v${info.version}`
        return info.releaseNotesUrl ?? undefined
    })

    const hrefFor = (v: string) => {
        if (!props.pluginName || !v) return "#"
        const rawTail = props.currentTail ?? props.pluginType ?? ""
        const tail = rawTail ? `/${rawTail.replace(/^\/+/, "")}` : ""
        return v === latestVersion.value
            ? `/plugins/${props.pluginName}${tail}`
            : `/plugins/${props.pluginName}/v${v}${tail}`
    }

    const formatDate = (publishedAt?: string | null): string => {
        if (!publishedAt) return ""
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date(publishedAt))
    }

    return {
        latestVersion,
        activeVersion,
        activeVersionInfo,
        isOnLatest,
        isActive,
        isLatestVersion,
        releaseNotesHref,
        hrefFor,
        formatDate,
    }
}
