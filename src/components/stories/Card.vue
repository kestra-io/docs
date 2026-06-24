<template>
    <a :href="`/customers/${story.slug}`" class="story-card">
        <div class="card-industries">
            <span class="card-industry">{{ story.industry }}</span>
            <span v-if="story.industry2" class="card-industry">{{ story.industry2 }}</span>
        </div>

        <div class="card-header">
            <div class="card-logo">
                <img
                    v-if="story.logoIcon || story.logo"
                    :src="story.logoIcon ?? story.logo"
                    :alt="displayName"
                    loading="lazy"
                />
                <span v-else class="card-initial">{{ initial }}</span>
            </div>
            <div class="card-info">
                <span class="card-company">{{ displayName }}</span>
                <p class="card-short-desc">{{ story.excerpt || story.tagline }}</p>
            </div>
        </div>

        <p v-if="story.useCase" class="card-use-case">
            <span class="card-use-case-label">→</span> {{ story.useCase }}
        </p>

        <KpiRotator :kpis="kpis" />

        <div class="card-footer">
            <span class="card-plugins-label">Plugins Used :</span>
            <div class="card-tasks">
                <div
                    class="task-icon-wrap"
                    v-for="task in story.tasks.slice(0, 4)"
                    :key="task"
                >
                    <TaskIcon :cls="task" />
                </div>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"
    import KpiRotator from "~/components/stories/KpiRotator.vue"

    const props = defineProps<{
        story: Story
    }>()

    const displayName = computed(() => props.story.companyName || props.story.title)

    const initial = computed(() => {
        const name = props.story.companyName || props.story.title
        return name.charAt(0).toUpperCase()
    })

    function parseKpi(raw: string | undefined) {
        if (!raw) return null
        const lines = raw.trim().split("\n").map((l) => l.trim()).filter(Boolean)
        const value = lines[0]?.replace(/^#{1,6}\s*/, "") ?? ""
        const label = lines.slice(1).join(" ")
        return value ? { value, label } : null
    }

    const kpis = computed(() =>
        [props.story.kpi1, props.story.kpi2, props.story.kpi3, props.story.kpi4]
            .map(parseKpi)
            .filter(Boolean) as { value: string; label: string }[],
    )
</script>

<style scoped lang="scss">
    .story-card {
        display: flex;
        flex-direction: column;
        gap: 0;
        height: 100%;
        padding: 1.5rem;
        border-radius: 1rem;
        border: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-secondary);
        text-decoration: none;
        color: inherit;
        overflow: hidden;
        transition:
            border-color 0.2s,
            box-shadow 0.2s;

        &:hover {
            border-color: var(--ks-content-link);
            box-shadow: 0 4px 20px rgba(99, 27, 255, 0.1);
        }
    }

    .card-industries {
        align-self: flex-end;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 0.375rem;
        margin-top: -1rem;
        margin-right: -1rem;
        margin-bottom: 0.75rem;
    }

    .card-industry {
        font-size: 0.625rem;
        font-weight: 600;
        color: #8405ff;
        background: #ece7f8;
        border: 1px solid rgba(99, 27, 255, 0.15);
        border-radius: 999px;
        padding: 0.2rem 0.625rem;
        white-space: nowrap;
        line-height: 1.5;
    }

    .card-header {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }

    .card-logo {
        width: 5rem;
        height: 5rem;
        border-radius: 0.875rem;
        background: #0d0d0d;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 8px;
        }
    }

    .card-initial {
        font-size: 1.75rem;
        font-weight: 700;
        color: #8b5cf6;
        line-height: 1;
    }

    .card-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        justify-content: center;
    }

    .card-company {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--ks-content-primary);
        line-height: 1.25;
    }

    .card-short-desc {
        font-size: 0.8125rem;
        color: var(--ks-content-secondary);
        line-height: 1.5;
        margin: 0;
        min-height: calc(0.8125rem * 1.5 * 3);
    }

    .card-use-case {
        font-size: 0.8125rem;
        line-height: 1.5;
        color: var(--ks-content-secondary);
        border-top: 1px solid var(--ks-border-secondary);
        margin: 1.25rem 0 0;
        padding: 1rem 0;
        min-height: calc(0.8125rem * 1.5 * 3 + 2rem);
    }

    .card-use-case-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: var(--ks-content-tertiary);
        white-space: nowrap;
    }

    .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
        padding-top: 0.75rem;
        gap: 0.5rem;
    }

    .card-plugins-label {
        font-size: 0.6875rem;
        font-weight: 600;
        color: var(--ks-content-tertiary);
        white-space: nowrap;
    }

    .card-tasks {
        display: flex;
        gap: 0.3rem;
        align-items: center;
    }

    .task-icon-wrap {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.25rem;
        border: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-body);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.2rem;

        :deep(.icon-wrapper),
        :deep(.icon) {
            width: 100%;
            height: 100%;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }

        :deep(img) {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
</style>
