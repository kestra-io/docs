<template>
    <section class="lists">
        <div class="container-xxl">
            <aside class="sidebar" aria-label="Filters">
                <div class="sidebar-head">
                    <h6 class="sidebar-title">Filters</h6>
                    <button
                        type="button"
                        class="toggle btn btn-sm btn-secondary"
                        :aria-expanded="filtersOpen"
                        aria-controls="partner-filters"
                        @click="filtersOpen = !filtersOpen"
                    >
                        <Tune />
                        Filters
                        <span v-if="activeCount" class="badge-count">{{
                            activeCount
                        }}</span>
                        <ChevronDown :class="{ open: filtersOpen }" />
                    </button>
                    <button
                        v-if="activeCount"
                        type="button"
                        class="reset"
                        @click="reset"
                    >
                        Clear ({{ activeCount }})
                    </button>
                </div>
                <div
                    id="partner-filters"
                    class="groups"
                    :class="{ open: filtersOpen }"
                >
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
                </div>
            </aside>

            <div class="content">
                <div class="top-bar">
                    <h1>{{ props.title }}</h1>
                    <p>{{ props.subtitle }}</p>
                    <div class="search-input">
                        <Magnify class="search-icon" />
                        <input
                            v-model="searchQuery"
                            type="search"
                            @keydown.esc="searchQuery = ''"
                            :placeholder="props.searchPlaceholder"
                            :aria-label="props.searchPlaceholder"
                        />
                        <Close
                            v-if="searchQuery"
                            class="clear-icon"
                            @click="searchQuery = ''"
                            title="Clear search"
                        />
                        <div v-if="props.ctaHref" class="cta-wrapper">
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

                <p class="count" aria-live="polite">
                    {{ filtered.length }} of {{ props.partners.length }} partners
                </p>

                <div class="row">
                    <template v-if="filtered.length">
                        <div
                            class="col-lg-4 col-md-6 mb-3"
                            v-for="partner in filtered"
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
    import Tune from "vue-material-design-icons/Tune.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import PartnerCard from "./PartnerCard.vue"
    import type { ListPartner } from "./partners"

    type FilterKey = "type" | "region" | "expertise"

    const props = defineProps<{
        partners: ListPartner[]
        filters: { key: FilterKey; label: string }[]
        title: string
        subtitle: string
        searchPlaceholder: string
        ctaText?: string
        ctaHref?: string
    }>()

    const searchQuery = ref("")
    const filtersOpen = ref(false)

    const valuesOf = (p: ListPartner, key: FilterKey): string[] =>
        key === "expertise" ? p.expertise : [p[key]]

    const selected = reactive<Record<FilterKey, string[]>>({
        type: [],
        region: [],
        expertise: [],
    })

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

    const score = (p: ListPartner, tokens: string[]) => {
        const name = p.name.toLowerCase()
        const tags = [p.type, p.country, p.region, ...p.expertise]
            .join(" ")
            .toLowerCase()
        const text = p.description.toLowerCase()
        let total = 0
        for (const t of tokens) {
            if (name.startsWith(t)) total += 4
            else if (name.includes(t)) total += 3
            else if (tags.includes(t)) total += 2
            else if (text.includes(t)) total += 1
            else return 0
        }
        return total
    }

    const filtered = computed(() => {
        const tokens = searchQuery.value
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean)
        return props.partners
            .filter((p) =>
                props.filters.every(({ key }) => {
                    const want = selected[key]
                    return (
                        !want.length ||
                        valuesOf(p, key).some((v) => want.includes(v))
                    )
                }),
            )
            .map((p) => ({ p, s: tokens.length ? score(p, tokens) : 1 }))
            .filter(({ s }) => s > 0)
            .sort((a, b) => b.s - a.s || a.p.name.localeCompare(b.p.name))
            .map(({ p }) => p)
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

    onMounted(() => {
        const params = new URLSearchParams(window.location.search)
        searchQuery.value = params.get("q") ?? ""
        for (const { key } of props.filters) {
            selected[key] = params.get(key)?.split(",").filter(Boolean) ?? []
        }
    })

    watchDebounced(
        [
            searchQuery,
            () => props.filters.map(({ key }) => selected[key].join(",")),
        ],
        () => {
            const url = new URL(window.location.href)
            const set = (k: string, v: string) =>
                v ? url.searchParams.set(k, v) : url.searchParams.delete(k)
            set("q", searchQuery.value)
            for (const { key } of props.filters)
                set(key, selected[key].join(","))
            window.history.replaceState(window.history.state, "", url)
        },
        { debounce: 300 },
    )
</script>

<style lang="scss" scoped>
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
            gap: 0.75rem;

            @include media-breakpoint-down(lg) {
                justify-content: flex-start;

                .sidebar-title {
                    display: none;
                }
            }
        }

        .toggle {
            display: none;
            align-items: center;
            gap: 0.375rem;

            @include media-breakpoint-down(lg) {
                display: inline-flex;
            }

            :deep(svg) {
                width: 1rem;
                height: 1rem;
            }

            .open :deep(svg),
            :deep(.open svg) {
                transform: rotate(180deg);
            }

            .badge-count {
                min-width: 1.25rem;
                padding: 0 0.375rem;
                border-radius: 1rem;
                font-size: $font-size-xs;
                line-height: 1.25rem;
                background: var(--ks-content-link);
                color: #fff;
            }
        }

        .groups {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            @include media-breakpoint-down(lg) {
                display: none;
                gap: 1rem;

                &.open {
                    display: flex;
                }
            }
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
            color: var(--ks-content-tertiary);
            cursor: pointer;

            &:hover {
                color: var(--ks-content-primary);
            }
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

    .top-bar {
        display: flex;
        flex-direction: column;
        padding: 4rem 2.625rem;
        border-radius: $border-radius-lg;
        color: $white;
        // Kestra among partner logos on the right; a fade from the left keeps the
        // text readable when the panel narrows and the logos slide under it
        background:
            linear-gradient(90deg, #28282c 40%, rgba(40, 40, 44, 0) 70%),
            url("./illustrations/find-bg.webp") right center / cover no-repeat
                #28282c;

        @include media-breakpoint-down(lg) {
            padding: 2rem 1.5rem;
            order: -1;
        }

        // on phones, as on the plugins page, only the edge of the logos peeks in on the right
        @include media-breakpoint-down(md) {
            background: url("./illustrations/find-bg.webp") 55% center / cover
                no-repeat #28282c;
        }

        h1 {
            margin-bottom: 0.5rem;
        }

        // the panel stays dark in both themes, so the text is a light tone, not a theme token
        > p {
            margin-bottom: 2rem;
            color: rgba(255, 255, 255, 0.75);
        }

        // keep the text and search on the dark side, clear of the logos
        > * {
            max-width: min(34rem, 52%);

            @include media-breakpoint-down(md) {
                max-width: none;
            }
        }
    }

    .search-input {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        padding: 0.25rem 1rem;
        background: var(--ks-background-input);
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;
        max-width: min(26rem, 52%);

        @include media-breakpoint-down(md) {
            max-width: none;
        }

        .search-icon {
            color: var(--ks-content-tertiary);
            font-size: $font-size-lg;
            flex-shrink: 0;
            margin-top: -0.25rem;
        }

        input {
            flex: 1;
            min-height: 3rem;
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

        // a button inside the field sits closer to its edge
        &:has(.cta-wrapper) {
            padding-right: 0.35rem;
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
