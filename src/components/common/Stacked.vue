<script setup lang="ts">
    import Link from "~/components/common/Link.vue"

    import SourceBranch from "vue-material-design-icons/SourceBranch.vue"
    import CogSyncOutline from "vue-material-design-icons/CogSyncOutline.vue"
    import ChartTimelineVariantShimmer from "vue-material-design-icons/ChartTimelineVariantShimmer.vue"

    const CARDS = [
        {
            fills: ["#58BBE6", "#A9D4FF"],
            title: 'Ship <span class="color">Data</span> Pipelines Faster and Keep them Reliable',
            description:
                "Run ingestion, transformations, dbt, Airbyte, Spark and quality checks in one workflow engine.",
            badge: {
                text: "Data Orchestration",
                icon: SourceBranch,
                colors: ["#59BCE6", "#1F46F0"],
            },
            cta: {
                text: "Explore data use cases",
                href: "/use-cases/data-orchestration",
            },
            features: [
                { value: "10x", label: "Faster Pipeline Delivery" },
                { value: "90%", label: "Fewer Manual backfills" },
            ],
        },
        {
            fills: ["#F5FD60", "#FFFFD1"],
            title: 'Automate <span class="color">Infrastructure</span> With Governance, Not Scripts',
            description:
                "Standardize Terraform, Ansible, CI/CD and operational workflows across hybrid and air-gapped environments.",
            badge: {
                text: "Infrastructure Engineering",
                icon: CogSyncOutline,
                colors: ["#E6C359", "#FFFEE9"],
            },
            cta: {
                text: "Explore infrastructure use cases",
                href: "/use-cases/infrastructure-orchestration",
            },
            features: [
                {
                    value: "6x",
                    label: "faster infrastructure delivery",
                },
                {
                    value: "90%",
                    label: "lower legacy tooling cost",
                },
            ],
        },
        {
            fills: ["#08ED94", "#D1FFED"],
            title: 'Operationalize <span class="color">AI Workflows</span> Without Production Chaos',
            description:
                "Agents, RAG pipelines, evaluation, publishing, retraining all orchestrated with governance and observability.",
            badge: {
                text: "AI Automation",
                icon: ChartTimelineVariantShimmer,
                colors: ["#59E659", "#85FED1"],
            },
            cta: {
                text: "Explore AI automation use cases",
                href: "/use-cases/ai-orchestration",
            },
            features: [
                { value: "50x", label: "less pipeline maintenance" },
                { value: "3x", label: "faster AI delivery cycles" },
            ],
        },
    ]
</script>

<template>
    <section class="stacked">
        <div class="container">
            <slot name="title">
                <h2>
                    Built for
                    <span class="highlight">Data</span>,
                    <span class="highlight">Infrastructure</span>, and
                    <span class="highlight">AI Teams</span>
                </h2>
            </slot>
            <slot name="description">
                <p>
                    One orchestrator, many workflows. The platform stays the same,
                    only the workflows change.
                </p>
            </slot>
        </div>
        <div v-for="(card, index) in CARDS" :key="index" class="stacked-card">
            <div class="badge">
                <component :is="card.badge.icon" />
                <span>{{ card.badge.text }}</span>
            </div>
            <div class="bg-svg"></div>
            <div class="content">
                <h3 v-html="card.title"></h3>
                <p>{{ card.description }}</p>
                <div class="cards-row">
                    <div
                        v-for="(feature, fIndex) in card.features"
                        :key="fIndex"
                        class="feature-card"
                    >
                        <h2 class="color">{{ feature.value }}</h2>
                        <p class="color">{{ feature.label }}</p>
                    </div>
                </div>
                <Link
                    :text="card.cta.text"
                    :href="card.cta.href"
                    class="card-link"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>


    .stacked {
        width: 100%;
        padding: 4rem;
        @include media-breakpoint-down(md) {
            padding: 4rem 0.75rem;
        }
        @include media-breakpoint-up(xl) {
            padding: 5.4375rem 7.5rem;
        }
        background: var(--ks-background-primary)
            url("~/assets/landing/infrastructure/grid.svg") no-repeat top;

        .container {
            max-width: 1480px;
            margin: 0 auto;
            text-align: center;
            padding-bottom: 3.75rem;
        }

        .stacked-card {
            position: sticky;
            max-width: 1400px;
            min-height: 400px;
            @include media-breakpoint-up(lg) {
                min-height: 700px;
            }
            padding: 5rem 1.5rem 2.5rem;
            @include media-breakpoint-up(lg) {
                padding: 0 4rem 0 6.875rem;
            }
            border-radius: 1rem;
            background: linear-gradient(
                67.65deg,
                #0e0e10 54.53%,
                #393939 175.42%
            );
            margin: 0 auto;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            @include media-breakpoint-up(lg) {
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
            }

            .badge {
                position: absolute;
                top: 1.5rem;
                left: 1.5rem;
                @include media-breakpoint-up(lg) {
                    top: 2.5rem;
                    left: 2.5rem;
                }
                padding: 0.375rem 1.125rem;
                gap: 0.625rem;
                display: flex;
                align-items: center;
                border-radius: 2.5rem;
                border: 1px solid transparent;
                background:
                    linear-gradient(#0e0e11, #0e0e11) padding-box,
                    var(
                            --badge-gradient,
                            linear-gradient(90deg, #59bce6 0%, #1f46f0 100%)
                        )
                        border-box;
                z-index: 10;

                span {
                    font-size: $font-size-xs;
                    white-space: nowrap;
                    color: var(--badge-text-color, #59bce6);
                    font-family: $font-family-monospace;
                }

                :deep(svg) {
                    color: var(--badge-text-color, #59bce6);
                    font-size: 1rem;
                }
            }

            .card-link {
                width: fit-content;
                align-self: flex-end;
                @include media-breakpoint-up(lg) {
                    position: absolute;
                    bottom: 2.5rem;
                    right: 2.5rem;
                    align-self: auto;
                }
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                border: 1px solid var(--color, #58bbe6);
                color: var(--color, #58bbe6) !important;
                font-size: $font-size-sm;
                z-index: 10;
            }

            .bg-svg {
                position: absolute;
                top: -2rem;
                right: -2rem;
                pointer-events: none;
                z-index: -1;
                width: 100%;
                height: 100%;
                @include media-breakpoint-up(lg) {
                    width: 1400px;
                    height: 700px;
                }
                background-image: var(--bg-svg-image);
                background-size: cover;
                background-position: top right;
                opacity: 0.5;
                @include media-breakpoint-up(lg) {
                    opacity: 1;
                }
            }

            .content {
                max-width: 100%;
                @include media-breakpoint-up(lg) {
                    max-width: 510px;
                }
                width: 100%;
                min-height: 100%;
                gap: 1.5rem;
                @include media-breakpoint-up(lg) {
                    gap: 2rem;
                }
                display: flex;
                flex-direction: column;
                justify-content: center;
                color: $white;

                .cards-row {
                    display: flex;
                    flex-direction: column;
                    @include media-breakpoint-up(md) {
                        flex-direction: row;
                    }
                    gap: 1rem;

                    .feature-card {
                        width: 100%;
                        @include media-breakpoint-up(md) {
                            width: 243px;
                        }
                        height: auto;
                        min-height: 6.25rem;
                        @include media-breakpoint-up(md) {
                            height: 8.125rem;
                        }
                        padding: 1rem 1.5rem;
                        @include media-breakpoint-up(lg) {
                            padding: 1rem 2rem;
                        }
                        border-radius: 0.625rem;
                        background: #1c1c20;
                        border: 1px solid var(--grey-600, #3b3a41);
                        box-shadow: 2px 3px 16px 0px
                            var(--ks-shadows-light-inverse);
                    }
                }
            }

            $shadows: (#59bce6, #e6c359, #88e659);
            $highlight-colors: (#52bfee, #f5fd60, #57f795);
            $badge-gradient-starts: (#59bce6, #e6c359, #59e659);
            $badge-gradient-ends: (#1f46f0, #fffee9, #85fed1);
            $cta-colors: (#58bbe6, #f5fd60, #3ada7a);
            $svg-images: (
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='700' viewBox='0 0 1400 700' fill='none'%3E%3Cg filter='url(%23filter0_0)'%3E%3Cellipse cx='974.597' cy='-416.61' rx='421.07' ry='365.765' transform='rotate(-45 974.597 -416.61)' fill='%2358BBE6' /%3E%3C/g%3E%3Cg filter='url(%23filter1_0)'%3E%3Cellipse cx='1311.31' cy='-269.897' rx='286.63' ry='278.996' transform='rotate(-45 1311.31 -269.897)' fill='%23A9D4FF' /%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_0' x='335.998' y='-1055.21' width='1277.2' height='2000' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix' /%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' /%3E%3CfeGaussianBlur stdDeviation='122.103' result='effect1_foregroundBlur' /%3E%3C/filter%3E%3Cfilter id='filter1_0' x='928.473' y='-652.736' width='765.678' height='2000' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix' /%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='shape' /%3E%3CfeGaussianBlur stdDeviation='0' result='effect1_foregroundBlur' /%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E\")",
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='700' viewBox='0 0 1400 700' fill='none'%3E%3Cg filter='url(%23filter0_1)'%3E%3Cellipse cx='974.597' cy='-416.61' rx='421.07' ry='365.765' transform='rotate(-45 974.597 -416.61)' fill='%23F5FD60' /%3E%3C/g%3E%3Cg filter='url(%23filter1_1)'%3E%3Cellipse cx='1311.31' cy='-269.897' rx='286.63' ry='278.996' transform='rotate(-45 1311.31 -269.897)' fill='%23FFFFD1' /%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_1' x='335.998' y='-1055.21' width='1277.2' height='2000' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix' /%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' /%3E%3CfeGaussianBlur stdDeviation='122.103' result='effect1_foregroundBlur' /%3E%3C/filter%3E%3Cfilter id='filter1_1' x='928.473' y='-652.736' width='765.678' height='2000' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix' /%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='shape' /%3E%3CfeGaussianBlur stdDeviation='0' result='effect1_foregroundBlur' /%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E\")",
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1400' height='700' viewBox='0 0 1400 700' fill='none'%3E%3Cg filter='url(%23filter0_2)'%3E%3Cellipse cx='974.597' cy='-416.61' rx='421.07' ry='365.765' transform='rotate(-45 974.597 -416.61)' fill='%2308ED94' /%3E%3C/g%3E%3Cg filter='url(%23filter1_2)'%3E%3Cellipse cx='1311.31' cy='-269.897' rx='286.63' ry='278.996' transform='rotate(-45 1311.31 -269.897)' fill='%23D1FFED' /%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_2' x='335.998' y='-1055.21' width='1277.2' height='2000' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix' /%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape' /%3E%3CfeGaussianBlur stdDeviation='122.103' result='effect1_foregroundBlur' /%3E%3C/filter%3E%3Cfilter id='filter1_2' x='928.473' y='-652.736' width='765.678' height='2000' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix' /%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='shape' /%3E%3CfeGaussianBlur stdDeviation='0' result='effect1_foregroundBlur' /%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E\")"
            );

            @for $i from 1 through 3 {
                &:nth-of-type(#{$i + 1}) {
                    top: calc(5rem + (#{$i} * 4.375rem));
                    @include media-breakpoint-up(lg) {
                        top: calc(2.5rem + (#{$i} * 6.25rem));
                    }
                    z-index: #{$i};
                    @if $i == 1 {
                        margin-bottom: 8.75rem;
                        @include media-breakpoint-up(lg) {
                            margin-bottom: 200px;
                        }
                    } @else if $i == 2 {
                        margin-top: -4.375rem;
                        margin-bottom: 4.375rem;
                        @include media-breakpoint-up(lg) {
                            margin-top: -6.25rem;
                            margin-bottom: 6.25rem;
                        }
                    }
                    box-shadow:
                        0px 5px 0px 0px nth($shadows, $i) inset,
                        0px 10px 20px 0px var(--ks-shadows-light);

                    --color: #{nth($cta-colors, $i)};
                    --bg-svg-image: #{nth($svg-images, $i)};
                    --badge-text-color: #{nth($badge-gradient-starts, $i)};
                    --badge-gradient: linear-gradient(
                        90deg,
                        #{nth($badge-gradient-starts, $i)} 0%,
                        #{nth($badge-gradient-ends, $i)} 100%
                    );

                    :deep(.color) {
                        color: nth($highlight-colors, $i);
                    }
                }
            }
        }
    }
</style>
