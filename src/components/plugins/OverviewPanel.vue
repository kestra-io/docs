<template>
    <div>
        <div class="d-none d-lg-flex align-items-center justify-content-between overview-header">
            <strong class="text-white fw-bold fs-6 h6">OVERVIEW</strong>
            <span aria-describedby="overview-tooltip" class="info-icon-wrapper">
                <InformationOutline class="info-icon" />
            </span>
            <div role="tooltip" id="overview-tooltip">
                <p>
                    Plugins have a Min. Compatible Kestra Version i.e. a Kestra version from where
                    the corresponding plugin version is compatible.
                    <a href="https://kestra.io/docs/releases" target="_blank"> Learn more </a>
                </p>
            </div>
        </div>

        <div class="d-none d-lg-block pt-2 versions">
            <div v-if="releaseVersions.length > 0">
                <strong class="h6 mb-0 pb-0">Versions</strong>
                <div class="d-flex flex-column latest-ver">
                    <div
                        class="d-flex align-items-center justify-content-between latest-ver-header"
                    >
                        <h6>{{ releaseVersions[0]?.version }}</h6>
                        <span class="latest-badge">Latest</span>
                    </div>
                    <small>{{ formatDate(releaseVersions[0]?.publishedAt) }}</small>
                    <a
                        v-if="releasesUrl"
                        :href="`${releasesUrl}/tag/v${releaseVersions[0]?.version}`"
                        target="_blank"
                        class="text-decoration-none"
                    >
                        Release Notes
                        <OpenInNew class="ms-1" />
                    </a>
                    <small v-if="!kestraCore && releaseVersions[0]?.minCoreCompatibilityVersion" class="kestra-ver">
                        Min. Compatible Kestra Version:
                        <span class="core-ver">{{ releaseVersions[0]?.minCoreCompatibilityVersion }}</span>
                    </small>
                </div>
                <details v-if="releaseVersions.length > 1" @toggle="onToggle" class="old-versions">
                    <summary class="older-summary">
                        Previous Versions
                        <component
                            :is="showOlderVersions ? ChevronDown : ChevronRight"
                            class="chevron"
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
                                v-if="releasesUrl"
                                :href="`${releasesUrl}/tag/v${v?.version}`"
                                target="_blank"
                                class="text-decoration-none"
                            >
                                <OpenInNew />
                            </a>
                            <small v-if="!kestraCore && v?.minCoreCompatibilityVersion" class="kestra-ver">
                                Min. Compatible Kestra Version:
                                <span class="core-ver">{{ v?.minCoreCompatibilityVersion }}</span>
                            </small>
                        </div>
                    </div>
                </details>
            </div>
            <div class="managed">
                <div>
                    <p>Created by</p>
                    <span>{{ createdBy }}</span>
                </div>
                <div>
                    <p>Managed by</p>
                    <span>{{ managedBy }}</span>
                </div>
            </div>
        </div>

        <div v-if="categories?.length > 0" class="d-none d-lg-block categories-section">
            <strong class="h6">Plugin Type</strong>
            <div class="categories">
                <span v-for="category in categories" :key="category" class="category-tag">
                    {{ formatCategoryName(category) }}
                </span>
            </div>
        </div>

        <div
            v-if="repoUrl && !repoUrl.includes('plugin-ee')"
            class="d-none d-lg-block links-section"
        >
            <strong class="h6">Links & Resources</strong>
            <div class="links">
                <a
                    v-if="repoUrl"
                    class="resource-btn github"
                    :href="repoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Plugin GitHub repository"
                >
                    <Github class="me-2" />
                    <span>GitHub</span>
                </a>
                <!-- TODO: Not done yet on plugin side
                <a class="resource-btn file" href="/llm.txt" target="_blank" rel="noopener noreferrer" aria-label="Open llm.txt">
                    <FileDocumentOutline class="me-2" />
                    <span>llm.txt</span>
                </a> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from "vue"
    import type { PluginMetadata } from "@kestra-io/ui-libs"
    import { formatCategoryName } from "~/utils/pluginUtils"

    import Github from "vue-material-design-icons/Github.vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
    import InformationOutline from "vue-material-design-icons/InformationOutline.vue"
    import type { ReleaseInfo } from "../../pages/api/github-releases"

    const props = withDefaults(
        defineProps<{
            version?: { versions?: ReleaseInfo[] } | null
            releasesUrl?: string | null
            categories?: string[]
            metadata?: PluginMetadata[]
        }>(),
        {
            version: null,
            releasesUrl: null,
            categories: () => [],
            metadata: () => [],
        },
    )

    const showOlderVersions = ref(false)

    const formatDate = (publishedAt?: string | null): string => {
        if (!publishedAt) return ""
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date(publishedAt))
    }

    const releaseVersions = computed<ReleaseInfo[]>(() => props.version?.versions ?? [])

    const onToggle = (e: Event): void => {
        const target = e?.target as HTMLDetailsElement | null
        showOlderVersions.value = !!target?.open
    }

    const repoUrl = computed((): string | undefined => {
        if (props.releasesUrl) {
            return props.releasesUrl.replace(/\/releases\/?$/, "")
        }
        return undefined
    })

    const metadataItem = computed(() =>
        props.metadata
            ? Array.isArray(props.metadata)
                ? (props.metadata[0] ?? null)
                : props.metadata
            : null,
    )

    const createdBy = computed(() => metadataItem.value?.createdBy ?? "Kestra Core Team")
    const managedBy = computed(() => metadataItem.value?.managedBy ?? "Kestra Core Team")

    const kestraCore = computed(
        () => props.releasesUrl === "https://github.com/kestra-io/kestra/releases",
    )
</script>

<style lang="scss" scoped>
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "~/assets/styles/variable";

    .versions {
        border-bottom: 1px solid $black-3;

        .latest-ver {
            padding: 0.875rem 1rem 1rem 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            .latest-ver-header {
                padding-right: 0.25rem;
            }

            h6 {
                color: $white;
                font-size: 18.4px;
                font-weight: 700;
                margin: 0;
                padding: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .latest-badge {
                align-items: center;
                border: 1px solid var(--ks-border-success);
                border-radius: 40px;
                background: var(--ks-background-success);
                box-shadow: 0 4px 4px rgba($green, 0.2);
                color: var(--ks-content-success);
                display: flex;
                flex-shrink: 0;
                font-size: 12px;
                font-weight: 500;
                justify-content: center;
                margin-top: 2px;
                padding: 0 8px;
            }

            small {
                color: color-palette.$base-gray-300;
                font-size: 12px;
            }

            a {
                color: var(--ks-content-link);
                font-size: 12px;
                text-decoration: none;

                &:hover {
                    color: var(--ks-content-link-hover);
                }
            }
        }

        .kestra-ver {
            color: color-palette.$base-gray-300 !important;
            font-size: 10px !important;
        }

        .core-ver {
            color: color-palette.$base-white;
            font-weight: 600;
            font-size: 10px;
        }

        .old-versions {
            padding: 0 20px;
            padding-bottom: 5px;

            .older-summary {
                align-items: center;
                background-color: rgba($black-2, 0.44);
                border-bottom: 1px solid $black-3;
                border-top: 1px solid $black-3;
                color: $white-3;
                cursor: pointer;
                display: flex;
                font-size: 12px;
                justify-content: space-between;
                list-style: none;
                padding: 0.35rem 1.5rem 0.35rem 0.5rem;

                &:hover {
                    background-color: $black-9;
                }

                &::-webkit-details-marker {
                    display: none;
                }

                :deep(svg) {
                    font-size: 20px;
                }
            }

            .older-versions {
                background-color: rgba($black-2, 0.44);
                max-height: 138px;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 4px;
                }

                &::-webkit-scrollbar-thumb {
                    background: $purple-36;
                    border-radius: 5px;
                }

                .older-version {
                    align-items: start;
                    border-bottom: 1px solid $black-3;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    padding: 0.25rem 0.875rem 0.25rem 0.5rem;

                    &:last-child {
                        border-bottom: none;
                    }

                    &:hover {
                        background-color: $black-9;
                    }

                    strong {
                        color: var(--ks-content-primary);
                        font-size: 12px;
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

                    a {
                        align-self: start;
                        grid-column: 2;
                        grid-row: 1 / 3;
                    }

                    :deep(svg) {
                        color: var(--ks-content-link);
                        font-size: 12px;

                        &:hover {
                            color: var(--ks-content-link-hover);
                        }
                    }
                }
            }
        }

        .managed {
            display: flex;
            flex-direction: column;

            div {
                border-bottom: 1px solid $black-3;
                padding: 1rem 1.5rem;

                &:first-child {
                    border-top: 1px solid $black-3;
                    margin-top: 1.5rem;
                    padding-top: 1rem;
                }

                &:last-child {
                    border-bottom: none;
                }

                p {
                    color: color-palette.$base-gray-300;
                    font-size: 14px;
                    margin: 0;
                }

                span {
                    color: $white;
                    font-size: 14px;
                    font-weight: 600;
                }
            }
        }
    }

    strong.h6 {
        font-size: 14px;
        margin-left: 1.5rem;
        color: var(--ks-content-tertiary);
    }

    .overview-header {
        margin: 0;
        padding: 0;

        .info-icon {
            color: var(--ks-content-secondary);
            font-size: 22px;
            cursor: pointer;
            transition: color 0.2s ease;
            margin-right: 1.25rem;
            margin-top: -0.5rem;

            &:hover {
                color: color-palette.$base-blue-50;
            }
        }
    }

    .categories-section,
    .links-section {
        border-bottom: 1px solid $black-3;
        margin: 1rem 0;
    }

    .categories-section .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 10px 0 20px 0;
        padding: 0.25rem 1rem 0.25rem 1.5rem;

        .category-tag {
            display: inline-block;
            margin-right: 0;
            margin-bottom: 0;
            background: color-palette.$base-purple-800;
            color: $white;
            padding: 0.125rem 0.5rem;
            border-radius: 40px;
            border: 1px solid color-palette.$base-purple-600;
            font-size: 0.625rem;
            font-weight: 500;
            user-select: none;
        }
    }

    .links-section .links {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 10px 0 20px 0;
        padding: 0.25rem 1rem 0.25rem 1.5rem;

        .resource-btn {
            align-items: center;
            background: $black-2;
            border: 1px solid var(--ks-border-primary);
            border-radius: 8px;
            color: $white;
            display: inline-flex;
            font-weight: 600;
            gap: 0.25rem;
            padding: 4px 8px;
            text-decoration: none;
            width: fit-content;

            :deep(svg) {
                font-size: 18px;
            }

            span {
                font-size: 12px;
                font-weight: 600;
            }

            &:hover {
                background: $black-9;
                color: $white;
            }
        }
    }

    [role="tooltip"] {
        visibility: hidden;
        position: absolute;
        top: 2rem;
        left: 0.5rem;
        background: var(--ks-tooltip-background);
        color: var(--ks-content-primary);
        padding: 0.5rem;
        border-radius: 0.25rem;
        max-width: 250px !important;
        border: 1px solid var(--ks-tooltip-border);
        transition: visibility 0.3s;
        z-index: 9999;
    }

    .info-icon-wrapper:hover + [role="tooltip"],
    .info-icon-wrapper:focus + [role="tooltip"],
    [role="tooltip"]:hover,
    [role="tooltip"]:focus {
        visibility: visible;
    }

    .info-icon-wrapper {
        position: relative;
    }

    #overview-tooltip {
        p {
            margin: 0;
            font-size: 12px;
            line-height: 22px;
        }

        a {
            color: var(--ks-content-link);
            text-decoration: none;

            &:hover {
                text-decoration: underline;
                color: var(--ks-content-link-hover);
            }
        }
    }
</style>