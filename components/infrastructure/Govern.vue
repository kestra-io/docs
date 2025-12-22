<template>
    <section class="govern">
        <div class="container">
            <h1><span class="highlight">Orchestrate</span> And <br>
                <span class="indent"><span class="highlight">Govern</span> The Entire Infrastructure Lifecycle</span>
            </h1>
            <div class="cards-container mt-4">
                <div v-for="card in cards" :key="card.title" class="cards">
                    <div class="inner-card" :class="{ 'reverse': card.reverse }">
                        <div class="content-card">
                            <h2>
                                {{ card.title }}
                            </h2>
                            <p>
                                {{ card.description }}
                            </p>
                        </div>
                        <div class="img-card">
                            <img :src="card.image" :alt="card.title" class="img-fluid">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="govern-cta">
        <div class="container center-container">
            <h1 class="title">
                See how teams are using Kestra to replace vRO, Rundeck, and thousands of scripts.
            </h1>
            <div class="gradient-border">
                <NuxtLink href="/demo" class="btn btn-lg btn-secondary">Talk to us</NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    const cards = [
        {
            title: "Standardize IaC Pipeline",
            description: "Run IaC the same way every time. kestra orchestrates the full lifecycle with shared parameters, secrets, retries, and evidence-\ngrade logs across all environments.",
            image: "/landing/infrastructure/iac.png"
        },
        {
            title: "Deploy to Any Target, On-Prem or Cloud",
            description: "Provision and evolve workloads anywhere. Kestra workflows drive K8s, vSphere, cloud, and network APIs with consistent sequencing, execution, and traceability.",
            image: "/landing/infrastructure/deploy.png",
            reverse: true
        },
        {
            title: "Integrated\nHuman-in-the-Loop",
            description: "Pause workflows for critical checks. Kestra offers relying Business Decisions with audit trail and controlled executions.",
            image: "/landing/infrastructure/loop.png"
        }
    ]

</script>

<style lang="scss" scoped>
    @import "../../assets/styles/_variable";

    .center-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 26px;
        color: $white;

        @include media-breakpoint-up(md) {
            gap: 3rem;
        }
    }

    .title {
        font-weight: 600;
        line-height: 33.5px;
        text-align: center;
        margin: 0;
    }

    .content {
        max-width: 660px;
        color: $white;
        text-align: center;
    }

    .govern {
        background: $white;
        padding: 2rem 0;

        @include media-breakpoint-up(md) {
            padding: 4rem 0;
        }

        h1,
        h2 {
            font-weight: 700;
            margin: 0;
        }

        h1 {
            font-size: 1.5rem;
            text-align: center;
            line-height: 2rem;

            @include media-breakpoint-up(md) {
                font-size: 2.625rem;
                line-height: 3rem;
                text-align: left;
                margin-bottom: 3.5rem;
            }
        }

        .indent {
            text-align: center;

            @include media-breakpoint-up(md) {
                margin-left: 4rem;
                text-align: left;
            }
        }

        .cards-container {
            display: flex;
            flex-direction: column;
            gap: 1.625rem;
        }

        .cards {
            border: 1px solid #D4D4D4;
            padding: 0.375rem;
            border-radius: 0.8125rem;
        }

        .inner-card {
            background: #F4F4F4;
            border-radius: 0.5625rem;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            padding: 0.5rem;

            @include media-breakpoint-up(md) {
                flex-direction: row;
                padding-left: 4rem;

                &.reverse {
                    flex-direction: row-reverse;
                    padding: 0 4rem 0 0;
                }
            }
        }

        .content-card {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            @include media-breakpoint-up(xl) {
                min-width: 338px;
                min-height: 184px;
                gap: 1rem;
            }

            h2 {
                font-size: 1.5rem;
                line-height: 1.875rem;
                white-space: pre-line;

                @include media-breakpoint-up(lg) {
                    font-size: 1.875rem;
                }
            }

            p {
                font-weight: 400;
                font-size: 0.75rem;
                line-height: 1.125rem;
                white-space: pre-line;
                color: #1E202A;
                margin: 0;

                @include media-breakpoint-up(lg) {
                    font-size: 0.875rem;
                    line-height: 1.375rem;
                }
            }
        }

        .img-card {
            width: 100%;
            margin-bottom: 1rem;

            img {
                width: 100%;
                height: auto;
                object-fit: contain;
                display: block;
            }

            @include media-breakpoint-up(md) {
                width: auto;
                margin-bottom: 0;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }

    .govern-cta {
        padding: 2.5rem 0;
        background: #000001 url('/landing/infrastructure/cta-gradient.svg') no-repeat center center / cover;
        margin-top: 2.5rem;

        @include media-breakpoint-up(lg) {
            padding: 4rem 0 90px;
        }

        .title {
            color: $white;
            max-width: 75%;

            @include media-breakpoint-up(md) {
                font-size: 2.25rem;
                line-height: 3.125rem;
            }
        }

        .btn-lg {
            border: none;
            padding: 0.5rem 1.5rem;
            font-size: 18.4px;
            border-radius: 8px;
        }
    }

</style>