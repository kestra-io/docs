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

    const industries = computed(() => {
        const set = new Set(props.stories.map((s) => s.industry).filter(Boolean))
        return Array.from(set).sort()
    })

    const regions = computed(() => {
        const set = new Set(props.stories.map((s) => s.region).filter(Boolean))
        return Array.from(set).sort()
    })

    const filteredStories = computed(() => {
        return props.stories.filter((s) => {
            const industryMatch = !activeIndustry.value || s.industry === activeIndustry.value
            const regionMatch = !activeRegion.value || s.region === activeRegion.value
            return industryMatch && regionMatch
        })
    })
</script>

