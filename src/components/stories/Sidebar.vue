<template>
    <div class="sidebar">
        <div class="sidebar-logo">
            <img
                v-if="story.logo"
                :src="story.logo"
                :alt="displayName"
                loading="lazy"
            />
            <span v-else class="sidebar-initial">{{ initial }}</span>
        </div>

        <div class="sidebar-company-name">{{ displayName }}</div>
        <div v-if="story.solution" class="sidebar-company-desc">{{ story.solution }}</div>

        <div class="sidebar-fields">
            <div class="sidebar-field">
                <div class="sidebar-field-label">Industry</div>
                <div class="sidebar-field-value">{{ story.industry }}</div>
            </div>
            <div class="sidebar-field">
                <div class="sidebar-field-label">Region</div>
                <div class="sidebar-field-value">{{ story.region }}</div>
            </div>
            <div v-if="story.deployment" class="sidebar-field">
                <div class="sidebar-field-label">Deployment</div>
                <div class="sidebar-field-value">{{ story.deployment }}</div>
            </div>
            <div v-if="story.useCase" class="sidebar-field">
                <div class="sidebar-field-label">Use case</div>
                <div class="sidebar-field-value">{{ story.useCase }}</div>
            </div>
            <div v-if="story.tasks?.length" class="sidebar-field">
                <div class="sidebar-field-label">Tech stack</div>
                <div class="tool-list">
                    <div class="tool-item">
                        <div class="tool-icon kestra-icon">
                            <img
                                src="/landing/usecases/stories/monograme-kestra.svg"
                                alt="Kestra"
                            />
                        </div>
                        <span class="tool-name">Kestra</span>
                    </div>
                    <div
                        v-for="task in story.tasks"
                        :key="task"
                        class="tool-item"
                    >
                        <div class="tool-icon">
                            <TaskIcon :cls="task" />
                        </div>
                        <span class="tool-name">{{ task.split(".").pop() }}</span>
                    </div>
                </div>
            </div>
        </div>

        <Link href="/demo" text="Book a Demo" class="btn btn-primary sidebar-cta" />

        <div class="sidebar-share">
            <Share
                :title="story.title"
                :url="pageUrl"
                title-text="Share this story"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"
    import Link from "~/components/common/Link.vue"
    import Share from "~/components/common/Share.vue"

    const props = defineProps<{
        story: Story
    }>()

    const pageUrl = computed(() =>
        typeof window !== "undefined" ? window.location.href : "",
    )

    const displayName = computed(
        () => props.story.companyName || props.story.title,
    )

    const initial = computed(() => {
        const name = props.story.companyName || props.story.title
        return name.charAt(0).toUpperCase()
    })
</script>

<style scoped lang="scss">
    .sidebar {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .sidebar-logo {
        width: 4.5rem;
        height: 4.5rem;
        border-radius: 0.625rem;
        border: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin-bottom: 0.875rem;
        flex-shrink: 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 6px;
        }
    }

    .sidebar-initial {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--ks-content-link);
    }

    .sidebar-company-name {
        font-size: 1rem;
        font-weight: 700;
        color: var(--ks-content-primary);
        margin-bottom: 0.25rem;
        line-height: 1.3;
    }

    .sidebar-company-desc {
        font-size: 0.8125rem;
        color: var(--ks-content-secondary);
        line-height: 1.5;
        margin-bottom: 1.25rem;
    }

    .sidebar-fields {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.25rem;
    }

    .sidebar-field {
        padding: 0.75rem 0;
        border-top: 1px solid var(--ks-border-secondary);

        &:last-child {
            border-bottom: 1px solid var(--ks-border-secondary);
        }
    }

    .sidebar-field-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--ks-content-primary);
        margin-bottom: 0.2rem;
        line-height: 1.4;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .sidebar-field-value {
        font-size: 0.8125rem;
        color: var(--ks-content-secondary);
        line-height: 1.5;
    }

    .tool-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.375rem;
    }

    .tool-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
    }

    .tool-icon {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.3125rem;
        border: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-body);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
        padding: 3px;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        :deep(.icon-wrapper),
        :deep(.icon) {
            width: 100%;
            height: 100%;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }

        &.kestra-icon {
            background: var(--ks-content-primary);
        }
    }

    .tool-name {
        font-size: 0.8125rem;
        color: var(--ks-content-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 180px;
    }

    .sidebar-cta {
        width: 100%;
        text-align: center;
        justify-content: center;
        margin-bottom: 1.25rem;
    }

    .sidebar-share {
        padding-top: 0.25rem;
    }
</style>
