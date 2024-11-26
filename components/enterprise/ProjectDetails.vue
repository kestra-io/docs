<template>
    <div class="content">
        <div class="container" data-aos="fade-left">
            <div class="anything-scale">
                <div class="info">
                    <p>Run Anything at Scale</p>
                    <span>Kestra offers language-agnostic orchestration, eliminating the need for glue code and allowing you to execute tasks in any language. With built-in high-availability options and full observability, Kestra ensures resilient operations and clear insights, no matter how complex your workflows.</span>
                </div>
                <div class="col-md-6 order-0 order-md-1 rounded-2" data-aos="fade-left">
                    <img
                        class="image-fluid"
                        src="/landing/enterprise/anything-scale.svg"
                        alt="Run Anything at Scale"
                    />
                </div>
            </div>
            <div class="declarative">
                <div class="block">
                    <div class="block-item">
                        <p>Declarative</p>
                        <span>Kestra’s declarative syntax in YAML offers a simple learning curve while enabling powerful orchestration. With both UI-based configuration and the ability to scale to complex use cases, Kestra ensures ease of use without sacrificing flexibility or control.</span>
                    </div>
                    <div class="w-100 order-md-1 rounded-2" data-aos="fade-left">
                        <img
                            class="declarative-img"
                            src="/landing/enterprise/declarative.svg"
                            alt="right icons"
                        />
                    </div>
                </div>
                <div class="block">
                    <div class="block-item">
                        <p>Real Time & Event Driven</p>
                        <span>Handle scheduled, real-time event-driven, and API-based workflows effortlessly. Support business-critical operations with real-time automation, ensuring your workflows adapt and scale to your needs.</span>
                    </div>
                    <div class="real-time w-100 order-md-1 rounded-2" data-aos="fade-left">
                        <img src="/landing/enterprise/real-time.svg" alt="right icons"/>
                    </div>
                </div>
            </div>
            <div class="plugins bg-image">
                <div class="header">
                    <p>Integrate With 600+ Plugins</p>
                    <span>Connect  with third-party systems, data sources, and applications. And if you require a custom integration, our platform makes plugin development simple, keeping your workflows flexible, scalable, and fully aligned with your enterprise goals.</span>
                </div>

                <div class="all-plugins">
                    <div class="block" :class="index % 2 && 'filled'" v-for="(item, index) in plugins">
                        <img :key="index" :src="item.path" alt="plugin"/>
                    </div>
                </div>
            </div>

            <NuxtLink href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                <span>Get a Demo</span>
            </NuxtLink>
        </div>
    </div>
</template>

<script>
  export default {
    name: "ProjectDetails",
    data() {
      return {
        plugins: [
          {path: '/landing/enterprise/plugin.svg'},
          {path: '/landing/enterprise/plugin-1.svg'},
          {path: '/landing/enterprise/plugin-2.svg'},
          {path: '/landing/enterprise/plugin-3.svg'},
          {path: '/landing/enterprise/plugin-4.svg'},
          {path: '/landing/enterprise/plugin-5.svg'},
          {path: '/landing/enterprise/plugin-6.svg'},
          {path: '/landing/enterprise/plugin-7.svg'},
          {path: '/landing/enterprise/plugin-8.svg'},
          {path: '/landing/enterprise/plugin-9.svg'},
          {path: '/landing/enterprise/plugin-10.svg'},
          {path: '/landing/enterprise/plugin-11.svg'},
          {path: '/landing/enterprise/plugin-12.svg'},
          {path: '/landing/enterprise/plugin-13.svg'},
          {path: '/landing/enterprise/plugin-14.svg'},
          {path: '/landing/enterprise/plugin-15.svg'},
          {path: '/landing/enterprise/plugin-16.svg'},
          {path: '/landing/enterprise/plugin-17.svg'},
          {path: '/landing/enterprise/plugin-18.svg'},
          {path: '/landing/enterprise/plugin-19.svg'},
          {path: '/landing/enterprise/plugin-20.svg'},
          {path: '/landing/enterprise/plugin-21.svg'},
        ],
      };
    },
  };
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .content {
        width: 100%;
        background-color: $white;
        padding-bottom: 120px;

        @media only screen and (max-width: 576px) {
            padding-bottom: 90px;
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 1120px;
            padding: 120px 0 0;
            background-color: $white;
            gap: $rem-2;

            @media only screen and (max-width: 1200px) {
                padding-left: $rem-2;
                padding-right: $rem-2;
            }

            .anything-scale {
                display: flex;
                align-items: center;
                gap: 64px;
                width: 100%;
                border-radius: 20px;
                background: linear-gradient(180deg, #21242E 0%, #1A1C24 100%);

                .image-fluid {
                    max-width: 548px;
                    width: 100%;
                    height: auto;
                }

                @media only screen and (max-width: 906px) {
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0;
                    padding: $rem-1;
                }

                .info {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    padding-left: 64px;
                    max-width: 480px;

                    @media only screen and (max-width: 906px) {
                        padding-left: 0;
                        gap: 8px;
                    }

                    p {
                        margin: 0;
                        font-family: $font-family-sans-serif;
                        font-size: $rem-2;
                        font-weight: 400;
                        line-height: 37.6px;
                        text-align: left;
                        color: $white;

                        @media only screen and (max-width: 576px) {
                            font-size: 24px;
                        }
                    }

                    span {
                        font-family: $font-family-sans-serif;
                        font-size: 14px;
                        font-weight: 300;
                        line-height: 22px;
                        text-align: left;
                        color: #D5D3DE;
                    }
                }
            }

            .declarative {
                display: flex;
                justify-content: space-between;
                gap: $rem-2;
                position: relative;

                @media only screen and (max-width: 990px) {
                    gap: 10px;
                }

                @media only screen and (max-width: 860px) {
                    flex-wrap: wrap;
                    justify-content: center;
                }


                .block {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    justify-content: space-between;
                    width: 100%;
                    background: linear-gradient(180deg, #21242E 0%, #1A1C24 100%);
                    border-radius: 20px;

                    @media only screen and (max-width: 860px) {
                        max-width: 600px;
                    }

                    .block-item {
                        padding: $rem-4 $rem-4 0;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;

                        @media only screen and (max-width: 860px) {
                            padding: $rem-2 $rem-2 10px $rem-2;
                            gap: 8px;
                        }
                    }

                    img {
                        padding: 0 0 0 $rem-4;
                        width: 100%;
                    }

                    .real-time {
                        img {
                            padding: 0 $rem-4;
                        }
                    }

                    p {
                        margin: 0;
                        font-family: $font-family-sans-serif;
                        font-size: $rem-2;
                        font-weight: 400;
                        line-height: 37.6px;
                        text-align: left;
                        color: $white;
                        @media only screen and (max-width: 576px) {
                            font-size: 24px;
                        }
                    }

                    span {
                        font-family: $font-family-sans-serif;
                        font-size: 14px;
                        font-weight: 300;
                        line-height: 22px;
                        text-align: left;
                        color: #D5D3DE;
                    }
                }
            }

            .bg-image {
                background-image: url(/landing/enterprise/plugins-bg.png);
                @media only screen and (max-width: 1200px) {
                    background-image: unset;
                    background: linear-gradient(180deg, #21242E 0%, #1A1C24 100%);
                }
            }

            .plugins {
                border-radius: 20px;
                padding: 60px 80px;
                display: flex;
                flex-direction: column;
                gap: 39px;

                @media only screen and (max-width: 860px) {
                    padding: $rem-2;
                    gap: 8px;
                }

                .header {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    align-items: center;

                    @media only screen and (max-width: 576px) {
                        align-items: start;
                        gap: 8px;
                        padding-bottom: 24px;
                    }

                    p {
                        font-family: $font-family-sans-serif;
                        font-size: 32px;
                        margin: 0;
                        font-weight: 400;
                        line-height: 37.6px;
                        text-align: center;
                        color: $white;

                        @media only screen and (max-width: 576px) {
                            font-size: 24px;
                            line-height: 30.6px;
                            text-align: start;
                        }
                    }

                    span {
                        font-family: $font-family-sans-serif;
                        font-size: 14px;
                        font-weight: 300;
                        line-height: 22px;
                        text-align: center;
                        color: #D5D3DE;
                        max-width: 514px;

                        @media only screen and (max-width: 576px) {
                            text-align: start;
                        }
                    }
                }

                .all-plugins {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;

                    .filled {
                        background-color: #00000017;
                    }

                    .block {
                        width: 85px;
                        height: 85px;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        @media only screen and (max-width: 576px) {
                            width: 45px;
                            height: 45px;
                        }

                        img {
                            cursor: pointer;
                            @media only screen and (max-width: 576px) {
                                width: 24px;
                                height: 24px;
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
                max-width: 121px;

                span {
                    color: $white;
                    font-family: $font-family-sans-serif;
                    font-size: $rem-1;
                    font-weight: 700;
                    line-height: 24px;
                    text-align: center;
                }
            }
        }
    }
</style>