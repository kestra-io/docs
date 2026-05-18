<template>
    <div>
        <div class="overview-header">
            <strong class="overview-title">OVERVIEW</strong>
            <span aria-describedby="overview-tooltip" class="info-icon-wrapper">
                <InformationOutline class="info-icon" />
            </span>
            <div role="tooltip" id="overview-tooltip">
                <p>
                    Plugins have a Min. Compatible Kestra Version i.e. a Kestra version from where
                    the corresponding plugin version is compatible.
                    <a href="https://kestra.io/docs/releases" target="_blank">Learn More</a>
                </p>
            </div>
        </div>

        <div class="versions">
            <Versions
                :release-versions="releaseVersions"
                :releases-url="releasesUrl"
                :kestra-core="kestraCore"
            />

            <div class="managed">
                <div>
                    <p>Created by</p>
                    <div class="meta-info">
                        <img :src="createdByIcon" v-if="createdByIcon" alt="author icon" class="author-icon" />
                        <span>{{ createdBy }}</span>
                    </div>
                </div>
                <div>
                    <p>Managed by</p>
                    <div class="meta-info">
                        <img :src="managedByIcon" v-if="managedByIcon" alt="author icon" class="author-icon" />
                        <span>{{ managedBy }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="categories?.length > 0" class="categories-section">
            <p class="type">Plugin Type</p>
            <div class="categories">
                <span v-for="category in categories" :key="category" class="category-tag">
                    {{ formatCategoryName(category) }}
                </span>
            </div>
        </div>

        <div
            v-if="repoUrl && !repoUrl.includes('plugin-ee')"
            class="links-section"
        >
            <p class="type">Links & Resources</p>
            <div class="links">
                <a
                    v-if="repoUrl"
                    class="resource-btn github"
                    :href="repoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Plugin GitHub repository"
                >
                    <Github class="github-icon" />
                    <span>GitHub</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import type { PluginMetadata } from "~/utils/plugins/plugin"
    import { formatCategoryName } from "~/utils/plugins/pluginUtils"
    import Github from "vue-material-design-icons/Github.vue"
    import InformationOutline from "vue-material-design-icons/InformationOutline.vue"
    import Versions from "./Versions.vue"
    import type { ReleaseInfo } from "../../../pages/api/github-releases"
    import kestraIcon from "../assets/kestra.svg"
    import conapiIcon from "../assets/conapi.svg"

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

    const releaseVersions = computed<ReleaseInfo[]>(() => props.version?.versions ?? [])

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

    // Hardcoded branding logic for primary contributors. This should be refactored into 
    // a more scalable API as external contributions expand.
    const createdByIcon = computed(() => {
        if (createdBy.value.includes("Kestra Core Team")) return kestraIcon.src
        if (createdBy.value.includes("Conapi GmbH")) return conapiIcon.src
        return null
    })

    const managedByIcon = computed(() => {
        if (managedBy.value.includes("Kestra Core Team")) return kestraIcon.src
        if (managedBy.value.includes("Conapi GmbH")) return conapiIcon.src
        return null
    })

    const kestraCore = computed(
        () => props.releasesUrl === "https://github.com/kestra-io/kestra/releases",
    )
</script>

<style lang="scss" scoped>
    .overview-title,
    .type {
        font-size: $font-size-sm;
        font-weight: 600;
        color: var(--ks-content-primary);
    }

    .overview-header {
        display: none;

        @include media-breakpoint-up(lg) {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .info-icon {
            color: var(--ks-content-tertiary);
            font-size: $font-size-lg;
            cursor: pointer;
            transition: color 0.2s ease;
            display: block;
            margin-top: -4px;

            &:hover {
                color: var(--ks-content-link-hover);
            }
        }
    }

    .overview-title {
        font-weight: 700;
    }

    .versions {
        display: none;
        padding-top: 0.5rem;

        @include media-breakpoint-up(lg) {
            display: block;
        }

        .managed {
            display: flex;
            flex-direction: column;
            margin-top: 1rem;
            padding: 1.25rem 0;
            border-top: 1px solid var(--ks-border-primary);

            > div {
                &:not(:last-child) {
                    border-bottom: 1px solid var(--ks-border-primary);
                    padding-bottom: 1rem;
                    margin-bottom: 1rem;
                }

                p {
                    color: var(--ks-content-primary);
                    font-size: $font-size-sm;
                    font-weight: 600;
                    margin: 0;
                }

                .meta-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                    font-weight: 500;

                    .author-icon {
                        width: 1.5rem;
                        height: 1.5rem;
                        object-fit: contain;
                    }

                    span {
                        color: var(--ks-content-secondary);
                        font-size: $font-size-xs;
                    }
                }
            }
        }
    }

    .categories-section,
    .links-section {
        display: none;
        padding: 1rem 0;
        border-top: 1px solid var(--ks-border-primary);

        @include media-breakpoint-up(lg) {
            display: block;
        }
    }

    .categories-section .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .category-tag {
            background: var(--ks-background-tag-category);
            border-radius: 40px;
            color: var(--ks-content-tag-category);
            font-size: $font-size-xs;
            font-weight: 600;
            padding: 0.125rem 0.5rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .links-section .links {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .resource-btn {
            align-items: center;
            background: var(--ks-background-secondary);
            border-radius: 0.5rem;
            color: var(--ks-content-primary);
            display: inline-flex;
            font-weight: 600;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            text-decoration: none;
            width: fit-content;

            .github-icon {
                margin-right: 0.5rem;
            }

            :deep(svg) {
                font-size: 1.125rem;
            }

            span {
                font-size: $font-size-xs;
                font-weight: 600;
            }

            &:hover {
                background: var(--ks-border-primary);
                color: var(--ks-content-primary);
            }
        }
    }

    [role="tooltip"] {
        visibility: hidden;
        position: absolute;
        top: 2rem;
        left: 0.5rem;
        background: var(--ks-background-secondary);
        color: var(--ks-content-primary);
        border: 1px solid var(--ks-border-secondary);
        padding: 0.5rem;
        border-radius: 0.25rem;
        max-width: 250px !important;
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
            font-size: $font-size-xs;
            line-height: 1.5;
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