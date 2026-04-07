<template>
    <div>
        <div class="block" v-for="block in infos" :key="block.title">
            <p class="title">{{ block.title }}</p>
            <p class="sub">{{ block.value }}</p>
        </div>
        <div class="block">
            <p class="title mb-2">Data Stack</p>
            <div class="d-flex flex-column gap-2 justify-content-start">
                <div class="card task">
                    <div class="body">
                        <div
                            class="icon-wrapper kestra-icon"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Kestra"
                        >
                            <img
                                src="/landing/usecases/stories/monograme-kestra.svg"
                                alt="Kestra"
                            />
                        </div>
                        <p class="card-title">Kestra</p>
                    </div>
                </div>
                <div class="card task" v-for="task in story.tasks" :key="task">
                    <div class="body">
                        <TaskIcon :cls="task" />
                        <p class="card-title">
                            {{ task.split(".").pop() ?? "" }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="block">
            <Share
                :title="story.title"
                :url="pageUrl"
                title-text="Share this story"
            />
        </div>
        <div class="block">
            <Link href="/demo" text="Book a Demo" class="btn btn-primary" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"
    import Link from "../common/Link.vue"
    import Share from "~/components/common/Share.vue"

    const props = defineProps<{
        story: Story
    }>()

    const pageUrl = computed(() =>
        typeof window !== "undefined" ? window.location.href : "",
    )

    const infos = computed(() => {
        if (!props.story) return []
        return [
            {
                title: "Industry",
                value: props.story.industry,
            },
            {
                title: "Headquarter",
                value: props.story.headquarter,
            },
            {
                title: "Solution",
                value: props.story.solution,
            },
        ]
    })
</script>

<style scoped lang="scss">
    .block {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
        @include media-breakpoint-up(lg) {
            max-width: 300px;
        }
        margin-bottom: 1.3125rem;
        border-bottom: $block-border;
        padding-bottom: 1.35rem;
        &:last-child {
            margin-bottom: 0;
            border-bottom: none;
            padding-bottom: 0;
        }
        .title, :deep(h6) {
            font-size: $font-size-sm;
            font-weight: 700;
            color: var(--ks-content-primary);
            margin: 0;
        }
        .sub {
            font-size: $font-size-sm;
            color: var(--ks-content-secondary);
            margin: 0;
            line-height: 1.25rem;
            text-wrap: balance;
        }

        .btn {
            width: fit-content;
            
        }
        .card {
            border: none;
            background-color: transparent;
            box-shadow: none;
            width: 100%;
            padding: 0;
            .body {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 0;
                gap: 1rem;
            }
            .card-title {
                font-size: $font-size-sm;
                font-weight: 500;
                margin: 0;
                color: var(--ks-content-primary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 200px;
            }
            &.task {
                background-color: transparent;
                :deep(.icon-wrapper) {
                    width: 1.75rem;
                    height: 1.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: $white;
                    border-radius: 0.25rem;
                    padding: 4px;
                    border: 1.18px solid var(--ks-border-primary);
                }
                .kestra-icon {
                    background: var(--ks-content-primary);
                    border-radius: 0.25rem;
                }
                img {
                    width: 1.75rem;
                    height: 1.75rem;
                    object-fit: contain;
                }
            }
        }
    }
</style>
