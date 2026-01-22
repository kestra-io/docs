<template>
    <div class="content" ref="orchestraCoreDOMElement">
        <div class="container" data-usal="fade-l">
            <div class="top-block">
                <div class="header">
                    <p>Unified Enterprise-Grade Orchestration Platform</p>
                    <span
                        >Achieve in Days What Once Took Weeks, with Complete Control at Every
                        Step</span
                    >
                </div>
                <div class="percents">
                    <div class="percent-block">
                        <p>PRODUCTIVITY</p>
                        <div>10x</div>
                        <span>Faster Workflow Completion</span>
                    </div>
                    <div class="percent-block">
                        <p>PROFITABILITY</p>
                        <div>75%</div>
                        <span>Reduction in Operational costs</span>
                    </div>
                    <div class="percent-block">
                        <p>EFFICIENCY</p>
                        <div>80%</div>
                        <span>Boost in Team Efficiency</span>
                    </div>
                    <div class="percent-block">
                        <p>TIME TO MARKET</p>
                        <div>5x</div>
                        <span>Deployment Speed</span>
                    </div>
                </div>
                <a href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                    <span>Talk to sales</span>
                </a>
            </div>
            <Testimonials :testimonialData />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import Testimonials from "~/components/common/Testimonials.vue"
    import FilaLogo from "./assets/fila.svg"
    import AcxiomLogo from "~/assets/quotes-companies/Acxiom.svg"
    import JPLogo from "./assets/jp.svg"
    import VyomaSpaceLogo from "./assets/Vyoma-Space.svg"
    import CleverConnectLogo from "./assets/CleverConnect.svg"

    const testimonialData = [
        {
            message:
                "Kestra enables the entire team, even non-technical members, to understand the benefits and contribute. I’ve onboarded people, created blueprints, and set them up to build their own workflows.",
            name: "John Kim",
            designation: "IT Lead",
            alt: "IT Lead",
            logo: FilaLogo,
        },
        {
            message:
                "The main advantage I see in Kestra is the use of YAML for creating flexible workflows. This allows us to chain pieces of metadata together dynamically, and the user-friendly UI helps our internal users create simple-to-understand inputs for the data pipelines we develop.",
            name: "Kyle Hanson",
            designation: "Lead Software Engineer",
            alt: "Lead Software Engineer",
            logo: AcxiomLogo,
        },
        {
            message: "Kestra is like the Wizard of Oz Wizard, doing its magic behind the curtain.",
            name: "Amy King",
            designation: "Cybersecurity & Technology Controls",
            alt: "Cybersecurity & Technology Controls",
            logo: JPLogo,
        },
        {
            message:
                "Kestra’s UI and speed of development is brilliant. Very quick to prototype a new pipeline, continuously iterate, and test things out. Love the replay feature. It has very clear separation of pipeline and processing code.",
            name: "Ollie Steiner",
            designation: "Senior Data Engineer",
            alt: "Senior Data Engineer",
            logo: VyomaSpaceLogo,
        },
        {
            message:
                "The exceptional pre-sales support and commitment to providing a high-performance product have laid the foundation for a great partnership.",
            name: "Patrick Ferreira",
            designation: "Product Manager",
            alt: "Product Manager",
            logo: CleverConnectLogo,
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .content {
        background-color: #121217;

        .container {
            max-width: 1120px;
            padding-top: 120px;
            width: 100%;

            @media only screen and (max-width: 1200px) {
                padding-left: $rem-2;
                padding-right: $rem-2;
            }

            @media only screen and (max-width: 760px) {
                margin: 0;
                padding: 0;
            }

            .top-block {
                display: flex;
                align-items: center;
                flex-direction: column;
                gap: 32px;

                @media only screen and (max-width: 760px) {
                    padding: $rem-2;
                }

                .header {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: start;
                    gap: 8px;

                    p {
                        margin: 0;
                        font-family: $font-family-sans-serif;
                        font-size: 42px;
                        font-weight: 400;
                        line-height: 38px;
                        text-align: left;
                        color: $white;

                        @media only screen and (max-width: 991px) {
                            line-height: 34px;
                            font-size: 32px;
                        }

                        @media only screen and (max-width: 576px) {
                            line-height: 26px;
                            font-size: 24px;
                        }
                    }

                    span {
                        font-family: $font-family-sans-serif;
                        font-size: 18px;
                        font-weight: 400;
                        line-height: 28px;
                        text-align: left;
                        color: $white;

                        @media only screen and (max-width: 576px) {
                            font-size: 18px;
                        }
                    }
                }

                .percents {
                    display: flex;
                    gap: $rem-1;
                    width: 100%;

                    @media only screen and (max-width: 1120px) {
                        flex-wrap: wrap;
                        justify-content: center;
                    }

                    .percent-block {
                        padding: $rem-2;
                        border-radius: 8px;
                        width: 100%;
                        background: linear-gradient(180deg, #21242e 0%, #1a1c24 100%);

                        @media only screen and (max-width: 1120px) {
                            max-width: 329px;
                            padding: $rem-1 $rem-2;
                        }

                        @media only screen and (max-width: 738px) {
                            width: 45%;
                        }

                        @media only screen and (max-width: 540px) {
                            width: 100%;
                        }

                        p {
                            margin: 0;
                            color: $white-3;
                            font-family: $font-family-sans-serif;
                            font-size: $rem-1;
                            font-weight: 400;
                            line-height: 22.4px;
                            text-align: left;

                            @media only screen and (max-width: 738px) {
                                font-size: 14px;
                                line-height: 20px;
                            }
                        }

                        div {
                            font-family: $font-family-sans-serif;
                            font-weight: 800;
                            font-size: 85px;
                            color: $purple-39;

                            @media only screen and (max-width: 738px) {
                                font-size: 67px;
                                line-height: 78px;
                            }
                        }

                        span {
                            color: $white;
                            font-family: $font-family-sans-serif;
                            font-size: 19px;
                            font-weight: 400;
                            line-height: 22.4px;
                            text-align: left;

                            @media only screen and (max-width: 738px) {
                                font-size: $rem-1;
                                line-height: 25px;
                            }
                        }
                    }
                }
            }

            .demo-btn {
                cursor: pointer;
                padding: 10px 16px;
                background-color: #6862f5;
                border-radius: 4px;
                max-width: 135px;

                span {
                    color: $white;
                    font-family: $font-family-sans-serif;
                    font-size: $rem-1;
                    font-weight: 700;
                    line-height: 24px;
                    text-align: center;
                    white-space: nowrap;
                }
            }
        }
    }
</style>