<template>
  <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-12 col-md-6 d-flex">
                    <div class="schedule-demo">
                        <h1>Lets Talk About <br><span>Orchestration</span></h1>
                        <p class="description">Connect with our product specialists and evaluate Kestra Enterprise</p>
                        <div class="cards">
                            <div class="card-item">
                                <div class="title-block">
                                    <img src="/demo/chart-areaspline.svg" alt="Work">
                                    <p class="title">Scale Your Work</p>
                                </div>
                                <p class="description">
                                    Accelerate workflow creation and deployment with Kestra Enterprise's automation and seamless integration.
                                </p>
                            </div>
                            <div class="card-item">
                                <div class="title-block">
                                    <img src="/demo/security.svg" alt="Work">
                                    <p class="title">Ensure Security and Compliance</p>
                                </div>
                                <p class="description">
                                    Guarantee the safety and integrity of your data with high-security standards, precise access control, and centralized secret management.
                                </p>
                            </div>
                            <div class="card-item">
                                <div class="title-block">
                                    <img src="/demo/handshake.svg" alt="Work">
                                    <p class="title">Empower Your Team</p>
                                </div>
                                <p class="description">
                                    Enable better collaboration and efficient workflow management, ensuring your team can operate smoothly and effectively across all business critical projects.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 align-items-center d-flex meeting-container">
                    <div class="meetings-iframe-container" data-src="https://meetings-eu1.hubspot.com/meetings/david76?embed=true"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
onMounted(() => {
    if (process.client) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
        document.body.appendChild(script);
    }
})

</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.container-fluid {
    color: var(--bs-white);
    overflow: hidden;
    background: url('/landing/features/declarative/header-bg.svg') no-repeat;
    background-size: cover;
    color: var(--bs-white);
    margin-top: -80px;
    padding-top: 80px;

    .hero {
        padding-top: 4rem !important;
        padding-bottom: 0;
        .schedule-demo {
            color: $white;

            @include media-breakpoint-up(lg) {
                padding: 0 calc($spacer * 6.25) calc($spacer * 1.25) 0;
            }

            h1 {
                margin-bottom: $spacer;
                font-size: $font-size-4xl;
                font-weight: 300;

                span {
                    background: var(--Text_gradient, linear-gradient(90deg, #E151F7 2.16%, #5C47F5 65.09%));
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
            p.description {
                font-size: $font-size-xl;
                font-weight: 300;
            }

            .cards {
                margin-top: calc($spacer * 1.3);
                display: flex;
                flex-direction: column;
                gap: calc($spacer * 2);

                .card-item {
                    display: flex;
                    flex-direction: column;
                    gap: calc($spacer / 2);

                    .title-block {
                        display: flex;
                        gap: calc($spacer / 2);
                        align-items: center;

                        img {
                            width: 42px;
                            height: 42px;
                        }
                        p.title {
                            margin: 0;
                            font-size: $font-size-xl;
                            font-weight: 600;
                            line-height: 2rem;
                        }
                    }

                    p.description {
                        font-size: $font-size-sm;
                        font-weight: 400;
                        line-height: 1.375rem;
                        color: $white-1;
                        margin: 0;
                    }
                }
            }
        }

        .meeting-container {
            position: relative;

            @include media-breakpoint-up(lg) {
                padding: calc($spacer * 1.25) calc($spacer * 0.5);
            }

            &::after, &::before {
                position: absolute;
                content: "";
                z-index: -2;
                width: 15.6rem;
                height: 15.6rem;
                background: linear-gradient(180deg, #6218FF 0%, #6117FF 100%);
                filter: blur(70px);
            }


            &::after {
                right: 25rem;
                bottom: 9.375rem;
            }

            &::before {
                left: 27.3rem;
                top: 2rem;
            }


            @include media-breakpoint-down(xxl) {
                &::after, &::before {
                    width: 10rem;
                    height: 10rem;
                }
                &::after {
                    right: 23rem;
                    bottom: 9.375rem
                }

                &::before {
                    left: 23rem;
                }
            }

            @include media-breakpoint-down(lg) {
                &::after {
                    right: 12rem;
                }

                &::before {
                    left: 12rem;
                }
            }

            @include media-breakpoint-down(md) {
                &::after {
                    right: 24rem;
                }

                &::before {
                    left: 24rem;
                }
            }

            .meetings-iframe-container {
                width: 100%;
                position: relative;

                &::after, &::before {
                    position: absolute;
                    content: "";
                    z-index: -2;
                    width: 15.6rem;
                    height: 15.6rem;
                    background: linear-gradient(180deg, #7021ff 0%, #6305bf 100%);
                    filter: blur(50px);
                }

                &::after {
                    left: 27.6rem;
                    bottom: 4.87rem;
                }

                &::before {
                    right: 24.875rem;
                    top: 0.625rem;
                }

                @include media-breakpoint-down(xxl) {
                    &::after {
                        left: 16.6rem;
                        bottom: 6.87rem;
                    }

                    &::before {
                        right: 15.875rem;
                    }
                }

                @include media-breakpoint-down(lg) {
                    &::after, &::before {
                        width: 10rem;
                        height: 10rem;
                    }

                    &::after {
                        left: 11.6rem;
                    }

                    &::before {
                        right: 11.8rem;
                    }
                }

                @include media-breakpoint-down(md) {
                    &::after {
                        left: 22rem;
                    }

                    &::before {
                        right: 22rem;
                    }
                }

            }
        }
    }
}
</style>