<template>
    <section class="stories-section">
        <div class="stories-inner">
            <div class="filter-bar">
                <span class="stories-count">
                    {{ filteredStories.length }} customer
                    {{ filteredStories.length === 1 ? "story" : "stories" }}
                </span>
                <div class="filters">
                    <select
                        v-model="activeIndustry"
                        class="filter-select"
                        :class="{ 'is-active': activeIndustry }"
                        aria-label="Filter by industry"
                    >
                        <option value="">Industries</option>
                        <option v-for="ind in industries" :key="ind" :value="ind">{{ ind }}</option>
                    </select>
                    <select
                        v-model="activeUseCase"
                        class="filter-select"
                        :class="{ 'is-active': activeUseCase }"
                        aria-label="Filter by use case"
                    >
                        <option value="">Use case</option>
                        <option v-for="uc in useCases" :key="uc" :value="uc">{{ uc }}</option>
                    </select>
                    <select
                        v-model="activeRegion"
                        class="filter-select"
                        :class="{ 'is-active': activeRegion }"
                        aria-label="Filter by region"
                    >
                        <option value="">Region</option>
                        <option v-for="reg in regions" :key="reg" :value="reg">{{ reg }}</option>
                    </select>
                    <select
                        v-model="activeCompanySize"
                        class="filter-select"
                        :class="{ 'is-active': activeCompanySize }"
                        aria-label="Filter by company size"
                    >
                        <option value="">Company size</option>
                        <option value="1–50">1–50</option>
                        <option value="51–500">51–500</option>
                        <option value="501–5,000">501–5,000</option>
                        <option value="5,000+">5,000+</option>
                    </select>
                    <button
                        v-if="hasActiveFilter"
                        type="button"
                        class="filter-clear"
                        @click="clearFilters"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            aria-hidden="true"
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                        Clear all
                    </button>
                </div>
            </div>

            <div class="stories-grid">
                <StoryCard
                    v-for="story in filteredStories"
                    :key="story.id"
                    :story="story"
                    :highlighted="highlightedSet.has(story.id)"
                />
            </div>

            <p v-if="filteredStories.length === 0" class="no-results">
                No stories match the selected filters.
            </p>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { ref, computed } from "vue"
    import StoryCard from "~/components/stories/Card.vue"

    const props = defineProps<{
        stories: Story[]
        /** ids of stories rendered as flipping image + quote cards */
        highlightedIds?: string[]
    }>()

    const highlightedSet = computed(() => new Set(props.highlightedIds ?? []))

    const activeIndustry = ref("")
    const activeRegion = ref("")
    const activeUseCase = ref("")
    const activeCompanySize = ref("")

    const hasActiveFilter = computed(
        () =>
            !!(
                activeIndustry.value ||
                activeRegion.value ||
                activeUseCase.value ||
                activeCompanySize.value
            ),
    )

    function clearFilters() {
        activeIndustry.value = ""
        activeRegion.value = ""
        activeUseCase.value = ""
        activeCompanySize.value = ""
    }

    const industries = computed(() => {
        const set = new Set<string>()
        for (const s of props.stories) {
            if (s.industry) set.add(s.industry)
            if (s.industry2) set.add(s.industry2)
        }
        return Array.from(set).sort()
    })

    const regions = computed(() => {
        const set = new Set(props.stories.map((s) => s.region).filter(Boolean))
        return Array.from(set).sort()
    })

    const useCases = computed(() => {
        const set = new Set(props.stories.map((s) => s.useCaseShort).filter(Boolean))
        return Array.from(set).sort()
    })

    const filteredStories = computed(() => {
        return props.stories.filter((s) => {
            const industryMatch =
                !activeIndustry.value ||
                s.industry === activeIndustry.value ||
                s.industry2 === activeIndustry.value
            const regionMatch = !activeRegion.value || s.region === activeRegion.value
            const useCaseMatch = !activeUseCase.value || s.useCaseShort === activeUseCase.value
            const companySizeMatch =
                !activeCompanySize.value || s.companySize === activeCompanySize.value
            return industryMatch && regionMatch && useCaseMatch && companySizeMatch
        })
    })
</script>

<style scoped lang="scss">
    .stories-inner {
        max-width: 1180px;
        margin: 0 auto;
        padding: 3rem 1rem 4.5rem;
    }

    .filter-bar {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .stories-count {
        font-size: 1.0625rem;
        font-weight: 600;
        color: var(--ks-content-primary);
    }

    .filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;

        @include media-breakpoint-down(sm) {
            flex-direction: column;
            align-items: stretch;
        }
    }

    .filter-select {
        appearance: none;
        background: var(--ks-background-input);
        border: 1px solid var(--ks-border-secondary);
        border-radius: 0.5rem;
        padding: 0.6rem 2.5rem 0.6rem 1rem;
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--ks-content-primary);
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2387858f' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.875rem center;
        min-width: 10rem;
        transition: border-color 0.15s;

        &.is-active {
            border-color: var(--ks-border-active);
            font-weight: 600;
        }

        &:focus {
            outline: none;
            border-color: var(--ks-content-link);
        }

        &:hover {
            border-color: var(--ks-content-link);
        }
    }

    .filter-clear {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        background: none;
        border: none;
        padding: 0.5rem 0.25rem;
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--ks-content-primary);
        text-decoration: underline;
        text-underline-offset: 3px;
        cursor: pointer;

        svg {
            width: 0.75rem;
            height: 0.75rem;
        }

        &:hover {
            color: var(--ks-content-link);
        }
    }

    .stories-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.25rem;

        @include media-breakpoint-down(lg) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @include media-breakpoint-down(md) {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    .no-results {
        text-align: center;
        color: var(--ks-content-tertiary);
        padding: 3rem 0;
        font-size: 0.9375rem;
    }
</style>
