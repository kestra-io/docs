<template>
    <section class="govern">
        <div class="container">
            <h1 data-aos="fade-up" data-aos-duration="400" data-aos-delay="0" data-aos-easing="ease-out">
                <span class="highlight">Orchestrate</span> And <br class="d-none d-xl-block">
                <span class="indent"><span class="highlight">Govern</span> The Entire Infrastructure Lifecycle</span>
            </h1>

            <div class="cards-wrapper mt-4">
                <div
                    v-for="(card, index) in CARDS"
                    :key="card.title"
                    class="cards"
                    data-aos="fade-in"
                    :data-aos-duration="400"
                    :data-aos-delay="`${50 + index * 50}`"
                    data-aos-easing="ease-out"
                >
                    <div class="inner-card" :class="{ 'reverse': card.reverse }">
                        <div
                            class="content-card"
                            data-aos="fade-up"
                            :data-aos-duration="350"
                            :data-aos-delay="`${100 + index * 50}`"
                            data-aos-easing="ease-out"
                        >
                            <h2>
                                {{ card.title }}
                            </h2>
                            <p>
                                {{ card.description }}
                            </p>
                        </div>

                        <div class="img-card">
                            <img
                                :src="card.image"
                                :alt="card.title"
                                class="img-fluid"
                                data-aos="zoom-in"
                                :data-aos-duration="400"
                                :data-aos-delay="`${150 + index * 50}`"
                                data-aos-easing="ease-out"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    const CARDS = [
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

    .govern {
        background: $white;
        padding: 3rem 1rem;
        margin-bottom: 2rem;

        @include media-breakpoint-up(md) {
            padding: 4rem 0;
        }

        .container {
            padding: 0;

            h1 {
                font-weight: 700;
                margin: 0;
                font-size: 1.5rem;
                text-align: center;
                line-height: 2rem;

                @include media-breakpoint-up(md) {
                    text-align: left;
                    font-size: 2.625rem;
                    line-height: 3rem;
                    margin-bottom: 3.5rem;
                }

                .highlight {
                    color: #631BFF;
                }

                .indent {
                    display: block;
                    text-align: center;

                    @include media-breakpoint-up(md) {
                        margin-left: 4rem;
                        text-align: left;
                    }

                    .highlight {
                        color: #631BFF;
                    }
                }
            }

            .cards-wrapper {
                display: flex;
                flex-direction: column;
                gap: 1.625rem;

                .cards {
                    border: 1px solid #D4D4D4;
                    padding: 0.375rem;
                    border-radius: 0.8125rem;

                    .inner-card {
                        background: #F4F4F4;
                        border-radius: 0.5625rem;
                        display: flex;
                        flex-direction: column-reverse;
                        align-items: center;

                        @include media-breakpoint-up(md) {
                            flex-direction: row;
                            padding-left: 4rem;

                            &.reverse {
                                flex-direction: row-reverse;
                                padding: 0 4rem 0 0;
                            }
                        }

                        .content-card {
                            display: flex;
                            flex-direction: column;
                            gap: 0.5rem;
                            padding-bottom: 1rem;
                            padding: 0.5rem;

                            @include media-breakpoint-up(xl) {
                                min-width: 338px;
                                min-height: 184px;
                                gap: 1rem;
                            }

                            h2 {
                                font-weight: 700;
                                margin: 0;
                                font-size: 1.5rem;
                                line-height: 1.875rem;
                                white-space: pre-line;

                                @include media-breakpoint-up(lg) {
                                    font-size: 1.875rem;
                                }
                            }

                            p {
                                font-weight: 400;
                                font-size: 0.875rem;
                                line-height: 1.125rem;
                                white-space: pre-line;
                                color: #1E202A;
                                margin: 0;

                                @include media-breakpoint-up(lg) {
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
                }
            }
        }
    }
</style>