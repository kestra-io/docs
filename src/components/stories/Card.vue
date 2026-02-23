<template>
    <div class="story-card d-flex flex-column">
        <div class="card-inner">
            <NuxtImg :src="story.heroImage" :alt="story.title" class="card-image img-fluid" />
        </div>
        <p class="card-text">
            <strong v-if="story.companyName">{{ story.companyName }}: </strong>{{ story.title }}
        </p>
        <div class="card-footer">
            <div class="icon-box" v-for="task in story.tasks.slice(0, 4)" :key="task">
                <TaskIcon :cls="task" />
            </div>
        </div>
        <hr class="card-hr" />
        <div class="bottom">
            <Link
                :href="`/use-cases/stories/${story.id}-${slugify(story.title)}`"
                text="Read the story"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { slugify } from "@kestra-io/ui-libs"
    import TaskIcon from "~/components/common/TaskIcon.vue"
    import Link from "~/components/common/Link.vue"

    const props = defineProps<{
        story: Story
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .story-card {
        height: 434px;
        border-radius: 0.75rem;
        padding: 1rem;
        box-shadow: rgba(99, 99, 99, 0.2) 0rem 0.125rem 0.5rem 0rem;
        background-color: var(--ks-background-secondary);
        color: var(--ks-content-primary);
        .card-inner {
            width: 100%;
            height: 232px;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            .card-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 0.5rem;
            }
        }
        .card-text {
            font-size: 1rem;
            margin-bottom: 1rem;
            line-height: 1.25rem;
            overflow: hidden;
            display: -webkit-box;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .card-footer {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8125rem;
            .icon-box {
                width: 2.75rem;
                height: 2.75rem;
                border-radius: 0.25rem;
                border: 1px solid var(--ks-border-secondary);
                padding: 0.375rem;
                display: flex;
                align-items: center;
                justify-content: center;
                :deep(img),
                :deep(svg),
                :deep(.icon) {
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
        .card-hr {
            border: 1px solid var(--ks-border-secondary);
        }
    }

    .bottom {
        width: 100%;
        gap: 0.3125rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: var(--ks-content-primary);
        font-weight: 700;
        font-size: 1rem;
        .arrow-icon {
            transition: transform 0.3s ease;
        }
    }

    .story-card:hover .arrow-icon {
        transform: translateX(0.125rem);
    }
</style>