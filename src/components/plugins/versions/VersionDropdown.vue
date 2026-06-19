<template>
    <div class="dropdown" ref="root">
        <button
            type="button"
            class="trigger"
            :class="{ open }"
            @click="emit('update:open', !open)"
            aria-haspopup="listbox"
            :aria-expanded="open"
        >
            <span class="trigger-version">{{ activeVersion }}</span>
            <span v-if="isOnLatest" class="badge latest">Latest</span>
            <span v-else class="badge archived">Archived</span>
            <MenuUp v-if="open" class="trigger-chevron" />
            <MenuDown v-else class="trigger-chevron" />
        </button>

        <div v-if="open" class="panel" role="listbox">
            <input
                ref="searchInput"
                v-model="query"
                type="text"
                class="panel-search"
                placeholder="Search version"
                aria-label="Search version"
            />
            <div class="panel-options">
                <a
                    v-for="v in filteredVersions"
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
                </a>
                <div v-if="filteredVersions.length === 0" class="panel-empty">
                    No matching versions
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
    import MenuDown from "vue-material-design-icons/MenuDown.vue"
    import MenuUp from "vue-material-design-icons/MenuUp.vue"
    import type { ReleaseInfo } from "../../../pages/api/github-releases"
    import { useVersions } from "./useVersions"

    const props = defineProps<{
        releaseVersions: ReleaseInfo[]
        open?: boolean
        pluginName?: string
        pluginType?: string
        currentTail?: string
        currentVersion?: string
    }>()

    const emit = defineEmits<{ "update:open": [boolean] }>()

    const { activeVersion, isOnLatest, isActive, isLatestVersion, hrefFor, formatDate } =
        useVersions(props)

    const root = ref<HTMLElement | null>(null)
    const searchInput = ref<HTMLInputElement | null>(null)
    const query = ref("")

    const filteredVersions = computed(() => {
        const q = query.value.trim().toLowerCase()
        if (!q) return props.releaseVersions
        return props.releaseVersions.filter((v) => v?.version?.toLowerCase().includes(q))
    })

    // Reset the filter and focus the search each time the panel opens.
    watch(
        () => props.open,
        (isOpen) => {
            if (!isOpen) return
            query.value = ""
            nextTick(() => searchInput.value?.focus())
        },
    )

    const onDocumentClick = (e: MouseEvent) => {
        if (!props.open) return
        if (root.value && !root.value.contains(e.target as Node)) {
            emit("update:open", false)
        }
    }

    const onKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape") emit("update:open", false)
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
    .dropdown {
        margin-bottom: 0.75rem;
        padding-top: 0.75rem;
        position: relative;
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
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .trigger-chevron {
            margin-left: auto;
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
        left: auto;
        margin-top: 4px;
        max-width: min(420px, 90vw);
        min-width: 100%;
        overflow: hidden;
        position: absolute;
        right: 0;
        top: 100%;
        width: max-content;
        z-index: 20;
    }

    /* Search stays fixed, only the options scroll. */
    .panel-options {
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;

        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .panel-search {
        background-color: var(--ks-background-input);
        border: none;
        border-bottom: 1px solid var(--ks-border-primary);
        border-top-left-radius: 0.45rem;
        border-top-right-radius: 0.45rem;
        color: var(--ks-content-primary);
        font-size: $font-size-xs;
        outline: none;
        padding: 0.45rem 0.85rem;
        width: 100%;

        &::placeholder {
            color: var(--ks-content-secondary);
        }
    }

    .panel-empty {
        color: var(--ks-content-secondary);
        font-size: $font-size-xs;
        padding: 0.6rem 0.85rem;
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
            flex-shrink: 0;
            font-size: $font-size-xs;
            margin-left: auto;
            white-space: nowrap;
        }
    }
</style>
