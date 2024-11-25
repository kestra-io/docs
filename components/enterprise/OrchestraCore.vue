<template>
    <div class="main-box">
        <div class="container" data-aos="fade-left">
            <div class="top-block">
                <div class="header">
                    <p>Unified Enterprise-Grade Orchestration Platform</p>
                    <span>Achieve in Days What Once Took Weeks, with Complete Control at Every Step</span>
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
                <NuxtLink href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                    <span>Talk to sales</span>
                </NuxtLink>
            </div>
            <div class="slider">
                <div data-aos="fade-left">
                    <Carousel v-bind="settings" :breakpoints="breakpoints">
                        <Slide v-for="(slide, slideIndex) in testimonialData" :key="slide">
                            <div class="carousel--item">
                                <div class="content">
                                    <img class="slide-svg" src="/landing/enterprise/slider-icon.svg"
                                         alt="Carousel img"/>
                                    <span>{{slide.message}}</span>
                                    <div class="person">
                                        <div class="fila-svg">
                                            <img src="/landing/enterprise/fila.svg" alt="fila"/>
                                        </div>
                                        <div class="person-info">
                                            <p>{{slide.name}}</p>
                                            <span>{{slide.designation}}</span>
                                        </div>
                                    </div>

                                    <div class="dots">
                                        <div class="slide-counter">
                                            <div class="slider-actions">
                                                <navigation>
                                                    <template #prev>
                                                        <div
                                                            class="mobile-btn-prev carousel-control carousel-control-prev">
                                                            <img src="/landing/enterprise/slider-left-arrow.svg"
                                                                 alt="prev"/>
                                                        </div>
                                                    </template>
                                                    <template #next>
                                                        <div
                                                            class="mobile-btn-next carousel-control carousel-control-next">
                                                            <img src="/landing/enterprise/slider-right-arrow.svg"
                                                                 alt="next"/>
                                                        </div>
                                                    </template>
                                                </navigation>
                                            </div>
                                            <div
                                                class="dot"
                                                v-for="(slide, index) in testimonialData"
                                                :class="slideIndex === index && 'active'"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Slide>
                        <template #addons>
                            <navigation>
                                <template #next>
                                    <div class="carousel-btn carousel-control carousel-control-next">
                                        <img src="/landing/enterprise/slider-right-arrow.svg" alt="next"/>
                                    </div>
                                </template>
                                <template #prev>
                                    <div class="carousel-btn carousel-control carousel-control-prev ">
                                        <img src="/landing/enterprise/slider-left-arrow.svg" alt="prev"/>
                                    </div>
                                </template>
                            </navigation>
                        </template>
                    </Carousel>
                </div>
                <div class="ready-scale">
                    <p>Ready to Scale Your Workflows</p>
                    <span>
                        Kestra Enterprise delivers the security, control, and flexibility you need to scale operations
                        with confidence. Empower your team, streamline governance, and harness reliable infrastructure
                        to drive growth without compromise.
                    </span>
                    <NuxtLink href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                        <span>Get a Demo</span>
                    </NuxtLink>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Section from '../layout/Section.vue';
  import ArrowLeft from "vue-material-design-icons/ArrowLeft.vue";
  import ArrowRight from "vue-material-design-icons/ArrowRight.vue";
  import 'vue3-carousel/dist/carousel.css'

  export default {
    components: {
      Section,
      ArrowLeft,
      ArrowRight,
    },
    data() {
      return {
        settings: {
          itemsToShow: 1,
          snapAlign: 'center',
        },
        breakpoints: {
          768: {
            itemsToShow: 1,
            snapAlign: 'start',
          },
          1024: {
            itemsToShow: 1,
            snapAlign: 'start',
          },
        },
        testimonialData: [
          {
            message: "Kestra is the unifying layer for our data and workflows. You can start small, but then there is no limit to the possibilities and scalability of such an open architecture.",
            name: "John Kim",
            designation: "Manager Corporate Strategy",
            alt: " Manager Corporate Strategy",
          },
        ],
      };
    },
  }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main-box {
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
                        font-weight: 600;
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

                    @media only screen and (max-width: 738px) {

                    }


                    .percent-block {
                        padding: $rem-2;
                        border-radius: 8px;
                        width: 100%;
                        background: linear-gradient(180deg, #21242E 0%, #1A1C24 100%);
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
                background-color: #6862F5;
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

            .slider {
                display: flex;
                flex-direction: column;
                padding-top: 180px;
                width: 100%;
                background-image: url(/landing/enterprise/visual-bg.png);
                background-size: 100% auto;
                background-repeat: no-repeat;
                gap: 42px;

                @include media-breakpoint-down(sm) {
                    background-size: auto;
                    background-position: center;
                }
                @media only screen and (max-width: 760px) {
                    padding-top: 64px;
                }

                .dots {
                    display: flex;
                    width: 100%;
                    justify-content: center;
                    margin-top: 40px;

                    @media only screen and (max-width: 760px) {
                        margin-top: 16px;
                    }


                    .slider-actions {
                        display: none;

                        .mobile-btn-next {
                            position: absolute;
                            right: -56px;
                        }

                        .mobile-btn-prev {
                            position: absolute;
                            left: -56px;
                        }

                        @media only screen and (max-width: 760px) {
                            display: block;
                        }
                    }

                    .slide-counter {
                        position: relative;
                        display: flex;
                        align-items: center;

                        .dot {
                            width: 6px;
                            height: 6px;
                            margin-right: 24px;
                            border-radius: 20px;
                            background: #FFFFFF33;

                            &:last-child {
                                margin-right: 0;
                            }
                        }


                        .active {
                            background: #FFFFFF;
                        }
                    }
                }

                .carousel-btn {
                    @media only screen and (max-width: 760px) {
                        display: none !important;
                    }
                }

                .content {
                    overflow: hidden;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 40px;
                    padding: 72px 102px;
                    margin: 0 74px;
                    background: linear-gradient(347.23deg, rgba(28, 28, 38, 0.6) 9.24%, rgba(43, 41, 50, 0.6) 106.62%);
                    backdrop-filter: blur(74px);

                    @media only screen and (max-width: 992px) {
                        gap: 16px;
                        padding: $rem-2;
                    }

                    @media only screen and (max-width: 760px) {
                        margin: 0 $rem-2;
                    }

                    .slide-svg {
                        width: 57px;
                        height: 57px;

                        @media only screen and (max-width: 760px) {
                            width: 42px;
                            height: 32px;
                        }
                    }

                    .person {
                        display: flex;
                        gap: 17px;
                        max-width: 264px;

                        .fila-svg {
                            padding: 6px 0;

                            img {
                                width: 75px;
                                height: 23.5px;
                            }
                        }

                        .person-info {
                            display: flex;
                            flex-direction: column;

                            p {
                                font-family: $font-family-sans-serif;
                                font-size: 14px;
                                font-weight: 700;
                                line-height: 18px;
                                letter-spacing: -0.05em;
                                text-align: left;
                                margin: 0;
                                color: $white;
                            }

                            span {
                                font-family: $font-family-sans-serif;
                                white-space: nowrap;
                                font-size: 12px;
                                font-weight: 400;
                                line-height: 18px;
                                letter-spacing: -0.05em;
                                text-align: left;
                                margin: 0;
                                color: #E1E1E1;
                            }
                        }
                    }

                    > span {
                        font-family: $font-family-sans-serif;
                        font-size: 39px;
                        font-weight: 600;
                        line-height: 52.26px;
                        letter-spacing: -0.005em;
                        text-align: left;
                        color: $white;

                        @media only screen and (max-width: 992px) {
                            font-size: 30px;
                        }

                        @media only screen and (max-width: 760px) {
                            font-size: 19px;
                            line-height: 25px;
                        }
                    }
                }

                .ready-scale {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    width: 100%;
                    max-width: 944px;
                    margin: auto;
                    overflow: hidden;
                    border-radius: 20px;
                    padding: $rem-4;
                    background: linear-gradient(180deg, rgba(49, 53, 70, 0.8) 3%, rgba(33, 36, 46, 0.8) 58%, rgba(26, 28, 36, 0.8) 100%);
                    backdrop-filter: blur(44px);
                    margin-bottom: 150px;

                    @media only screen and (max-width: 760px) {
                        margin: 0 $rem-2;
                        margin-bottom: 150px;
                        padding: $rem-2;
                        max-width: -webkit-fill-available;
                    }


                    > p {
                        max-width: 400px;
                        color: $white;
                        font-family: $font-family-sans-serif;
                        font-size: $rem-3;
                        font-weight: 400;
                        line-height: 56.4px;
                        text-align: center;

                        @media only screen and (max-width: 991px) {
                            font-size: $rem-2;
                            line-height: 35px;
                        }

                        @media only screen and (max-width: 760px) {
                            font-size: 24px;
                            line-height: 28px;
                        }
                    }

                    > span {
                        max-width: 568px;
                        color: $white;
                        font-family: $font-family-sans-serif;
                        font-size: 14px;
                        font-weight: 300;
                        line-height: 22px;
                        text-align: center;
                    }
                }
            }
        }
    }
</style>