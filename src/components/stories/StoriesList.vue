<template>
    <section class="list">
        <div class="list-container container px-md-0">
            <div class="row">
                <template v-for="(story, index) in stories" :key="index">
                    <div class="col-12" :class="{ hidden: index >= visibleCount }">
                        <StoryRow :story />
                    </div>
                </template>
            </div>

            <div v-if="stories.length > visibleCount" class="text-center my-5">
                <button @click="showMore" class="btn btn-secondary">
                    Show more
                </button>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import StoryRow from "~/components/stories/StoryRow.vue"

    defineProps<{
        stories: Array<Story>
    }>()

    const visibleCount = ref(5)

    const showMore = () => {
        visibleCount.value += 5
    }
</script>

<style scoped lang="scss">
    .list {
        position: relative;
        width: 100%;
        overflow: hidden;
        .list-container {
            .row {
                gap: 4rem;
                align-items: center;

                .hidden {
                    display: none;
                }
            }
        }
    }
</style>
