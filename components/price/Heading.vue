<template>
    <div class="container">
        <div class="header">
            <span class="text-white text-center">Kestra Editions</span>
            <h3 class="title text-white text-center">
                Explore with Open Source
                Scale with Enterprise Edition
            </h3>
        </div>
        <!-- cards  -->
        <Section class="pt-0">
            <div class="row card-group mb-4">
                <div class="col-12 col-md-6 z-3 d-md-flex justify-content-md-end pt-37">
                    <div class="card text-white col-lg-9 col-xl-8  max-w-328">
                        <div class="card-body">
                            <div class="pb-rem-2">
                                <h4 class="card-title" data-aos="fade-right">Open-Source Edition</h4>
                                <p class="pricing" data-aos="fade-left">Best for Development</p>
                                <p class="pricing-type" data-aos="fade-left">Free</p>
                                <div class="pricing-desc" data-aos="fade-left">
                                    The core features of Kestra, maintained by the Kestra team and community.
                                </div>
                            </div>
                            <NuxtLink
                                href="https://github.com/kestra-io/kestra"
                                class="get-started"
                                data-aos="zoom-in"
                            >
                                Get started
                            </NuxtLink>
                            <ul>
                                <li data-aos="fade-right" data-aos-delay="100">
                                    <div class="check-icon">
                                        <CheckBold />
                                    </div>
                                    <span>Core Features</span>
                                </li>
                                <li data-aos="fade-right" data-aos-delay="150">
                                    <div class="check-icon">
                                        <CheckBold />
                                    </div>
                                    <span>Open Source Under Apache 2.0 Licence</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 z-3 ">
                    <div class="bordered-block">
                        <div class="card-Demo text-white col-lg-9 col-xl-8 mt-3 mt-md-0  max-w-328">
                            <div class="top-block">
                            <span>
                                Recommended for Enterprises & SMBs
                            </span>
                            </div>
                            <div class="card-body">
                                <div class="pb-rem-2">
                                    <h4 class="card-title" data-aos="fade-right">Enterprise Edition</h4>
                                    <p class="pricing" data-aos="fade-left">Built For Production</p>
                                    <p class="pricing-type" data-aos="fade-left">On-Demand</p>
                                    <div class="pricing-desc" data-aos="fade-left"> Predictable nstance based model with: no limits on users, workflows, or tasks.</div>
                                </div>
                                <NuxtLink
                                    href="/demo"
                                    class="demo-btn"
                                    data-aos="zoom-in"
                                >
                                    Book a Call
                                </NuxtLink>
                                <ul>
                                    <li data-aos="fade-right" data-aos-delay="100">
                                        <div class="check-icon">
                                            <CheckBold />
                                        </div>
                                        <span>Everything in Open-source</span>
                                    </li>
                                    <li data-aos="fade-right" data-aos-delay="150">
                                        <div class="check-icon">
                                            <Plus />
                                        </div>
                                        <span>Governance</span>
                                    </li>
                                    <li data-aos="fade-right" data-aos-delay="150">
                                        <div class="check-icon">
                                            <Plus />
                                        </div>
                                        <span>Security</span>
                                    </li>
                                    <li data-aos="fade-right" data-aos-delay="150">
                                        <div class="check-icon">
                                            <Plus />
                                        </div>
                                        <span>Productivity</span>
                                    </li>
                                    <li data-aos="fade-right" data-aos-delay="150">
                                        <div class="check-icon">
                                            <Plus />
                                        </div>
                                        <span>Scalability</span>
                                    </li>
                                    <li data-aos="fade-right" data-aos-delay="150">
                                        <div class="check-icon">
                                            <Plus />
                                        </div>
                                        <span>SLA & Customer Success Program</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="team-container">
                <div class="teams-content">
                    <p>Trusted by Teams From:</p>
                    <div class="teams-logos">
                        <div>
                            <NuxtImg
                                width="100%"
                                loading="lazy"
                                format="webp"
                                class="img-fluid"
                                src="/landing/pricing/teams/LM.svg"
                                alt="FILA"
                                data-aos="fade-left"
                            />
                        </div>
                        <div>
                            <NuxtImg
                                width="100%"
                                loading="lazy"
                                format="webp"
                                class="img-fluid"
                                src="/landing/pricing/teams/GORGIAS.svg"
                                alt="Gorgias"
                                data-aos="fade-left"
                            />
                        </div>
                        <div>
                            <NuxtImg
                                width="100%"
                                loading="lazy"
                                format="webp"
                                class="img-fluid"
                                src="/landing/pricing/teams/ACXIOM.svg"
                                alt="Acxiom"
                                data-aos="fade-left"
                            />
                        </div>
                        <div>
                            <NuxtImg
                                width="100%"
                                loading="lazy"
                                format="webp"
                                class="img-fluid"
                                src="/landing/pricing/teams/T-SYSTEM.svg"
                                alt="L'Oréal"
                                data-aos="fade-left"
                            />
                        </div>
                        <div>
                            <NuxtImg
                                width="100%"
                                loading="lazy"
                                format="webp"
                                class="img-fluid"
                                src="/landing/pricing/teams/BATTELLE.svg"
                                alt="Battelle"
                                data-aos="fade-left"
                            />
                        </div>
                        <div>
                            <NuxtImg
                                width="100%"
                                loading="lazy"
                                format="webp"
                                class="img-fluid"
                                src="/landing/pricing/teams/DATAPORT.svg"
                                alt="Battelle"
                                data-aos="fade-left"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
import Section from '../layout/Section.vue';
import CheckBold from 'vue-material-design-icons/CheckBold.vue'
import Plus from 'vue-material-design-icons/Plus.vue'
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.container {
    background-image: url(/public/landing/pricing/visual-bg_pricing.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 90% auto;

    @include media-breakpoint-down(md) {
        background-image: unset;
        padding-left: $rem-2;
        padding-right: $rem-2;
    }

    :deep(section) {
        @include media-breakpoint-down(md) {
            padding-bottom: 0;
        }
    }
    .max-w-328 {
        max-width: 328px;
    }
    .pt-37 {
        padding-top: 37px;
    }

    .bordered-block {
        width: fit-content;
        padding: 3px;
        border-radius: 10px;
        border: 1px solid #A870FF;

        @include media-breakpoint-down(md) {
            margin-top: 20px;
        }

        .card-Demo {
            width: 100%;
            background-color: $white !important;
            box-shadow: none;
            background: var(--Kestra-io-Token-color-background-secondary, $black-2);
            position: relative;
            $border: 1px;
            background: #000;
            background-clip: padding-box;
            border-radius: 8px;

            @include media-breakpoint-down(md) {
                margin-top: 0 !important;
            }


            .top-block {
                display: flex;
                justify-content: center;
                width: 100%;
                background-color: rgba(113, 23, 255, 1);
                padding: 8px 0;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                border: none;

                span {
                    color: $white;
                    font-size: 12px;
                }
            }
        }
    }


    .card {
        background-color: $white !important;
        border: $block-border !important;
        box-shadow: none;
    }

    .card-body {
        padding: calc($spacer * 2);

        .pb-rem-2 {
            padding-bottom: $rem-2;
        }

        .card-title {
            color: $black-1;
            font-size: $font-size-xl;
            font-weight: 600;
            padding-bottom: 11px;
            border-bottom: 1px solid rgba(217, 217, 217, 1);
            line-height: 2rem;
        }

        .pricing {
            margin-top: $rem-1;
            margin-bottom: 0;
            color: $black-1;
            font-weight: 700;
            font-size: $font-size-md;
            line-height: 2rem;
        }

        .pricing-type {
            margin: 0;
            color: rgba(61, 61, 63, 1);
            font-size: 18px;
            font-weight: 400;
            line-height: 28px;
        }

        .pricing-desc {
            font-family: $font-family-sans-serif;
            font-weight: 400;
            margin-top: 16px;
            color: rgba(61, 61, 63, 1);
            font-size: 12px;
            line-height: 18px;
        }

        .get-started {
            &:hover {
                background: #F2F5F8;
                border: 1px solid #000000;
            }
            display: flex;
            width: 100%;
            justify-content: center;
            color: $black-2 !important;
            border: 1px solid rgba(43, 49, 62, 1);
            padding: 9px 0;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 700;
        }

        .demo-btn {
            &:hover {
                background: #8255FF;
            }
            display: flex;
            width: 100%;
            justify-content: center;
            color: $white !important;
            padding: 9px 0;
            border-radius: 4px;
            font-size: 16px;
            font-weight: 700;
            background: #7117FF;
        }

        ul {
            padding-top: $spacer;
            padding-left: 0;

            .category-title {
                text-transform: uppercase;
                margin: 0;
                font-weight: 700;
                font-size: $font-size-base;
                line-height: calc($spacer * 2);
                margin-bottom: calc($spacer / 4);
            }

            li {
                display: flex;
                gap: 8px;
                padding: 0 0.1rem;
                list-style: none;
                min-height: 24px;

                .check-icon {
                    max-width: 16px;
                    position: relative;
                    height: 100%;
                    :deep(svg) {
                        top: 0;
                        position: absolute;
                        font-size: 16px;
                    }
                }

                span {
                    color: $black-2;
                    position: relative;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 22px;
                }
            }
        }
    }

    .header {
        margin-top: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 30px;

        @include media-breakpoint-down(lg) {
            gap: 10px;
        }

        span {
            text-align: center;
            align-items: center;
            font-family: $font-family-sans-serif;
            font-size: 18px;
            font-weight: 400;
            line-height: 28px   ;
            text-decoration-skip-ink: none;
            color: rgba(115, 107, 205, 1) !important;
            @include media-breakpoint-down(md) {
                width: 100%;
                text-align: start !important;
            }
        }

        .title {
            font-weight: 400;
            font-family: $font-family-sans-serif;
            font-size: 40px !important;
            line-height: 48px;
            max-width: 543px;

            @include media-breakpoint-down(lg) {
                font-size: 35px !important;
                line-height: 43px;
            }

            @include media-breakpoint-down(md) {
                text-align: start !important;
            }
        }
    }

    .card-group {
        z-index: 10;
        position: relative;
        overflow: hidden;

        @include media-breakpoint-down(md) {
            padding: 0;
        }

        @include media-breakpoint-down(lg) {
            background-size: 1500px 800px;
        }

        div {
            @include media-breakpoint-down(md) {
                width: 100%;
                max-width: unset;
            }
        }
    }

    .team-container {
        width: 100%;
        display: flex;
        justify-content: center;
        .teams-content {
            width: fit-content;
            padding: $rem-2 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            @include media-breakpoint-down(sm) {
                align-items: start !important;
            }

            p {
                padding: 0 14px;
                font-size: $font-size-xl;
                font-weight: 300;
                line-height: 25.85px;
                text-align: center;
                color: rgba(255, 255, 255, 1);
                @include media-breakpoint-down(sm) {
                    text-align: start;
                    font-size: $rem-1;
                }
            }

            .teams-logos {
                display: flex;
                column-gap: 43px;
                row-gap: 20px;
                padding: 0 14px;
                @include media-breakpoint-down(lg) {
                    padding: 0;
                }
                img {
                    height: 74px;
                    @include media-breakpoint-down(lg) {
                        height: 50px;
                    }
                }

                @include media-breakpoint-down(sm) {
                    column-gap: 21px;
                }

                @include media-breakpoint-down(md) {
                    flex-wrap: wrap;
                }
            }
        }
    }
}
</style>