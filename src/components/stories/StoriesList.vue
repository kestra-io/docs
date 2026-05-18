<template>
    <section class="stories-section">
        <div class="stories-inner">
            <div class="filter-bar">
                <span class="stories-count">{{ filteredStories.length }} customer stories</span>
                <div class="filters">
                    <select v-model="activeIndustry" class="filter-select">
                        <option value="">All industries</option>
                        <option v-for="ind in industries" :key="ind" :value="ind">{{ ind }}</option>
                    </select>
                    <select v-model="activeRegion" class="filter-select">
                        <option value="">All regions</option>
                        <option v-for="reg in regions" :key="reg" :value="reg">{{ reg }}</option>
                    </select>
                    <select v-model="activeUseCase" class="filter-select">
                        <option value="">All use cases</option>
                        <option v-for="uc in useCases" :key="uc" :value="uc">{{ uc }}</option>
                    </select>
                    <select v-model="activeCompanySize" class="filter-select">
                        <option value="">All company sizes</option>
                        <option value="1–50">1–50</option>
                        <option value="51–500">51–500</option>
                        <option value="501–5,000">501–5,000</option>
                        <option value="5,000+">5,000+</option>
                    </select>
                </div>
            </div>

            <div class="stories-grid">
                <StoryCard
                    v-for="story in filteredStories"
                    :key="story.id"
                    :story="story"
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
        totalStories: number
    }>()

    const activeIndustry = ref("")
    const activeRegion = ref("")
    const activeUseCase = ref("")
    const activeCompanySize = ref("")

    const industries = computed(() => {
        const set = new Set(props.stories.map((s) => s.industry).filter(Boolean))
        return Array.from(set).sort()
    })

    const regions = computed(() => {
        const set = new Set(props.stories.map((s) => s.region).filter(Boolean))
        return Array.from(set).sort()
    })

    const useCases = computed(() => {
        const set = new Set(props.stories.map((s) => s.useCase).filter(Boolean))
        return Array.from(set).sort()
    })


    const filteredStories = computed(() => {
        return props.stories.filter((s) => {
            const industryMatch = !activeIndustry.value || s.industry === activeIndustry.value
            const regionMatch = !activeRegion.value || s.region === activeRegion.value
            const useCaseMatch = !activeUseCase.value || s.useCase === activeUseCase.value
            const companySizeMatch = !activeCompanySize.value || s.companySize === activeCompanySize.value
            return industryMatch && regionMatch && useCaseMatch && companySizeMatch
        })
    })
</script>

