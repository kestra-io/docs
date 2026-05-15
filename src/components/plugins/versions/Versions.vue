<template>
    <div v-if="releaseVersions.length > 0">
        <strong class="versions-title">Versions</strong>
        <div class="latest-ver">
            <div class="latest-ver-header">
                <h6>{{ releaseVersions[0]?.version }}</h6>
                <span class="latest-badge">Latest</span>
            </div>
            <small>{{ formatDate(releaseVersions[0]?.publishedAt) }}</small>
            <a
                v-if="releasesUrl || releaseVersions[0]?.releaseNotesUrl"
                :href="releasesUrl ? `${releasesUrl}/tag/v${releaseVersions[0]?.version}` : (releaseVersions[0]?.releaseNotesUrl ?? undefined)"
                target="_blank"
                class="release-notes-link"
            >
                Release Notes
                <OpenInNew class="release-notes-icon" />
            </a>
            <small v-if="!kestraCore && releaseVersions[0]?.minCoreCompatibilityVersion" class="kestra-ver">
                Min.compatible Kestra ver.:
                <span class="core-ver">{{ releaseVersions[0]?.minCoreCompatibilityVersion }}</span>
            </small>
        </div>

        <details v-if="releaseVersions.length > 1" @toggle="onToggle" class="old-versions">
            <summary class="older-summary">
                Previous Versions
                <ChevronRight
                    class="chevron"
                    :class="{ open: showOlderVersions }"
                />
            </summary>
            <div class="older-versions">
                <div
                    v-for="v in releaseVersions.slice(1)"
                    :key="v?.version"
                    class="older-version"
                >
                    <strong>{{ v?.version }}</strong>
                    <small>{{ formatDate(v?.publishedAt) }}</small>
                    <a
                        v-if="releasesUrl || v?.releaseNotesUrl"
                        :href="releasesUrl ? `${releasesUrl}/tag/v${v?.version}` : (v?.releaseNotesUrl ?? undefined)"
                        target="_blank"
                        class="older-version-link"
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

    defineProps<{
        releaseVersions: ReleaseInfo[]
        releasesUrl?: string | null
        kestraCore: boolean
    }>()

    const showOlderVersions = ref(false)

    const formatDate = (publishedAt?: string | null): string => {
        if (!publishedAt) return ""
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date(publishedAt))
    }

    const onToggle = (e: Event): void => {
        const target = e?.target as HTMLDetailsElement | null
        showOlderVersions.value = !!target?.open
    }
</script>

<style lang="scss" scoped>
    @use "/src/assets/styles/legacy/_color-palette.scss" as color-palette;

    .versions-title {
        font-size: $font-size-sm;
        font-weight: 600;
        color: var(--ks-content-primary);
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .latest-ver {
        padding: 0.75rem 0 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        h6 {
            color: var(--ks-content-primary);
            font-size: 1.15rem;
            font-weight: 700;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .latest-badge {
            align-items: center;
            background: var(--ks-background-tag-success);
            border-radius: 40px;
            color: var(--ks-content-tag-success);
            display: flex;
            flex-shrink: 0;
            font-size: $font-size-xs;
            font-weight: 600;
            padding: 0 0.5rem;
        }

        small {
            color: var(--ks-content-secondary);
            font-size: $font-size-xs;
        }

        a {
            color: var(--ks-content-link);
            font-size: $font-size-xs;
            text-decoration: none;

            &:hover {
                color: var(--ks-content-link-hover);
            }
        }
    }

    .latest-ver-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .release-notes-icon {
        margin-left: 0.25rem;
    }

    .kestra-ver {
        color: var(--ks-content-secondary);
        font-size: $font-size-xs;
    }

    .core-ver {
        color: var(--ks-content-primary);
        font-weight: 600;
        font-size: $font-size-xs;
    }

    .old-versions {
        padding-bottom: 0.25rem;

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
                    color: color-palette.$base-gray-300;
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