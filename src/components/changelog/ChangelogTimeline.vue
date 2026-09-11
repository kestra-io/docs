<template>
    <section class="changelog-hero surface-dark">
        <div class="container">
            <div class="hero-intro">
                <h1>Changelog</h1>
                <p>Product updates and improvements</p>
            </div>

            <div class="hero-controls">
                <div class="search-input">
                    <Magnify />
                    <input
                        v-model="searchQuery"
                        class="form-control"
                        type="search"
                        aria-label="Search releases"
                        placeholder="Search versions, scopes, or commit messages..."
                    />
                </div>

                <div class="hero-actions">
                    <div class="release-filters" role="group" aria-label="Filter releases">
                        <button
                            v-for="option in FILTERS"
                            :key="option.id"
                            type="button"
                            class="filter-chip"
                            :class="[option.id, { active: currentFilter === option.id }]"
                            :aria-pressed="currentFilter === option.id"
                            @click="setFilter(option.id)"
                        >
                            <Check v-if="currentFilter === option.id" class="check-icon" />
                            {{ option.label }}
                        </button>
                    </div>

                    <MarkdownActionsMenu
                        class="changelog-markdown-actions"
                        page-path="/docs/changelog"
                        page-title="Kestra Changelog"
                        label="Copy as Markdown"
                        lazy-markdown
                        :exclude-actions="['edit']"
                    />
                </div>
            </div>
        </div>
    </section>

    <section class="changelog-body">
        <div class="container">
            <div v-if="visibleEntries.length > 0" class="changelog-timeline">
                <ChangelogEntry
                    v-for="entry in visibleEntries"
                    :key="entry.tag"
                    :entry="entry"
                    :open-groups="openGroupsFor(entry)"
                />
            </div>

            <p v-else class="changelog-empty">
                <template v-if="isSearching">
                    No releases match <strong>{{ searchQuery }}</strong>.
                </template>
                <template v-else>No releases found.</template>
            </p>

            <div v-if="remaining > 0" class="changelog-more">
                <button type="button" class="btn btn-secondary" @click="loadMore">
                    Load {{ Math.min(remaining, PAGE_SIZE) }} more
                    {{ remaining === 1 ? "release" : "releases" }}
                    <ChevronDown class="more-icon" />
                </button>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref, watch } from "vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import Check from "vue-material-design-icons/Check.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChangelogEntry from "./ChangelogEntry.vue"
    import MarkdownActionsMenu from "~/components/docs/MarkdownActionsMenu.vue"
    import type { ChangelogEntry as Entry } from "~/utils/changelog/parseRelease"

    const props = defineProps<{
        entries: Entry[]
    }>()

    type FilterId = "all" | "major" | "minor"

    const FILTERS: { id: FilterId; label: string }[] = [
        { id: "all", label: "All" },
        { id: "major", label: "Major" },
        { id: "minor", label: "Minor" },
    ]

    const PAGE_SIZE = 20

    const HIGHLIGHTED_GROUPS = ["breaking-changes", "features"]

    const searchQuery = ref("")
    const currentFilter = ref<FilterId>("all")
    const visibleCount = ref(PAGE_SIZE)

    onMounted(() => {
        const params = new URL(window.location.href).searchParams
        const filter = params.get("filter")
        if (filter === "major" || filter === "minor") {
            currentFilter.value = filter
        }
        searchQuery.value = params.get("q") ?? ""
    })

    const matches = (haystack: string | undefined, needle: string) =>
        !!haystack && haystack.toLowerCase().includes(needle)


    const searchedEntries = computed(() => {
        const query = searchQuery.value.trim().toLowerCase()
        if (!query) {
            return props.entries
        }

        return props.entries.flatMap((entry) => {
            if (matches(entry.title, query) || matches(entry.tag, query)) {
                return [entry]
            }

            const editions = entry.editions
                .map((edition) => ({
                    ...edition,
                    groups: edition.groups
                        .map((group) => ({
                            ...group,
                            changes: group.changes.filter(
                                (change) =>
                                    matches(change.message, query) ||
                                    matches(change.scope, query) ||
                                    matches(change.sha, query),
                            ),
                        }))
                        .filter((group) => group.changes.length > 0),
                }))
                .filter((edition) => edition.groups.length > 0)

            if (editions.length === 0) {
                return []
            }

            const totalChanges = editions.reduce(
                (total, edition) =>
                    total +
                    edition.groups.reduce((count, group) => count + group.changes.length, 0),
                0,
            )

            return [
                {
                    ...entry,
                    editions,
                    totalChanges,
                    // The release-wide summary would contradict the narrowed list.
                    summary: `${totalChanges} matching change${totalChanges === 1 ? "" : "s"}.`,
                },
            ]
        })
    })

    const filteredEntries = computed(() => {
        if (currentFilter.value === "all") {
            return searchedEntries.value
        }
        return searchedEntries.value.filter(
            (entry) => entry.isMajor === (currentFilter.value === "major"),
        )
    })

    const visibleEntries = computed(() =>
        filteredEntries.value.slice(0, visibleCount.value),
    )

    const remaining = computed(
        () => filteredEntries.value.length - visibleEntries.value.length,
    )

    const isSearching = computed(() => searchQuery.value.trim().length > 0)

    const openGroupsFor = (entry: Entry) => {
        // A search only ever keeps matching lines, so every group is worth opening.
        if (isSearching.value) {
            return entry.editions.flatMap((edition) =>
                edition.groups.map((group) => group.id),
            )
        }
        if (entry.tag !== filteredEntries.value[0]?.tag) {
            return []
        }

        const ids = entry.editions
            .flatMap((edition) => edition.groups.map((group) => group.id))
            .filter((id) => HIGHLIGHTED_GROUPS.includes(id))

        if (ids.length > 0) {
            return ids
        }

        const [firstGroup] = entry.editions[0]?.groups ?? []
        return firstGroup ? [firstGroup.id] : []
    }

    const syncUrl = () => {
        const url = new URL(window.location.href)

        if (currentFilter.value === "all") {
            url.searchParams.delete("filter")
        } else {
            url.searchParams.set("filter", currentFilter.value)
        }

        if (searchQuery.value.trim()) {
            url.searchParams.set("q", searchQuery.value.trim())
        } else {
            url.searchParams.delete("q")
        }

        window.history.replaceState({}, "", url.toString())
    }

    const setFilter = (filter: FilterId) => {
        currentFilter.value = filter
    }

    const loadMore = () => {
        visibleCount.value += PAGE_SIZE
    }

    watch([searchQuery, currentFilter], () => {
        visibleCount.value = PAGE_SIZE
        syncUrl()
    })
</script>

<style lang="scss" scoped>
    .changelog-hero {
        // `main` carries a 67px offset for the fixed header; pull the dark band
        // back up so it runs underneath the nav.
        margin-top: calc(
            -1 * var(--top-bar-height, 67px) - var(--announce-height, 0px)
        );
        padding: calc(
                var(--top-bar-height, 67px) + var(--announce-height, 0px) + 5rem
            )
            1rem 4rem;
        background:
            radial-gradient(
                60% 120% at 12% 60%,
                rgba(99, 27, 255, 0.28) 0%,
                rgba(99, 27, 255, 0) 70%
            ),
            linear-gradient(106.32deg, #000000 28.36%, #0f1a2e 79.51%);
        color: $white;

        @include media-breakpoint-down(lg) {
            padding: calc(
                    var(--top-bar-height, 67px) + var(--announce-height, 0px) +
                        3rem
                )
                1rem 3rem;
        }

        .container {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 2rem;
            max-width: 1180px;

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                align-items: stretch;
            }
        }
    }

    .hero-intro {
        h1 {
            margin: 0;
            color: $white;
            font-size: 4rem;
            font-weight: 700;
            line-height: 1.1;

            @include media-breakpoint-down(lg) {
                font-size: 2.5rem;
            }
        }

        p {
            margin: 0.75rem 0 0;
            color: rgba($white, 0.7);
            font-size: 1.125rem;
        }
    }

    .hero-controls {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
        max-width: 33rem;
    }

    .search-input {
        position: relative;

        .magnify-icon {
            position: absolute;
            left: 0.875rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--ks-content-tertiary);
            z-index: 1;
        }

        .form-control {
            padding: 0.625rem 0.875rem 0.625rem 2.5rem;
            border: 1px solid transparent;
            border-radius: $border-radius-lg;
            background: var(--ks-background-input);
            color: var(--ks-content-primary);
            font-size: 0.875rem;

            &::placeholder {
                color: var(--ks-content-tertiary);
            }

            &:focus {
                border-color: var(--ks-border-active);
                box-shadow: none;
            }
        }
    }

    .hero-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .release-filters {
        display: flex;
        gap: 0.5rem;
    }

    .filter-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.25rem 0.75rem;
        border: 1px solid rgba($white, 0.35);
        border-radius: 999px;
        background: transparent;
        color: rgba($white, 0.75);
        font-size: 0.875rem;
        cursor: pointer;
        transition:
            border-color 0.2s ease,
            color 0.2s ease;

        &.major {
            border-color: #3cc699;
            color: #7ee0bd;
        }

        &.minor {
            border-color: #9064ff;
            color: #c4aaff;
        }

        &:hover {
            color: $white;
        }

        &.active {
            background: rgba($white, 0.08);
            color: $white;
            font-weight: 600;
        }

        .check-icon {
            display: flex;

            :deep(svg) {
                width: 14px;
                height: 14px;
            }
        }
    }

    .changelog-markdown-actions {
        padding: 0;
    }

    .changelog-body {
        padding: 4rem 1rem 5rem;
        background: var(--ks-background-body);

        .container {
            max-width: 1000px;
        }
    }

    .changelog-empty {
        margin: 0;
        color: var(--ks-content-secondary);
        text-align: center;
    }

    .changelog-more {
        display: flex;
        justify-content: center;

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.875rem;
        }

        .more-icon {
            display: flex;

            :deep(svg) {
                width: 16px;
                height: 16px;
            }
        }
    }
</style>
