<template>
    <a
        :href="`/customers/${story.slug}`"
        class="story-card"
        :class="{ 'is-highlighted': highlighted }"
    >
        <div class="card-flip">
            <div class="card-face card-face-stats">
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
                        <p v-if="shortDesc" class="card-short-desc">{{ shortDesc }}</p>
                    </div>
                </div>

                <div class="card-bottom">
                    <div v-if="kpis.length" class="card-kpis">
                        <p v-for="(kpi, i) in kpis" :key="i" class="card-kpi">
                            <span class="card-kpi-value" v-html="kpi.value"></span>
                            <span class="card-kpi-label">{{ kpi.label }}</span>
                        </p>
                    </div>

                    <div v-if="story.tasks?.length" class="card-footer">
                        <span class="card-plugins-label">Plugins Used :</span>
                        <div class="card-tasks">
                            <div
                                v-for="task in story.tasks.slice(0, MAX_TASKS)"
                                :key="task"
                                class="task-icon-wrap"
                            >
                                <TaskIcon :cls="task" />
                            </div>
                            <div
                                v-if="story.tasks.length > MAX_TASKS"
                                class="task-icon-wrap task-more"
                            >
                                +{{ story.tasks.length - MAX_TASKS }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="highlighted" class="card-face card-face-quote">
                <img
                    class="quote-bg"
                    :src="story.heroImage"
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
                <div class="quote-body">
                    <div class="quote-top">
                        <div class="quote-logo">
                            <img
                                v-if="story.logo || story.logoIcon"
                                :src="story.logo ?? story.logoIcon"
                                :alt="displayName"
                                loading="lazy"
                            />
                            <span v-else class="quote-initial">{{ initial }}</span>
                        </div>
                        <div class="card-industries">
                            <span class="card-industry">{{ story.industry }}</span>
                            <span v-if="story.industry2" class="card-industry">{{
                                story.industry2
                            }}</span>
                        </div>
                    </div>
                    <div class="quote-bottom">
                        <p class="quote-text">
                            <span class="quote-mark">“</span>{{ story.quote
                            }}<span class="quote-mark">”</span>
                        </p>
                        <p class="quote-cite">
                            <strong>{{ story.quotePerson }}</strong>
                            <span v-if="story.quotePersonTitle"
                                >, {{ story.quotePersonTitle }}</span
                            >
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"

    const MAX_TASKS = 3
    const MAX_KPIS = 2

    const props = withDefaults(
        defineProps<{
            story: Story
            /** image + quote face at rest, flips to the stats face on hover */
            highlighted?: boolean
        }>(),
        { highlighted: false },
    )

    const displayName = computed(() => props.story.companyName || props.story.title)
    const shortDesc = computed(() => props.story.tagline || props.story.excerpt)

    const initial = computed(() => {
        const name = props.story.companyName || props.story.title
        return name.charAt(0).toUpperCase()
    })

    function parseKpi(raw: string | undefined) {
        if (!raw) return null
        const lines = raw
            .trim()
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
        const value = lines[0]?.replace(/^#{1,6}\s*/, "") ?? ""
        const label = lines.slice(1).join(" ")
        return value ? { value, label } : null
    }

    const kpis = computed(() =>
        (
            [props.story.kpi1, props.story.kpi2, props.story.kpi3, props.story.kpi4]
                .map(parseKpi)
                .filter(Boolean) as { value: string; label: string }[]
        ).slice(0, MAX_KPIS),
    )
</script>

<style scoped lang="scss">
    $card-radius: 0.5rem;
    $card-height: 19.625rem;

    .story-card {
        display: block;
        position: relative;
        height: 100%;
        text-decoration: none;
        color: inherit;
        border-radius: $card-radius;
        outline-offset: 4px;
    }

    .card-flip {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .card-face {
        position: relative;
        height: 100%;
        border-radius: $card-radius;
        overflow: hidden;
    }

    .story-card:not(.is-highlighted) {
        transition: transform 0.2s;

        .card-face-stats {
            transition:
                border-color 0.2s,
                box-shadow 0.2s;
        }

        &:hover,
        &:focus-visible {
            transform: translateY(-2px);

            .card-face-stats {
                border-color: var(--ks-border-active);
                box-shadow: 0 8px 28px rgba(99, 27, 255, 0.12);
            }
        }

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    }

    .story-card.is-highlighted {
        min-height: $card-height;
        perspective: 1200px;

        .card-flip {
            transform-style: preserve-3d;
            transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);

            @media (prefers-reduced-motion: reduce) {
                transition: none;
            }
        }

        &:hover .card-flip,
        &:focus-visible .card-flip {
            transform: rotateY(180deg);
        }

        .card-face {
            position: absolute;
            inset: 0;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }

        /* the stats face sits on the back */
        .card-face-stats {
            transform: rotateY(180deg);
        }
    }

    .card-industries {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 0.25rem;
    }

    .card-industry {
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1rem;
        border-radius: 2.5rem;
        padding: 0.125rem 0.5rem;
        white-space: nowrap;
    }

    .card-face-stats {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 1.5rem 1.5rem;
        background: var(--ks-background-primary);
        border: 1px solid var(--ks-border-secondary);
        box-shadow: 2px 3px 16px rgba(57, 82, 242, 0.1);
        color: var(--ks-content-primary);

        .card-industry {
            color: var(--ks-content-link);
            background: var(--ks-background-purple-light);
        }
    }

    .card-header {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .card-logo {
        width: 5rem;
        height: 5rem;
        border-radius: $card-radius;
        background: #080a0c;
        border: 1px solid var(--ks-border-secondary);
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            padding: 6px;
        }
    }

    .card-initial {
        font-size: 1.5rem;
        font-weight: 700;
        color: #8b5cf6;
        line-height: 1;
    }

    .card-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .card-company {
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.1px;
        line-height: 1.5rem;
        color: var(--ks-content-primary);
    }

    .card-short-desc {
        font-size: 0.75rem;
        line-height: 1rem;
        color: var(--ks-content-secondary);
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .card-bottom {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .card-kpis {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.5rem;
        padding: 1rem 0;
        border-top: 1px solid var(--ks-border-secondary);
        border-bottom: 1px solid var(--ks-border-secondary);
    }

    .card-kpi {
        margin: 0;
        min-width: 0;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: var(--ks-content-primary);
    }

    .card-kpi-value {
        display: block;
        font-weight: 600;
    }

    .card-kpi-label {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .card-plugins-label {
        font-family: $font-family-monospace;
        font-size: 0.75rem;
        line-height: 1rem;
        color: var(--ks-content-secondary);
        white-space: nowrap;
    }

    .card-tasks {
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .task-icon-wrap {
        width: 2.125rem;
        height: 2.125rem;
        border-radius: 0.25rem;
        border: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-body);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.3125rem;

        &.task-more {
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--ks-content-tertiary);
            padding: 0;
        }

        :deep(.icon-wrapper),
        :deep(.icon) {
            width: 100%;
            height: 100%;
        }

        :deep(img) {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    .card-face-quote {
        background: #111115;
        color: #fff;

        .card-industry {
            color: #08090a;
            background: #fff;
            padding-bottom: 0.1875rem;
        }
    }

    .quote-bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.3;
    }

    .quote-body {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        gap: 1rem;
        padding: 1rem 1.5rem 1.5rem;
        background: linear-gradient(to top, rgba(14, 14, 16, 0.3) 17.6%, rgba(14, 14, 16, 0) 100%);
    }

    .quote-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;

        .card-industries {
            flex-shrink: 0;
        }
    }

    .quote-logo {
        width: 5rem;
        height: 5rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            display: block;
            max-width: 100%;
            max-height: 3.625rem;
            object-fit: contain;
        }
    }

    .quote-initial {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.75rem;
        height: 2.75rem;
        border-radius: $card-radius;
        background: rgba(255, 255, 255, 0.12);
        font-size: 1.25rem;
        font-weight: 700;
        color: #fff;
    }

    .quote-bottom {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .quote-text {
        font-size: 1.125rem;
        line-height: 1.75rem;
        color: #fff;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .quote-mark {
        color: #a796ff;
    }

    .quote-cite {
        margin: 0;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #adadbf;

        strong {
            font-weight: 700;
        }
    }
</style>
