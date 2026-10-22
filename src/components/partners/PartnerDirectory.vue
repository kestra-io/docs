<template>
    <section class="directory" :id="id">
        <div class="container">
            <div class="row g-4">
                <aside class="col-12 col-lg-3">
                    <div class="filters" aria-label="Filter partners">
                        <div class="filters-head">
                            <h2>Filters</h2>
                            <button
                                v-if="activeCount > 0"
                                type="button"
                                class="reset"
                                @click="reset"
                            >
                                Clear ({{ activeCount }})
                            </button>
                        </div>
                        <fieldset v-for="group in groups" :key="group.key" class="group">
                            <legend>{{ group.label }}</legend>
                            <label
                                v-for="option in group.options"
                                :key="option.value"
                                class="option"
                            >
                                <input
                                    type="checkbox"
                                    :value="option.value"
                                    v-model="selected[group.key]"
                                />
                                <span>{{ option.value }}</span>
                                <small>{{ option.count }}</small>
                            </label>
                        </fieldset>
                    </div>
                </aside>

                <div class="col-12 col-lg-9">
                    <div class="toolbar">
                        <div class="search-input">
                            <Magnify class="magnify-icon" />
                            <input
                                :id="`${id}-search`"
                                v-model="query"
                                class="form-control"
                                type="search"
                                :aria-label="searchLabel"
                                :placeholder="searchPlaceholder"
                            />
                        </div>
                        <p class="count" aria-live="polite">
                            {{ results.length }} of {{ partners.length }} partners
                        </p>
                    </div>

                    <div v-if="results.length" class="row g-3">
                        <div
                            v-for="partner in results"
                            :key="partner.name"
                            class="col-12 col-md-6 col-xl-4"
                        >
                            <article class="card">
                                <div class="placeholder">
                                    <img :src="partner.logo" :alt="partner.name" loading="lazy" />
                                </div>
                                <div class="head">
                                    <h3>{{ partner.name }}</h3>
                                    <span class="badge">{{ partner.kind }}</span>
                                </div>
                                <p class="where">{{ partner.country }}</p>
                                <p class="desc">{{ partner.description }}</p>
                                <ul class="tags" aria-label="Services">
                                    <li v-for="s in partner.services" :key="s">{{ s }}</li>
                                </ul>
                                <a
                                    :href="partner.href"
                                    class="visit-link"
                                    :target="partner.href.startsWith('http') ? '_blank' : undefined"
                                    :rel="partner.href.startsWith('http') ? 'noopener noreferrer' : undefined"
                                >
                                    {{ partner.href.startsWith("http") ? `Visit ${partner.name}` : `${partner.name} partner page` }}
                                    <OpenInNew v-if="partner.href.startsWith('http')" />
                                </a>
                            </article>
                        </div>
                    </div>

                    <div v-else class="empty">
                        <p>No partner matches these filters yet.</p>
                        <button type="button" class="btn btn-secondary" @click="reset">
                            Clear filters
                        </button>
                        <a href="/partners/apply" class="btn btn-primary">Become a partner</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, reactive, ref } from "vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"

    export interface DirectoryPartner {
        name: string
        logo: string
        kind: string
        country: string
        region: string
        description: string
        services: string[]
        href: string
    }

    interface FilterGroup {
        key: "kind" | "region" | "services"
        label: string
    }

    const props = withDefaults(
        defineProps<{
            id?: string
            partners: DirectoryPartner[]
            filters: FilterGroup[]
            searchPlaceholder?: string
            searchLabel?: string
        }>(),
        {
            id: "directory",
            searchPlaceholder: "Search by name, country or service",
            searchLabel: "Search partners",
        },
    )

    const query = ref("")
    const selected = reactive<Record<string, string[]>>(
        Object.fromEntries(props.filters.map((f) => [f.key, []])),
    )

    const valuesOf = (p: DirectoryPartner, key: FilterGroup["key"]): string[] =>
        key === "services" ? p.services : [p[key]]

    const groups = computed(() =>
        props.filters.map((f) => {
            const counts = new Map<string, number>()
            for (const p of props.partners) {
                for (const v of valuesOf(p, f.key)) counts.set(v, (counts.get(v) ?? 0) + 1)
            }
            return {
                ...f,
                options: [...counts.entries()]
                    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
                    .map(([value, count]) => ({ value, count })),
            }
        }),
    )

    const activeCount = computed(
        () => Object.values(selected).reduce((n, v) => n + v.length, 0) + (query.value ? 1 : 0),
    )

    const results = computed(() => {
        const q = query.value.trim().toLowerCase()
        return props.partners.filter((p) => {
            for (const f of props.filters) {
                const chosen = selected[f.key]
                if (chosen.length && !valuesOf(p, f.key).some((v) => chosen.includes(v))) return false
            }
            if (!q) return true
            const haystack = [p.name, p.country, p.region, p.kind, p.description, ...p.services]
                .join(" ")
                .toLowerCase()
            return haystack.includes(q)
        })
    })

    const reset = () => {
        query.value = ""
        for (const key of Object.keys(selected)) selected[key] = []
    }
</script>

<style lang="scss" scoped>
    .directory {
        padding: 64px 0 90px;
        background: var(--ks-background-body);
        scroll-margin-top: 100px;
    }

    .filters {
        position: sticky;
        top: 100px;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding: 1.25rem;
        border-radius: 8px;
        border: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-primary);

        @include media-breakpoint-down(lg) {
            position: static;
        }

        .filters-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        h2 {
            font-size: $font-size-md;
            font-weight: 600;
            margin: 0;
        }

        .reset {
            border: 0;
            background: transparent;
            color: var(--ks-content-link);
            font-size: $font-size-xs;
            font-weight: 600;
            padding: 0;
        }

        .group {
            border: 0;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.4rem;

            legend {
                font-size: $font-size-xs;
                font-weight: 600;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                color: var(--ks-content-tertiary);
                margin-bottom: 0.5rem;
            }
        }

        .option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: $font-size-sm;
            color: var(--ks-content-primary);
            cursor: pointer;

            input {
                accent-color: var(--ks-border-active);
            }

            small {
                margin-left: auto;
                color: var(--ks-content-tertiary);
                font-variant-numeric: tabular-nums;
            }
        }
    }

    .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1.25rem;

        .count {
            margin: 0;
            font-size: $font-size-sm;
            color: var(--ks-content-secondary);
            font-variant-numeric: tabular-nums;
        }
    }

    .search-input {
        position: relative;
        flex: 1 1 20rem;
        max-width: 33rem;

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
            border: 1px solid var(--ks-border-secondary);
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

    .card {
        height: 100%;
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-primary);
        box-shadow: 2px 3px 16px 0px var(--ks-shadows-light);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .placeholder {
            height: 120px;
            border-radius: 8px;
            border: 1px solid var(--ks-border-primary);
            background: #f7f7f7;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.25rem;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }

        .head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        h3 {
            font-size: $font-size-md;
            font-weight: 600;
            margin: 0;
            color: var(--ks-content-primary);
        }

        .badge {
            padding: 2px 8px;
            border-radius: 40px;
            font-weight: 600;
            font-size: $font-size-xs;
            background: var(--ks-background-tag-success);
            color: var(--ks-content-tag-success);
        }

        .where {
            margin: 0;
            font-size: $font-size-xs;
            color: var(--ks-content-tertiary);
        }

        .desc {
            margin: 0;
            font-size: $font-size-xs;
            color: var(--ks-content-secondary);
        }

        .tags {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.375rem;

            li {
                font-size: $font-size-xs;
                padding: 2px 8px;
                border-radius: 40px;
                border: 1px solid var(--ks-border-secondary);
                color: var(--ks-content-secondary);
            }
        }

        .visit-link {
            margin-top: auto;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.25rem;
            font-size: $font-size-xs;
            font-weight: 600;
            color: var(--ks-content-link);
            text-decoration: none;
        }
    }

    .empty {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        padding: 2rem;
        border-radius: 8px;
        border: 1px dashed var(--ks-border-secondary);

        p {
            margin: 0;
            color: var(--ks-content-secondary);
        }
    }
</style>
