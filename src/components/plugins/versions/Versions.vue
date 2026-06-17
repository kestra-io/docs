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

        <div v-if="!isOpen" class="stats">
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

        <details v-if="releaseVersions.length > 1" @toggle="onPreviousToggle" class="old-versions">
            <summary class="older-summary">
                Previous Versions
                <ChevronRight class="chevron" :class="{ open: isPreviousOpen }" />
            </summary>
            <div class="older-versions">
                <div
                    v-for="v in releaseVersions.slice(1)"
                    :key="v?.version"
                    class="older-version"
                    @click="goTo(v?.version)"
                >
                    <strong>{{ v?.version }}</strong>
                    <small>{{ formatDate(v?.publishedAt) }}</small>
                    <a
                        v-if="releasesUrl || v?.releaseNotesUrl"
                        :href="releasesUrl ? `${releasesUrl}/tag/v${v?.version}` : (v?.releaseNotesUrl ?? undefined)"
                        target="_blank"
                        class="older-version-link"
                        @click.stop
                    >
                        <OpenInNew />
                    </a>
                    <small v-if="!kestraCore && v?.minCoreCompatibilityVersion" class="kestra-ver">
                        Min.compatible Kestra ver.:
                        <span class="core-ver">{{ v?.minCoreCompatibilityVersion }}</span>
                    </small>
                </div>
            </div>
        </details>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
    import type { ReleaseInfo } from "../../../pages/api/github-releases"
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

    const { activeVersionInfo, releaseNotesHref, hrefFor, formatDate } = useVersions(props)

    const isOpen = ref(false)
    const isPreviousOpen = ref(false)

    const goTo = (v?: string | null) => {
        if (!v) return
        window.location.href = hrefFor(v)
    }

    const onPreviousToggle = (e: Event) => {
        const target = e?.target as HTMLDetailsElement | null
        isPreviousOpen.value = !!target?.open
    }
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

    .old-versions {
        padding-bottom: 0.25rem;
        padding-top: 1rem;

        .older-summary {
            align-items: center;
            background: var(--ks-background-input);
            border: 1px solid var(--ks-border-secondary);
            border-radius: 0.25rem;
            color: var(--ks-content-secondary);
            cursor: pointer;
            display: flex;
            font-size: $font-size-sm;
            justify-content: space-between;
            list-style: none;
            padding: 0.25rem 0.75rem 0.25rem 1rem;

            &:hover {
                background-color: var(--ks-border-primary);
            }

            &::-webkit-details-marker {
                display: none;
            }

            .chevron {
                :deep(svg) {
                    font-size: 1.25rem;
                }
                &.open {
                    transform: rotate(90deg);
                }
            }
        }

        .older-versions {
            background-color: rgba(var(--ks-background-secondary), 0.44);
            max-height: 138px;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-thumb {
                background: var(--ks-content-color-highlight);
                border-radius: 5px;
            }

            .older-version {
                align-items: start;
                cursor: pointer;
                display: grid;
                grid-template-columns: 1fr auto;
                padding: 0.25rem;

                &:hover {
                    background-color: var(--ks-border-primary);
                }

                strong {
                    color: var(--ks-content-primary);
                    font-size: $font-size-xs;
                    font-weight: 700;
                    grid-column: 1;
                    margin: 0;
                }

                small {
                    color: var(--ks-content-tertiary);
                    font-size: 10px;
                    font-weight: normal;
                    grid-column: 1;
                }

                .kestra-ver {
                    font-size: 10px;
                }

                a {
                    align-self: start;
                    grid-column: 2;
                    grid-row: 1 / 3;
                    text-decoration: none;
                }

                :deep(svg) {
                    color: var(--ks-content-link);
                    font-size: $font-size-xs;

                    &:hover {
                        color: var(--ks-content-link-hover);
                    }
                }
            }
        }
    }
</style>
