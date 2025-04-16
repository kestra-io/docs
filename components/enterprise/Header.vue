<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="justify-content-center row">
                <div class="row justify-content-center align-items-center flex-column w-100 header-content">
                    <p class="text-center header-desc">Built For Critical Use Cases</p>
                    <h1 data-aos="fade-right">Scale With Kestra <br> Enterprise Edition</h1>
                    <div class="d-flex flex-wrap gap-2 button-group">
                        <NuxtLink href="/demo" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                            Talk to sales
                        </NuxtLink>
                    </div>
                    <div class="teams-content">
                        <p>Trusted by Teams From:</p>
                        <div class="teams-logos">
                            <div>
                                <NuxtImg
                                    width="100%"
                                    loading="lazy"
                                    format="webp"
                                    class="img-fluid"
                                    src="/landing/enterprise/teams/LM.svg"
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
                                    src="/landing/enterprise/teams/BHP.svg"
                                    alt="BHP"
                                    data-aos="fade-left"
                                />
                            </div>
                            <div>
                                <NuxtImg
                                    width="100%"
                                    loading="lazy"
                                    format="webp"
                                    class="img-fluid"
                                    src="/landing/enterprise/teams/ACXIOM.svg"
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
                                    src="/landing/enterprise/teams/ITZ.svg"
                                    alt="itzbund"
                                    data-aos="fade-left"
                                />
                            </div>
                            <div>
                                <NuxtImg
                                    width="100%"
                                    loading="lazy"
                                    format="webp"
                                    class="img-fluid"
                                    src="/landing/enterprise/teams/T-SYSTEM.svg"
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
                                    src="/landing/enterprise/teams/COE.svg"
                                    alt="European Council"
                                    data-aos="fade-left"
                                />
                            </div>
                            <div>
                                <NuxtImg
                                    width="100%"
                                    loading="lazy"
                                    format="webp"
                                    class="img-fluid"
                                    src="/landing/enterprise/teams/BATTELLE.svg"
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
                                    src="/landing/enterprise/teams/DATAPORT.svg"
                                    alt="Battelle"
                                    data-aos="fade-left"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <EnterpriseMeetKestra/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);
        padding-top: 5rem;
        padding-right: 0;
        padding-left: 0;
        position: relative;
        @include media-breakpoint-down(md) {
            padding-top: $rem-10;
        }

        &::after {
            content: "";
            background-image: url(/landing/enterprise/bg-left.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            z-index: -50;
            top: 435px;
            width: 538px;
            height: 830px;
            @include media-breakpoint-down(xl) {
                width: 335px;
                height: 700px;
            }

            @include media-breakpoint-down(md) {
                width: 300px;
                height: 600px;
            }

            @include media-breakpoint-down(sm) {
                display: none;
            }
        }

        &::before {
            content: "";
            background-image: url(/landing/enterprise/bg-right.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: -67px;
            right: 0;
            z-index: -50;
            width: 480px;
            height: 566px;

            @include media-breakpoint-down(xl) {
                width: 400px;
                height: 450px;
            }

            @include media-breakpoint-down(md) {
                width: 300px;
                height: 420px;
            }


            @include media-breakpoint-down(sm) {
                background-image: url(/landing/enterprise/bg-right-mobile.png);
                width: 240px;
                height: 380px;
                top: -25px;
            }
        }


        @include media-breakpoint-down(xxl) {
            background-position: 30% 54%;
        }

        @include media-breakpoint-down(lg) {
            background-position: 50% 80%;
        }

        @include media-breakpoint-down(md) {
            background-position: 68% 389%;
            background-size: 307% 107%;
        }

        @include media-breakpoint-down(sm) {
            background-size: auto;
            background-position: 60% 200%;
        }

        .container {
            border-bottom: $block-border;

            .header-content {
                @include media-breakpoint-down(md) {
                    align-items: start !important;
                }
            }

            h1 {
                font-size: $font-size-4xl;
                font-weight: 400;
                font-family: $font-family-sans-serif;
                width: fit-content !important;
                @include media-breakpoint-down(lg) {
                    font-size: $font-size-2xl !important;
                }
            }

            .header-desc {
                color: $purple-38;
                font-size: calc($spacer * 1.5);
                font-weight: 400;
                margin-bottom: 30px;
                text-align: center;

                @include media-breakpoint-down(lg) {
                    font-size: $font-size-md !important;
                    margin-bottom: 10px;
                }

                @include media-breakpoint-down(md) {
                    text-align: start !important;

                }
            }

            span {
                background: linear-gradient(90deg, #E151F7 0.45%, #5C47F5 43.61%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: $font-size-4xl;
                font-family: $font-family-sans-serif;

                @include media-breakpoint-down(lg) {
                    font-size: 1.625rem !important;
                }
            }

            .button-group {
                width: fit-content;
            }

            .teams-content {
                margin-top: calc($spacer * 2.125);
                width: fit-content;
                padding: $rem-2 0 $rem-6 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                @include media-breakpoint-down(sm) {
                    align-items: start !important;
                    padding: $rem-2 0;
                }

                p {
                    padding: 0 14px;
                    font-size: $font-size-xl;
                    font-weight: 300;
                    line-height: 25.85px;
                    text-align: center;
                    @include media-breakpoint-down(sm) {
                        text-align: start;
                        font-size: $rem-1;
                    }
                }

                .teams-logos {
                    display: flex;
                    column-gap: 8px;
                    row-gap: 20px;
                    padding: 0 8px;

                    img {
                        height: 75px;       // Fixed height for uniformity
                        width: auto;        // Let the width adjust automatically
                        object-fit: contain; 
                        
                    }

                    @include media-breakpoint-down(sm) {
                        column-gap: 21px;
                    }

                    @include media-breakpoint-down(md) {
                        flex-wrap: wrap;
                    }

                }
            }

            @include media-breakpoint-down(sm) {
                h1, h1 > span {
                    font-size: 1.625rem !important;
                    max-width: 100%;
                }
            }

        }

        .hero {
            padding-bottom: 5rem;
            padding-top: 0rem;
            @include media-breakpoint-down(md) {
                padding-top: 0;
            }

            .baseline {
                font-weight: 300;
            }
        }

    }
</style>
