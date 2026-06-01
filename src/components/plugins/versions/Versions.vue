<template>
    <div v-if="releaseVersions.length > 0" class="versions-block">
        <strong class="versions-title">Versions</strong>

        <div class="dropdown" ref="root">
            <button
                type="button"
                class="trigger"
                :class="{ open: isOpen }"
                @click="isOpen = !isOpen"
                aria-haspopup="listbox"
                :aria-expanded="isOpen"
            >
                <span
                    v-if="isOnLatest"
                    class="badge latest"
                >Latest</span>
                <span
                    v-else
                    class="badge archived"
                >Archived</span>
                <span class="trigger-version">{{ activeVersion }}</span>
                <MenuUp v-if="isOpen" class="trigger-chevron" />
                <MenuDown v-else class="trigger-chevron" />
            </button>

            <div v-if="isOpen" class="panel" role="listbox">
                <div class="panel-label">Select version</div>
                <a
                    v-for="v in releaseVersions"
                    :key="v?.version"
                    :href="hrefFor(v?.version ?? '')"
                    class="option"
                    :class="{ selected: isActive(v?.version) }"
                    role="option"
                    :aria-selected="isActive(v?.version)"
                >
                    <span class="option-version">v{{ v?.version }}</span>
                    <span v-if="isLatestVersion(v?.version)" class="badge latest small">Latest</span>
                    <span class="option-date">{{ formatDate(v?.publishedAt) }}</span>
                    <Check v-if="isActive(v?.version)" class="option-check" />
                </a>
            </div>
        </div>

        <div class="stats">
            <div class="stats-header">
                <h6 class="stats-version">{{ activeVersion }}</h6>
                <span v-if="isOnLatest" class="badge latest">Latest</span>
                <span v-else class="badge archived">Archived</span>
            </div>
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
    import { computed, onBeforeUnmount, onMounted, ref } from "vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"
    import MenuDown from "vue-material-design-icons/MenuDown.vue"
    import MenuUp from "vue-material-design-icons/MenuUp.vue"
    import Check from "vue-material-design-icons/Check.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
    import type { ReleaseInfo } from "../../../pages/api/github-releases"

    const props = defineProps<{
        releaseVersions: ReleaseInfo[]
        releasesUrl?: string | null
        kestraCore: boolean
        pluginName?: string
        pluginType?: string
        currentTail?: string
        currentVersion?: string
    }>()

    const isOpen = ref(false)
    const isPreviousOpen = ref(false)
    const root = ref<HTMLElement | null>(null)

    const latestVersion = computed(() => props.releaseVersions[0]?.version ?? "")
    const activeVersion = computed(() => props.currentVersion ?? latestVersion.value)
    const activeVersionInfo = computed<ReleaseInfo | undefined>(
        () => props.releaseVersions.find(v => v?.version === activeVersion.value),
    )
    const isOnLatest = computed(() => !props.currentVersion || props.currentVersion === latestVersion.value)
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

    const goTo = (v?: string | null) => {
        if (!v) return
        window.location.href = hrefFor(v)
    }

    const onPreviousToggle = (e: Event) => {
        const target = e?.target as HTMLDetailsElement | null
        isPreviousOpen.value = !!target?.open
    }

    const formatDate = (publishedAt?: string | null): string => {
        if (!publishedAt) return ""
        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }).format(new Date(publishedAt))
    }

    const onDocumentClick = (e: MouseEvent) => {
        if (!isOpen.value) return
        if (root.value && !root.value.contains(e.target as Node)) {
            isOpen.value = false
        }
    }

    const onKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape") isOpen.value = false
    }

    onMounted(() => {
        document.addEventListener("click", onDocumentClick)
        document.addEventListener("keydown", onKeydown)
    })
    onBeforeUnmount(() => {
        document.removeEventListener("click", onDocumentClick)
        document.removeEventListener("keydown", onKeydown)
    })
</script>

<style lang="scss" scoped>
    .versions-title {
        color: var(--ks-content-primary);
        font-size: $font-size-sm;
        font-weight: 600;
        padding-bottom: 0;
    }

    .dropdown {
        margin-bottom: 0.75rem;
        padding-top: 0.75rem;
    }

    .trigger {
        align-items: center;
        background: var(--ks-background-input);
        border: 1px solid var(--ks-border-secondary);
        border-radius: 0.5rem;
        color: var(--ks-content-primary);
        cursor: pointer;
        display: flex;
        font-size: 1.1rem;
        font-weight: 700;
        gap: 0.6rem;
        padding: 0.4rem 0.85rem;
        text-align: left;
        width: 100%;

        &.open {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }

        &:hover {
            background-color: var(--ks-border-primary);
        }

        .trigger-version {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .trigger-chevron :deep(svg) {
            color: var(--ks-content-secondary);
            font-size: 1.2rem;
        }
    }

    .badge {
        align-items: center;
        border-radius: 999px;
        display: inline-flex;
        flex-shrink: 0;
        font-size: $font-size-xs;
        font-weight: 600;
        line-height: 1;
        padding: 0.25rem 0.55rem;

        &.latest {
            background: var(--ks-background-tag-success);
            color: var(--ks-content-tag-success);
        }

        &.archived {
            background: #2E2B00;
            color: #FFF870;
        }

        &.small {
            font-size: 10px;
            padding: 0.15rem 0.45rem;
        }
    }

    .panel {
        background-color: var(--ks-background-primary);
        border: 1px solid var(--ks-border-secondary);
        border-radius: 0.5rem;
        isolation: isolate;
        left: 0;
        margin-top: 4px;
        max-height: 240px;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        position: absolute;
        right: 0;
        top: 100%;
        z-index: 20;

        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .panel-label {
        background-color: var(--ks-background-input);
        border-bottom: 1px solid var(--ks-border-primary);
        border-top-left-radius: 0.45rem;
        border-top-right-radius: 0.45rem;
        color: var(--ks-content-secondary);
        font-size: $font-size-xs;
        padding: 0.4rem 0.85rem;
    }

    .option {
        align-items: center;
        color: var(--ks-content-primary);
        display: flex;
        font-size: $font-size-xs;
        gap: 0.5rem;
        padding: 0.5rem 0.85rem;
        text-decoration: none;
        white-space: nowrap;

        &:hover {
            background: var(--ks-border-primary);
        }

        &.selected {
            background: rgba(132, 5, 255, 0.15);

            .option-version {
                color: var(--ks-content-link);
            }
        }

        .option-version {
            font-size: $font-size-sm;
            font-weight: 700;
        }

        .option-date {
            color: var(--ks-content-secondary);
            font-size: $font-size-xs;
            margin-left: auto;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .option-check :deep(svg) {
            color: var(--ks-content-link);
            font-size: 0.95rem;
        }
    }

    .stats {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;

        .stats-header {
            align-items: center;
            display: flex;
            gap: 0.5rem;
        }

        .stats-version {
            color: var(--ks-content-primary);
            font-size: 1.15rem;
            font-weight: 700;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

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
