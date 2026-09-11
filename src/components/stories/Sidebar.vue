<template>
    <div class="sidebar">
        <div class="sidebar-identity">
            <div class="sidebar-logo">
                <img
                    v-if="story.logoIcon || story.logo"
                    :src="story.logoIcon ?? story.logo"
                    :alt="displayName"
                    loading="lazy"
                />
                <span v-else class="sidebar-initial">{{ initial }}</span>
            </div>
            <div class="sidebar-identity-text">
                <div class="sidebar-company-name">{{ displayName }}</div>
                <div v-if="story.tagline" class="sidebar-company-desc">{{ story.tagline }}</div>
            </div>
        </div>

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
            <div v-if="story.useCaseShort" class="sidebar-field">
                <div class="sidebar-field-label">Use case</div>
                <div class="sidebar-field-value">{{ story.useCaseShort }}</div>
            </div>
            <div v-if="story.tasks?.length" class="sidebar-field sidebar-field-wide">
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
                    <div v-for="task in story.tasks" :key="task" class="tool-item">
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
            <Share :title="story.title" :url="pageUrl" title-text="Share this story" />
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

    const pageUrl = computed(() => (typeof window !== "undefined" ? window.location.href : ""))

    const displayName = computed(() => props.story.companyName || props.story.title)

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

    .sidebar-identity-text {
        min-width: 0;
    }

    .sidebar-logo {
        width: 6.25rem;
        height: 6.25rem;
        border-radius: 0.5rem;
        border: 1px solid var(--ks-border-secondary);
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        margin-bottom: 1rem;
        flex-shrink: 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 8px;
        }
    }

    .sidebar-initial {
        font-size: 2rem;
        font-weight: 700;
        color: #fff;
    }

    .sidebar-company-name {
        font-size: 1.25rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: var(--ks-content-primary);
        margin-bottom: 0.25rem;
        line-height: 1.3;
    }

    .sidebar-company-desc {
        font-size: 0.875rem;
        color: var(--ks-content-secondary);
        line-height: 1.5;
        margin-bottom: 1.5rem;
    }

    .sidebar-fields {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.5rem;
    }

    .sidebar-field {
        padding: 1rem 0;
        border-top: 1px solid var(--ks-border-secondary);

        &:last-child {
            border-bottom: 1px solid var(--ks-border-secondary);
        }
    }

    .sidebar-field-label {
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--ks-content-primary);
        margin-bottom: 0.25rem;
        line-height: 1.4;
    }

    .sidebar-field-value {
        font-size: 0.875rem;
        color: var(--ks-content-secondary);
        line-height: 1.5;
    }

    .tool-list {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        margin-top: 0.5rem;
    }

    .tool-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .tool-icon {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.5rem;
        border: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-body);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
        padding: 6px;

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
        font-size: 0.875rem;
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
        margin-bottom: 1.5rem;
    }

    @include media-breakpoint-down(lg) {
        .sidebar-identity {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .sidebar-logo,
        .sidebar-company-desc {
            margin-bottom: 0;
        }

        .sidebar-fields {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .sidebar-field {
            padding-right: 1rem;
        }

        /* The tech stack, and any field left alone in its row, span both
           columns so each row keeps a full-width separator. */
        .sidebar-field-wide,
        .sidebar-field:nth-child(odd):last-child,
        .sidebar-field:nth-child(odd):has(+ .sidebar-field-wide) {
            grid-column: 1 / -1;
        }

        .tool-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    .sidebar-share {
        padding-top: 0.25rem;
    }
</style>
