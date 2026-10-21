<template>
    <!-- the /plugins listing, for partners: every filter group in the sidebar, a search, a sort and the cards -->
    <section class="lists">
        <div class="container-xxl">
            <aside class="sidebar" aria-label="Filters">
                <div class="sidebar-head">
                    <h6 class="sidebar-title">Filters</h6>
                    <button
                        v-if="activeCount"
                        type="button"
                        class="reset"
                        @click="reset"
                    >
                        Clear ({{ activeCount }})
                    </button>
                </div>
                <fieldset
                    v-for="filter in props.filters"
                    :key="filter.key"
                    class="group"
                >
                    <legend class="group-title">{{ filter.label }}</legend>
                    <div class="list">
                        <label
                            v-for="option in options[filter.key]"
                            :key="option.value"
                            class="item"
                        >
                            <input
                                class="input"
                                type="checkbox"
                                :value="option.value"
                                v-model="selected[filter.key]"
                            />
                            <span class="label">
                                {{ option.value }}
                                <small>{{ option.count }}</small>
                            </span>
                        </label>
                    </div>
                </fieldset>
            </aside>

            <div class="content">
                <div class="top-bar">
                    <h1>{{ props.title }}</h1>
                    <p>{{ props.subtitle }}</p>
                    <div class="search-input">
                        <Magnify class="search-icon" />
                        <input
                            v-model="searchQuery"
                            type="text"
                            :placeholder="props.searchPlaceholder"
                            :aria-label="props.searchPlaceholder"
                        />
                        <Close
                            v-if="searchQuery"
                            class="clear-icon"
                            @click="searchQuery = ''"
                            title="Clear search"
                        />
                        <div class="cta-wrapper">
                            <span class="or-text">or</span>
                            <a
                                :href="props.ctaHref"
                                class="btn btn-sm btn-primary"
                            >
                                {{ props.ctaText }}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-between">
                    <p class="count">
                        {{ filtered.length }} of
                        {{ props.partners.length }} partners
                    </p>
                    <CustomSelect
                        v-model="sortBy"
                        :options="sortOptions"
                        label="Sort by:"
                        id="sortSelect"
                    />
                </div>

                <div class="row">
                    <template v-if="sorted.length">
                        <div
                            class="col-lg-4 col-md-6 mb-3"
                            v-for="partner in sorted"
                            :key="partner.name"
                        >
                            <PartnerCard :partner="partner" />
                        </div>
                    </template>
                    <div v-else class="empty">
                        <p>No partner matches these filters yet.</p>
                        <div class="d-flex gap-2">
                            <button
                                type="button"
                                class="btn btn-sm btn-secondary"
                                @click="reset"
                            >
                                Clear filters
                            </button>
                            <a
                                href="/partners/apply"
                                class="btn btn-sm btn-primary"
                            >
                                Become a partner
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, reactive, ref, onMounted } from "vue"
    import { watchDebounced } from "@vueuse/core"

    import Close from "vue-material-design-icons/Close.vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import CustomSelect from "~/components/common/CustomSelect.vue"
    import PartnerCard from "./PartnerCard.vue"
    import type { ListPartner } from "./partners"

    type FilterKey = "type" | "kind" | "region" | "services"

    const props = defineProps<{
        partners: ListPartner[]
        filters: { key: FilterKey; label: string }[]
        title: string
        subtitle: string
        searchPlaceholder: string
        ctaText: string
        ctaHref: string
    }>()

    const searchQuery = ref("")
    const sortBy = ref("A-Z")
    const sortOptions = [
        { value: "A-Z", label: "Name A-Z" },
        { value: "Z-A", label: "Name Z-A" },
        { value: "country", label: "Country" },
    ]

    const valuesOf = (p: ListPartner, key: FilterKey): string[] =>
        key === "services" ? p.services : [p[key]]

    // one list of ticked values per filter group
    const selected = reactive<Record<FilterKey, string[]>>({
        type: [],
        kind: [],
        region: [],
        services: [],
    })

    // each group's values with how many partners have them, most common first
    const options = computed(() => {
        const out = {} as Record<FilterKey, { value: string; count: number }[]>
        for (const { key } of props.filters) {
            const counts = new Map<string, number>()
            for (const p of props.partners) {
                for (const v of valuesOf(p, key))
                    counts.set(v, (counts.get(v) ?? 0) + 1)
            }
            out[key] = [...counts.entries()]
                .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                .map(([value, count]) => ({ value, count }))
        }
        return out
    })

    // any ticked value within a group, every group, and every word of the search
    const filtered = computed(() => {
        const tokens = searchQuery.value
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean)
        return props.partners.filter((p) => {
            for (const { key } of props.filters) {
                const want = selected[key]
                if (
                    want.length &&
                    !valuesOf(p, key).some((v) => want.includes(v))
                ) {
                    return false
                }
            }
            const haystack = [
                p.name,
                p.type,
                p.kind,
                p.country,
                p.region,
                p.description,
                ...p.services,
            ]
                .join(" ")
                .toLowerCase()
            return tokens.every((t) => haystack.includes(t))
        })
    })

    const sorted = computed(() => {
        const list = [...filtered.value]
        if (sortBy.value === "Z-A")
            return list.sort((a, b) => b.name.localeCompare(a.name))
        if (sortBy.value === "country") {
            return list.sort(
                (a, b) =>
                    a.country.localeCompare(b.country) ||
                    a.name.localeCompare(b.name),
            )
        }
        return list.sort((a, b) => a.name.localeCompare(b.name))
    })

    const activeCount = computed(
        () =>
            props.filters.reduce((n, { key }) => n + selected[key].length, 0) +
            (searchQuery.value ? 1 : 0),
    )

    function reset() {
        for (const { key } of props.filters) selected[key] = []
        searchQuery.value = ""
    }

    // the filters live in the URL, so a filtered list can be shared
    onMounted(() => {
        const params = new URLSearchParams(window.location.search)
        searchQuery.value = params.get("q") ?? ""
        sortBy.value = params.get("sort") ?? "A-Z"
        for (const { key } of props.filters) {
            selected[key] = params.get(key)?.split(",").filter(Boolean) ?? []
        }
    })

    watchDebounced(
        [
            searchQuery,
            sortBy,
            () => props.filters.map(({ key }) => selected[key].join(",")),
        ],
        () => {
            const url = new URL(window.location.href)
            const set = (k: string, v: string) =>
                v ? url.searchParams.set(k, v) : url.searchParams.delete(k)
            set("q", searchQuery.value)
            set("sort", sortBy.value === "A-Z" ? "" : sortBy.value)
            for (const { key } of props.filters)
                set(key, selected[key].join(","))
            window.history.replaceState(window.history.state, "", url)
        },
        { debounce: 300 },
    )
</script>

<style lang="scss" scoped>
    // the layout and sidebar of /plugins (ListsLayout), with checkbox groups instead of one radio list
    section.lists {
        padding: 1.875rem 0.75rem;
        border-bottom: 1px solid var(--ks-border-secondary);

        @include media-breakpoint-down(lg) {
            padding-inline: 1rem;
        }

        .container-xxl {
            display: flex;
            gap: 2rem;
            position: relative;

            @include media-breakpoint-down(lg) {
                flex-direction: column;
            }
        }
    }

    .sidebar {
        min-width: 209px;
        max-width: 240px;
        position: sticky;
        top: calc(4.5rem + var(--announce-height, 0px));
        z-index: 10;
        height: fit-content;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        @include media-breakpoint-down(lg) {
            position: static;
            max-width: none;
            min-width: unset;
            gap: 1rem;
        }

        &-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        &-title {
            margin: 0;
            font-weight: 700;
            font-size: $font-size-sm;
            color: var(--ks-content-primary);
        }

        .reset {
            padding: 0;
            border: 0;
            background: none;
            font-size: $font-size-xs;
            font-weight: 600;
            color: var(--ks-content-link);
            cursor: pointer;
        }

        .group {
            margin: 0;
            padding: 0;
            border: 0;
        }

        .group-title {
            margin-bottom: 0.75rem;
            font-size: $font-size-xs;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: var(--ks-content-tertiary);
        }

        .list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            @include media-breakpoint-down(lg) {
                flex-direction: row;
                flex-wrap: wrap;
            }
        }

        .item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            cursor: pointer;

            .input {
                position: relative;
                flex-shrink: 0;
                width: 1.125rem;
                height: 1.125rem;
                margin: 0;
                border: 2px solid var(--ks-border-secondary);
                border-radius: 4px;
                appearance: none;
                cursor: pointer;
                transition: border-color 0.2s;

                &:checked {
                    border-color: var(--ks-content-link);
                    background: var(--ks-content-link);

                    &::after {
                        content: "";
                        position: absolute;
                        left: 4px;
                        top: 0;
                        width: 5px;
                        height: 10px;
                        border: solid #fff;
                        border-width: 0 2px 2px 0;
                        transform: rotate(45deg);
                    }
                }

                @include media-breakpoint-down(lg) {
                    display: none;
                }
            }

            .label {
                display: flex;
                align-items: baseline;
                gap: 0.375rem;
                font-size: $font-size-sm;
                line-height: normal;
                color: var(--ks-content-primary);

                small {
                    font-size: $font-size-xs;
                    color: var(--ks-content-tertiary);
                }

                // on small screens each value is a pill, as on /plugins
                @include media-breakpoint-down(lg) {
                    padding: 0.25rem 0.875rem;
                    border: 1px solid var(--ks-border-secondary);
                    border-radius: 2rem;
                    white-space: nowrap;
                    background: var(--ks-background-secondary);
                }
            }

            .input:checked + .label {
                @include media-breakpoint-down(lg) {
                    border-color: var(--ks-border-active);
                    background: var(--ks-background-tag-category);
                    color: var(--ks-content-tag-category);
                    font-weight: 600;
                }
            }
        }
    }

    .content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;

        @include media-breakpoint-down(lg) {
            display: contents;
        }
    }

    // the dark banner of /plugins, with soft glows instead of the plugin artwork
    .top-bar {
        display: flex;
        flex-direction: column;
        padding: 4rem 2.625rem;
        border-radius: $border-radius-lg;
        color: $white;
        background:
            radial-gradient(
                ellipse 45% 70% at 100% 0%,
                rgba(146, 72, 220, 0.45),
                transparent 70%
            ),
            radial-gradient(
                ellipse 35% 60% at 80% 100%,
                rgba(58, 64, 220, 0.3),
                transparent 70%
            ),
            #212125;

        @include media-breakpoint-down(lg) {
            padding: 2rem 1.5rem;
            order: -1;
        }

        h1 {
            margin-bottom: 0.5rem;
        }

        > p {
            margin-bottom: 2rem;
            color: var(--ks-content-tertiary);
        }
    }

    .search-input {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        padding: 0.25rem 0.35rem 0.25rem 1rem;
        background: var(--ks-background-input);
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;
        max-width: 612px;

        .search-icon {
            color: var(--ks-content-tertiary);
            font-size: $font-size-lg;
            flex-shrink: 0;
            margin-top: -0.25rem;
        }

        input {
            flex: 1;
            min-height: 2.5rem;
            border: none;
            outline: none;
            color: var(--ks-content-primary);
            font-size: $font-size-md;
            padding: 0 0.5rem;
            min-width: 0;
            background: var(--ks-background-input);

            &::placeholder {
                color: var(--ks-content-tertiary);
            }
        }

        .clear-icon {
            color: var(--ks-content-tertiary);
            font-size: $font-size-md;
            cursor: pointer;
            flex-shrink: 0;
            margin: 0 0.25rem;

            &:hover {
                color: var(--ks-content-primary);
            }
        }

        .cta-wrapper {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-shrink: 0;

            .or-text {
                font-size: $font-size-sm;
                color: var(--ks-content-tertiary);
            }

            // on small screens the button takes its own line, so the search keeps its width
            @include media-breakpoint-down(md) {
                flex-basis: 100%;
                padding: 0.35rem 0.25rem 0.25rem 0;

                .or-text {
                    display: none;
                }

                .btn {
                    width: 100%;
                }
            }
        }
    }

    .count {
        margin: 0;
        font-size: $font-size-sm;
        color: var(--ks-content-tertiary);
    }

    .row > * {
        padding-inline: 8px;
    }

    .empty {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 2rem 0.5rem;

        p {
            margin: 0;
            color: var(--ks-content-secondary);
        }
    }
</style>
