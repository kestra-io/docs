<template>
    <Section class="container">
        <div class="heading mx-auto pb-4">
            <h3 class="title">
                Automation and Scheduling
                <span class="title-animated"> Features</span>
            </h3>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto.svg"
                                alt="BackFill pattern svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Backfill Support</h6>
                        </div>
                        <p class="card-para">
                            Kestra's Backfills can automatically catch up on missed workflows after
                            an outage. You can trigger backfills from the UI without having to
                            redeploy your code.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4 mask">
                <div class="card h-100 d-flex" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto1.svg"
                                alt="Tune-Based svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Time-Based Scheduling</h6>
                        </div>
                        <p class="card-para">
                            Kestra provides versatile scheduling options for timely and reliable
                            task execution, from regular intervals to condition-based triggers.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto2.svg"
                                alt="Event-Driven svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Event-Driven Triggers</h6>
                        </div>
                        <p class="card-para">
                            Initiate workflows based on real-time events, and schedule them to
                            listen for specific events at designated times.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto3.svg"
                                alt="API-Based svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">API-Based Triggers</h6>
                        </div>
                        <p class="card-para">
                            Leverage API-based triggers for smooth integration with your existing
                            systems, allowing automated workflows to adapt to external conditions.
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 d-flex" data-usal="fade-r">
                    <div class="card-body mx-2">
                        <div class="d-flex align-items-center gap-3">
                            <NuxtImg
                                loading="lazy"
                                format="webp"
                                width="69px"
                                height="69px"
                                src="/landing/features/scheduling/automation/Icon_auto4.svg"
                                alt="Subflow svg"
                                class="mb-2"
                            />
                            <h6 class="card-heading">Modularity with Subflows</h6>
                        </div>
                        <p class="card-para">
                            Build modular and reusable reusable components. Write your logic once
                            and call it from any other workflow when needed. Pass data between flows
                            for seamless orchestration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Section>
</template>

<script setup>
    import Section from "~/components/layout/Section.vue"
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container {
        padding: calc($spacer * 4) 0;
        background-image: url("/landing/features/scheduling/masking.svg");
        z-index: 99;
        color: $white;

        .heading {
            max-width: 500px;
        }

        .title {
            font-weight: 300;
            font-size: $font-size-3xl;

            &-animated {
                background: linear-gradient(90deg, #e151f7 57.52%, #5c47f5 92.48%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }

    h3 {
        text-align: center;
        margin-bottom: 0;
    }

    .card {
        background-color: $black-2;
        color: $white;
        z-index: 99;
        box-shadow: none !important;

        &-body {
            padding: 4rem 2rem 2rem 2rem;
        }

        &-heading {
            font-size: $font-size-xl;
            font-weight: 400;
            line-height: 2rem;
        }

        &-para {
            font-size: $font-size-sm;
            font-weight: 400;
            line-height: 1.375;
            color: $white-1;
        }
    }

    .mask {
        position: relative;
        z-index: 99;

        &::after {
            content: "";
            position: absolute;
            height: 266.493px;
            width: 170.248px;
            right: -94.184px;
            bottom: -232.493px;
            z-index: 10;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0), #6117ff 100%);
            filter: blur(100px);
        }
    }
</style>