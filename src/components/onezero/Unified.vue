<template>
    <section class="unified">
        <div class="container">
            <div data-usal="fade-u">
                <p class="title">
                    Replace Fragmented Tools<br />
                    <span class="gradient"> With A Single Unified Platform </span>
                </p>
            </div>

            <div class="compare" data-usal="fade-u delay-50">
                <div class="section" data-usal="fade-r delay-100">
                    <h4 class="without">Without Kestra 😵‍💫</h4>
                    <p>
                        Job schedulers, complex workflow frameworks, custom scripts, and manual glue
                        code spread across multiple systems.
                    </p>
                </div>

                <div class="section" data-usal="fade-l delay-150">
                    <h4 class="with">With Kestra 😎</h4>
                    <p>
                        One platform to define, run, and observe workflows, react to event triggers,
                        manage human-in-the-loop approvals, secrets, audit trails, and SLAs.
                    </p>
                </div>
            </div>

            <div class="benefits" data-usal="fade-u delay-200">
                <div v-for="benefit in benefits" :key="benefit.id" class="card">
                    <div class="icon">
                        <component :is="benefit.icon" />
                    </div>
                    <p class="title">{{ benefit.title }}</p>
                    <p>{{ benefit.description }}</p>
                </div>
            </div>

            <div data-usal="fade-u">
                <a href="/demo" class="btn btn-lg btn-primary">
                    Calculate Your Savings With Kestra
                </a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import CashMinus from "vue-material-design-icons/CashMinus.vue"
    import ClockFast from "vue-material-design-icons/ClockFast.vue"
    import LaptopAccount from "vue-material-design-icons/LaptopAccount.vue"
    import RocketLaunch from "vue-material-design-icons/RocketLaunch.vue"

    const benefits = [
        {
            id: "fewer-moving-parts",
            title: "Fewer moving parts",
            description: "Reduce tool sprawl and operational overhead.",
            icon: RocketLaunch,
        },
        {
            id: "lower-infrastructure-costs",
            title: "Lower infrastructure costs",
            description: "Consolidate systems and cut redundant infrastructure.",
            icon: CashMinus,
        },
        {
            id: "faster-delivery",
            title: "Faster delivery",
            description: "Move from prototypes to production without friction.",
            icon: ClockFast,
        },
        {
            id: "consistent-governance",
            title: "Consistent governance",
            description: "Enforce versioning, auditing, and compliance by default.",
            icon: LaptopAccount,
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .unified {
        padding: 4rem 0.5rem 6.5rem;
        text-align: center;
        background-color: #f7f7f8;

        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 2rem;

            .title {
                width: 100%;
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 0;

                @include media-breakpoint-down(md) {
                    font-size: 1.5rem;
                }

                .gradient {
                    background: linear-gradient(90deg, #8c4bff 0%, #658af9 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .compare {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 4rem;
                margin-bottom: 4rem;
                text-align: left;

                @include media-breakpoint-down(sm) {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    text-align: center;
                }

                .section {
                    h4 {
                        font-size: $font-size-lg;
                        font-weight: 600;
                        margin-bottom: 1rem;

                        &.without {
                            color: #666666;
                        }

                        &.with {
                            color: #029e73;
                        }
                    }

                    p {
                        margin: 0;
                        color: $black-1;
                        font-size: $font-size-base;
                        line-height: 1.6;
                    }
                }
            }

            .benefits {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 1rem;

                @include media-breakpoint-down(xl) {
                    grid-template-columns: repeat(2, 1fr);
                }

                @include media-breakpoint-down(md) {
                    grid-template-columns: 1fr;
                }

                .card {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 2rem;
                    text-align: left;
                    background: $white;
                    border-radius: 20px;
                    box-shadow: 0 2px 4px 0 #ecebef;

                    @include media-breakpoint-up(xl) {
                        width: 263px;
                    }

                    .title {
                        margin: 0;
                        font-size: 20px;
                        color: $black-9;
                        font-weight: 700;
                        line-height: 31.23px;
                    }

                    p {
                        margin: 0;
                        color: #505050;
                        font-weight: 400;
                        line-height: 25.2px;
                        font-size: $font-size-base;
                    }

                    .icon {
                        :deep(.material-design-icon) {
                            color: $purple-38;
                            font-size: $font-size-2xl;
                        }
                    }
                }
            }

            @media (max-width: 768px) {
                [data-usal] {
                    opacity: 1 !important;
                    transform: none !important;
                    transition: none !important;
                }
            }
        }
    }
</style>