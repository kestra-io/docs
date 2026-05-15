<template>
    <div class="story-main">
        <nav class="story-breadcrumb" aria-label="breadcrumb">
            <a href="/use-cases/stories">← All stories</a>
        </nav>

        <h1 class="story-headline">{{ story.title }}</h1>

        <p v-if="story.intro" class="story-opening">{{ story.intro }}</p>

        <div v-if="kpis.length" class="metrics-card">
            <div
                v-for="(kpi, i) in kpis"
                :key="i"
                class="metric-cell"
            >
                <span class="metric-value">{{ kpi.value }}</span>
                <div class="metric-label">{{ kpi.label }}</div>
                <div v-if="kpi.context" class="metric-context">{{ kpi.context }}</div>
            </div>
        </div>

        <blockquote v-if="story.quote" class="pull-quote">
            <p class="pull-quote-text">
                <span class="open-quote">"</span>{{ story.quote }}<span class="close-quote">"</span>
            </p>
            <footer class="pull-quote-attr">
                <strong>{{ story.quotePerson }}</strong>
                <span v-if="story.quotePersonTitle"> · {{ story.quotePersonTitle }}</span>
            </footer>
        </blockquote>

        <MDCParserAndRenderer v-if="content" :content="content" class="bd-markdown" />
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

    const props = defineProps<{
        story: Story
        content?: string
    }>()

    function parseKpi(raw: string | undefined): { value: string; label: string; context?: string } | null {
        if (!raw) return null
        const lines = raw.trim().split("\n").map((l) => l.trim()).filter(Boolean)
        const value = lines[0]?.replace(/^#{1,6}\s*/, "") ?? ""
        const label = lines[1] ?? ""
        const context = lines[2] ?? undefined
        return value ? { value, label, context } : null
    }

    const kpis = computed(() =>
        [props.story.kpi1, props.story.kpi2, props.story.kpi3, props.story.kpi4]
            .map(parseKpi)
            .filter(Boolean) as { value: string; label: string; context?: string }[],
    )
</script>

<style scoped lang="scss">
    .story-main {
        min-width: 0;
        width: 100%;
    }

    .story-breadcrumb {
        font-size: 0.875rem;
        color: var(--ks-content-tertiary);
        margin-bottom: 1.5rem;

        a {
            color: var(--ks-content-tertiary);
            text-decoration: none;
            transition: color 0.15s;

            &:hover {
                color: var(--ks-content-primary);
            }
        }
    }

    .story-headline {
        font-size: clamp(1.75rem, 3.5vw, 2.5rem);
        font-weight: 700;
        line-height: 1.12;
        letter-spacing: -0.025em;
        color: var(--ks-content-primary);
        margin-bottom: 1.5rem;
    }

    .story-opening {
        font-size: 1rem;
        color: var(--ks-content-secondary);
        line-height: 1.8;
        margin-bottom: 2rem;
    }

    .metrics-card {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        border: 1px solid var(--ks-border-secondary);
        border-radius: 0.75rem;
        overflow: hidden;
        margin-bottom: 2.5rem;
    }

    .metric-cell {
        padding: 1.375rem 1.5rem;
        border-right: 1px solid var(--ks-border-secondary);

        &:last-child {
            border-right: none;
        }

        @include media-breakpoint-down(md) {
            border-right: none;
            border-bottom: 1px solid var(--ks-border-secondary);

            &:last-child {
                border-bottom: none;
            }
        }
    }

    .metric-value {
        display: block;
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: -0.03em;
        color: var(--ks-content-link);
        line-height: 1;
        margin-bottom: 0.4rem;
    }

    .metric-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--ks-content-primary);
        line-height: 1.4;
        margin-bottom: 0.25rem;
    }

    .metric-context {
        font-size: 0.75rem;
        color: var(--ks-content-tertiary);
        line-height: 1.5;
    }

    .pull-quote {
        background: rgba(99, 27, 255, 0.04);
        border: 1px solid rgba(99, 27, 255, 0.12);
        border-radius: 0.75rem;
        padding: 1.5rem 1.75rem;
        margin: 0 0 2.5rem;

        .pull-quote-text {
            font-size: 1.0625rem;
            font-weight: 700;
            color: var(--ks-content-primary);
            line-height: 1.75;
            margin-bottom: 0.875rem;
            font-style: normal;
        }

        .open-quote,
        .close-quote {
            color: var(--ks-content-link);
        }

        .open-quote {
            margin-right: 0.15rem;
        }

        .close-quote {
            margin-left: 0.15rem;
        }

        .pull-quote-attr {
            font-size: 0.875rem;
            color: var(--ks-content-secondary);
            line-height: 1.4;
        }
    }

    :deep(.bd-markdown) {
        h2,
        h3,
        h4 {
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: var(--ks-content-primary);
        }

        p {
            font-size: 0.9375rem;
            color: var(--ks-content-secondary);
            line-height: 1.8;
            margin-bottom: 1.25rem;
        }

        blockquote {
            border-left: 3px solid rgba(99, 27, 255, 0.3);
            padding: 0.25rem 0 0.25rem 1.25rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: var(--ks-content-secondary);
        }
    }
</style>
