<template>
    <div class="story-main">
        <nav class="story-breadcrumb" aria-label="breadcrumb">
            <a href="/customers">← All stories</a>
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
    $purple: #631bff;

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
        color: $purple;
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
        background: rgba($purple, 0.06);
        border-radius: 0.75rem;
        padding: 2rem 2rem;
        margin: 0 0 2.5rem;

        .pull-quote-text {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--ks-content-primary);
            line-height: 1.75;
            margin-bottom: 0.875rem;
            font-style: normal;
        }

        .open-quote,
        .close-quote {
            color: $purple;
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
        h2 {
            font-size: 1.75rem;
            font-weight: 700;
            letter-spacing: -0.025em;
            color: var(--ks-content-primary);
            line-height: 1.2;
            margin-top: 2.5rem;
            margin-bottom: 0.75rem;
            padding-top: 2.5rem;
            border-top: 1px solid var(--ks-border-secondary);

            &:first-child {
                border-top: none;
                padding-top: 0;
                margin-top: 0;
            }
        }

        h3 {
            font-size: 1.125rem;
            font-weight: 700;
            color: var(--ks-content-primary);
            line-height: 1.3;
            margin-top: 1.75rem;
            margin-bottom: 0.5rem;
        }

        h4 {
            font-size: 1rem;
            font-weight: 700;
            color: var(--ks-content-primary);
            margin-top: 1.5rem;
            margin-bottom: 0.4rem;
        }

        p {
            font-size: 0.9375rem;
            color: var(--ks-content-secondary);
            line-height: 1.8;
            margin-bottom: 1.25rem;
        }

        strong {
            color: var(--ks-content-primary);
            font-weight: 700;
        }

        em {
            font-style: italic;
        }

        .inline-quote {
            font-style: italic;
            color: var(--ks-content-primary);
        }

        blockquote {
            border-left: 3px solid rgba($purple, 0.3);
            padding: 0.25rem 0 0.25rem 1.25rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: var(--ks-content-secondary);
        }

        hr {
            border: none;
            border-top: 1px solid var(--ks-border-secondary);
            margin: 2.5rem 0;
        }

        ul,
        ol {
            padding-left: 1.5rem;
            margin-bottom: 1.25rem;

            li {
                font-size: 0.9375rem;
                color: var(--ks-content-secondary);
                line-height: 1.8;
                margin-bottom: 0.375rem;
            }
        }

        code {
            font-size: 0.85em;
            background: var(--ks-background-secondary);
            border: 1px solid var(--ks-border-secondary);
            border-radius: 0.25rem;
            padding: 0.1em 0.35em;
            color: var(--ks-content-primary);
        }

        /* ── SECTION SUBTITLE ── */
        .section-subtitle {
            font-size: 1rem;
            font-weight: 700;
            color: var(--ks-content-primary);
            line-height: 1.5;
            margin-bottom: 1.25rem;
        }

        /* ── PROBLEM LIST ── */
        .problem-list {
            display: flex;
            flex-direction: column;
            margin-bottom: 1.5rem;
        }

        .problem-item {
            border-left: 2px solid rgba($purple, 0.61);
            padding: 0 0 2rem 1.5rem;
            position: relative;

            &:last-child {
                padding-bottom: 0;
            }

            &::before {
                content: '';
                position: absolute;
                left: -5px;
                top: 0.3rem;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba($purple, 0.61);
            }
        }

        .problem-number {
            font-family: "JetBrains Mono", monospace;
            font-size: 0.65rem;
            font-weight: 500;
            color: var(--ks-content-tertiary);
            letter-spacing: 0.1em;
            margin-bottom: 0.3rem;
            display: block;
        }

        .problem-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--ks-content-primary);
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }

        .problem-desc {
            font-size: 0.9375rem;
            color: var(--ks-content-secondary);
            line-height: 1.75;
            margin-bottom: 0;
        }

        .problem-close {
            font-size: 0.9375rem;
            color: var(--ks-content-secondary);
            padding-top: 1.75rem;
            border-top: 1px solid var(--ks-border-secondary);
            line-height: 1.7;
            margin-bottom: 0;
        }

        .problem-close-prefix {
            font-size: 1rem;
            font-weight: 700;
            color: rgba($purple, 0.9);
            margin-bottom: 0.5rem;
        }

        .problem-close-key {
            color: rgba($purple, 0.9);
            font-weight: 600;
        }

        #the-problem,
        #what-kestra-fixed,
        #kestra-in-the-soc-environment {
            margin-bottom: 2rem;
        }

        /* ── FIX LIST ── */
        .fix-list {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            margin-bottom: 2.5rem;
        }

        .fix-item {
            display: flex;
            gap: 1.25rem;
            align-items: flex-start;
        }

        .fix-check {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
            margin-top: 0.1rem;
            border-radius: 50%;
            background: rgba(13, 158, 110, 0.06);
            border: 1px solid rgba(13, 158, 110, 0.18);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            color: rgba(13, 158, 110, 0.6);
        }

        .fix-title {
            font-size: 1.0625rem;
            font-weight: 700;
            color: var(--ks-content-primary);
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }

        .fix-desc {
            font-size: 0.9375rem;
            color: var(--ks-content-secondary);
            line-height: 1.75;
            margin-bottom: 0;
        }

        /* ── RESULTS LIST ── */
        .results-list {
            display: grid;
            grid-template-columns: max-content 1fr;
            gap: 0 1.5rem;
        }

        .result-item {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: subgrid;
            align-items: baseline;
            padding: 1.125rem 0;
            border-bottom: 1px solid var(--ks-border-secondary);

            &:last-child {
                border-bottom: none;
            }
        }

        .result-metric {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--ks-content-primary);
            letter-spacing: -0.02em;
            white-space: nowrap;
        }

        .result-desc {
            font-size: 0.875rem;
            color: var(--ks-content-secondary);
            line-height: 1.6;
            margin-bottom: 0;
        }

        /* ── STACK PILLS ── */
        .stack-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1.25rem 0;
        }

        .stack-pill {
            background: var(--ks-background-secondary);
            border: 1px solid var(--ks-border-secondary);
            border-radius: 6px;
            padding: 0.35rem 0.85rem;
            font-size: 0.775rem;
            font-family: "JetBrains Mono", monospace;
            color: var(--ks-content-secondary);
        }
    }
</style>
