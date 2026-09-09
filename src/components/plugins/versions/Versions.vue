<template>
    <div v-if="releaseVersions.length > 0" class="versions-block">
        <strong class="versions-title">Versions</strong>

        <VersionDropdown
            v-model:open="isOpen"
            :release-versions="releaseVersions"
            :plugin-name="pluginName"
            :plugin-type="pluginType"
            :current-tail="currentTail"
            :current-version="currentVersion"
        />

        <div class="stats">
            <small class="stats-date">{{ formatDate(activeVersionInfo?.publishedAt) }}</small>
            <a
                v-if="releaseNotesHref"
                :href="releaseNotesHref"
                target="_blank"
                class="stats-link"
            >
                Release Notes
                <OpenInNew class="stats-link-icon" />
            </a>
            <small v-if="!kestraCore && activeVersionInfo?.minCoreCompatibilityVersion" class="stats-core">
                Min.compatible Kestra ver.:
                <span class="core-ver">{{ activeVersionInfo?.minCoreCompatibilityVersion }}</span>
            </small>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"
    import type { ReleaseInfo } from "../../../utils/plugins/repoReleases"
    import VersionDropdown from "./VersionDropdown.vue"
    import { useVersions } from "./useVersions"

    const props = defineProps<{
        releaseVersions: ReleaseInfo[]
        releasesUrl?: string | null
        kestraCore: boolean
        pluginName?: string
        pluginType?: string
        currentTail?: string
        currentVersion?: string
    }>()

    const { activeVersionInfo, releaseNotesHref, formatDate } = useVersions(props)

    const isOpen = ref(false)
</script>

<style lang="scss" scoped>
    .versions-title {
        color: var(--ks-content-primary);
        font-size: $font-size-sm;
        font-weight: 600;
        padding-bottom: 0;
    }

    .stats {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;

        .stats-date {
            color: var(--ks-content-secondary);
            font-size: $font-size-xs;
        }

        .stats-link {
            align-items: center;
            color: var(--ks-content-link);
            display: inline-flex;
            font-size: $font-size-xs;
            gap: 0.2rem;
            text-decoration: none;
            width: fit-content;

            &:hover {
                color: var(--ks-content-link-hover);
            }

            .stats-link-icon :deep(svg) {
                font-size: 0.9rem;
            }
        }

        .stats-core {
            color: var(--ks-content-secondary);
            font-size: $font-size-xs;

            .core-ver {
                color: var(--ks-content-primary);
                font-weight: 600;
            }
        }
    }

</style>
