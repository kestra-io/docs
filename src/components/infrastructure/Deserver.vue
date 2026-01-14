<template>
    <section class="deserver">
        <div class="container">
            <h2 class="deserver-heading" data-aos="fade-up" data-aos-duration="500" data-aos-delay="0"
                data-aos-easing="ease-out">
                Infrastructure Teams Deserve a Better Way to Operate
            </h2>

            <div class="deserver-row">
                <div class="deserver-inner" data-aos="slide-right" data-aos-duration="500" data-aos-delay="25"
                    data-aos-easing="ease-out">
                    <h3>Why Infrastructure Automation Fails Today</h3>
                    <ul class="list-unstyled">
                        <li v-for="(item, index) in WHY_FAILS" :key="index">
                            <div class="icon-wrap">
                                <CircleMedium />
                            </div>
                            <div>{{ item }}</div>
                        </li>
                    </ul>
                </div>

                <div class="deserver-ellipse" data-aos="zoom-in" data-aos-duration="600" data-aos-delay="50"
                    data-aos-easing="ease-out">
                    <NuxtImg src="/landing/infrastructure/extrude-sm.png" alt="extrude" format="webp" densities="x1 x2" class="deserver-sm-img" />
                </div>

                <div class="deserver-extrude" aria-hidden="true" />

                <img src="/landing/infrastructure/extrude.svg" alt="logo" width="280" height="285" class="deserver-img" />

                <div class="deserver-inner second" data-aos="slide-left" data-aos-duration="500" data-aos-delay="50"
                    data-aos-easing="ease-out">
                    <h3>The Kestra Unified Control Plane</h3>
                    <ul class="list-unstyled">
                        <li v-for="(item, index) in KESTRA_BENEFITS" :key="index">
                            <div class="icon-wrap">
                                <Check />
                            </div>
                            <div>{{ item }}</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="d-flex flex-column deserver-content" data-aos="fade-up" data-aos-duration="500"
                data-aos-delay="100" data-aos-easing="ease-out">
                <h6 class="deserver-subheading">
                    Ready to replace vRA, Rundeck, Jenkins, Control-M, and fragmented scripts?
                </h6>
                <NuxtLink href="/demo" class="btn btn-primary btn-gradient deserver-btn">
                    Discuss Your Automation Landscape
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import Check from "vue-material-design-icons/CheckBold.vue";
    import CircleMedium from "vue-material-design-icons/CircleMedium.vue";

    const WHY_FAILS: string[] = [
        "Fragmented scripts, pipelines, & legacy tools",
        "Zero governance with no standards, or visibility",
        "Fragile Day 2 Ops with slow, manual maintenance",
        "Automation breaks in air-gapped/hybrid setups",
        "Rising costs with no added value",
    ];

    const KESTRA_BENEFITS: string[] = [
        "One declarative platform for all workflows",
        "Full visibility from day one",
        "Automate everything from provisioning to remediation",
        "Runs anywhere cloud, on-prem, edge, or air-gapped",
        "Cut operational costs and deliver instant value",
    ];
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .deserver {
        background: $white;
        padding: 4rem 2rem;

        .container {
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        &-heading {
            font-weight: 700;
            font-size: 27px;
            margin-bottom: 1rem;
            text-align: center;
        }

        &-content {
            gap: 14px;
            text-align: center;
            max-width: 1060px;
            align-items: center;
            margin-top: 1rem;

            @include media-breakpoint-up(lg) {
                margin-top: 2rem;
            }
        }

        &-subheading {
            font-weight: 600;
            font-size: 18px;
        }

        &-btn {
            width: fit-content;
        }

        &-row {
            position: relative;
            max-width: 1060px;
            display: flex;
            justify-content: space-between;

            @include media-breakpoint-down(lg) {
                flex-direction: column;
            }
        }

        &-img {
            z-index: 10;
            margin-left: -1rem;
            margin-top: -0.5rem;

            @include media-breakpoint-down(lg) {
                display: none;
            }
        }

        &-ellipse {
            display: none;

            @include media-breakpoint-down(lg) {
                display: block;
                background: linear-gradient(179.73deg, #F5CBFF 0.24%, rgba(223, 223, 223, 0) 53.89%);
                width: 156px;
                height: 169px;
                border-radius: 120px;
                transform: rotate(0.48deg);
                opacity: 1;
                position: relative;
                margin: 0 auto;
            }
        }

        &-sm-img {
            display: none;

            @include media-breakpoint-down(lg) {
                display: block;
                width: 140.23078918457031px;
                height: 146.20729064941406px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .btn {
            @include media-breakpoint-down(md) {
                padding: 0.75rem 1rem;
                font-size: 0.875rem;
            }
        }

        &-extrude {
            position: absolute;
            top: 2%;
            left: 36%;
            width: 240px;
            height: 284px;
            background: linear-gradient(179.73deg, #F5CBFF 0.24%, rgba(223, 223, 223, 0) 53.89%);
            border-radius: 120px;
            transform: rotate(75deg);
            opacity: 1;
            pointer-events: none;
            z-index: 0;

            @include media-breakpoint-up(xl) {
                left: 38%;
            }

            @include media-breakpoint-down(lg) {
                display: none;
            }
        }

        &-inner {
            z-index: 1;
            height: 100%;
            padding: 20px 0;

            @include media-breakpoint-up(xl) {
                padding: 20px 32px;
            }

            h3 {
                font-weight: 700;
                font-size: 17px;
                margin-bottom: 12px;
            }

            ul {
                max-width: 350px;
            }

            li {
                font-weight: 600;
                font-size: 14px;
                line-height: 17px;
                margin-bottom: 8px;
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;

                .icon-wrap {
                    display: flex;
                    align-items: flex-start;
                    margin-top: 1px;
                }

                :deep(svg) {
                    color: #F65656;
                }
            }

            &.second {
                @include media-breakpoint-up(lg) {
                    margin-left: 2rem;
                }

                :deep(svg) {
                    color: #02BE8A;
                }
            }
        }
    }
</style>