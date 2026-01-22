<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="title-block mb-3">
                <NuxtImg
                    width="100px"
                    loading="lazy"
                    format="webp"
                    class="mt-md-0"
                    data-aos="zoom-in"
                    :src="logoPath"
                    :alt="logoAlt"
                />
                <p class="title" v-if="title">
                    Unlock the <span>Potential</span> of Your <br>{{title}}
                </p>
                <p class="description">
                    {{description}}
                </p>
            </div>
            <div class="row d-flex justify-content-center align-items-stretch mt-5 unlock-row">
                <div
                    class="col-5 col-md-5 col-lg-5 mb-4 z-2 unlock-col d-flex"
                    data-aos="zoom-in"
                >
                    <div class="unlock-content unlock-content-left">
                        <template v-for="info in unlockContent.leftContent">
                            <p class="content-title">{{info.title}}</p>
                            <p class="content-description">{{info.description}}</p>
                        </template>
                    </div>
                </div>
                <div
                    class="col-2 col-md-2 col-lg-2 mb-4 z-2 connection-line-wrapper d-flex"
                    data-aos="zoom-in"
                >
                    <UseCasesDeploymentConnectionLine :strokeColor="strokeColor" />
                </div>
                <div
                    class="col-5 col-md-5 col-lg-5 mb-4 z-2 unlock-col d-flex"
                    data-aos="zoom-in"
                >
                    <div class="unlock-content unlock-content-right">
                        <template v-for="info in unlockContent.rightContent">
                            <p class="content-description">{{info.description}}</p>
                            <p class="content-title">{{info.title}}</p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: true,
      },
      logoPath: {
        type: String,
        required: true,
      },
      logoAlt: {
        type: String,
        required: true,
      },
      strokeColor: {
        type: String,
        required: true,
      },
      unlockContent: {
        type: Object,
        required: true,
      },
    },
  }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        text-align: center;
        color: $white;
        font-family: $font-family-sans-serif;
        font-weight: 300;

        .container {
            padding-top: calc($spacer * 5.625);
            padding-bottom: calc($spacer * 5.625);

            @include media-breakpoint-down(lg) {
                padding-top: calc($spacer * 3);
                padding-bottom: calc($spacer * 3);
            }

            @include media-breakpoint-down(md) {
                padding-top: calc($spacer * 2);
                padding-bottom: calc($spacer * 2);
            }

            .title-block {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                z-index: 3;

                .title {
                    font-size: 3.125rem;
                    margin-bottom: $rem-1;
                    font-weight: 500;
                    line-height: 3.438rem;

                    :deep(span), span {
                        background: linear-gradient(90deg, #E151F7 65.38%, #5C47F5 82.43%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    @include media-breakpoint-down(lg) {
                        font-size: 2.5rem;
                        line-height: 2.75rem;
                    }

                    @include media-breakpoint-down(md) {
                        font-size: 2rem;
                        line-height: 2.25rem;
                    }

                    @include media-breakpoint-down(sm) {
                        font-size: 1.875rem !important;
                        line-height: calc($spacer * 1.875);
                    }
                }


                .description {
                    font-size: $h6-font-size;
                    font-weight: 400;
                    line-height: 1.625rem;
                    text-align: center;
                    color: $white;
                    max-width: 54%;

                    @include media-breakpoint-down(lg) {
                        font-size: $font-size-sm;
                        line-height: 1.5rem;
                        max-width: 70%;
                    }

                    @include media-breakpoint-down(md) {
                        font-size: $font-size-sm;
                        line-height: 1.375rem;
                        max-width: 85%;
                    }

                    @include media-breakpoint-down(sm) {
                        font-size: $font-size-xs;
                        line-height: 1.25rem;
                        max-width: 95%;
                    }
                }

            }

            .unlock-content {
                display: flex;
                flex-direction: column;
                gap: 8rem;
                padding-top: calc($spacer * 5);
                position: relative;

                &.unlock-content-left {
                    text-align: end;
                }

                &.unlock-content-right {
                    text-align: start;
                }

                @include media-breakpoint-down(lg) {
                    gap: 3rem;
                    padding-top: calc($spacer * 2.5);
                }

                @include media-breakpoint-down(md) {
                    gap: 2rem;
                    padding-top: calc($spacer * 1.5);
                }

                @include media-breakpoint-down(sm) {
                    gap: 1.25rem;
                    padding-top: calc($spacer * 0.75);
                }

                .content-title {
                    font-family: $font-family-sans-serif;
                    font-size: $h2-font-size;
                    font-weight: 500;
                    line-height: 50px;
                    margin: 0;
                    position: relative;
                    
                    @include media-breakpoint-down(lg) {
                        font-size: $h4-font-size;
                        line-height: 1.75rem;
                    }
                    
                    @include media-breakpoint-down(md) {
                        font-size: $h5-font-size;
                        line-height: 1.5rem;
                    }
                    
                    @include media-breakpoint-down(sm) {
                        font-size: $font-size-base;
                        line-height: 1.375rem;
                        margin-bottom: calc($spacer * 0.25);
                    }
                }

                .content-description {
                    font-family: $font-family-sans-serif;
                    font-size: $h6-font-size;
                    font-weight: 500;
                    line-height: 1.75rem;
                    color: $white-1;
                    margin: 0;
                    
                    @include media-breakpoint-down(lg) {
                        font-size: $font-size-sm;
                        line-height: 1.5rem;
                        max-width: unset;
                    }
                    
                    @include media-breakpoint-down(md) {
                        font-size: $font-size-xs;
                        line-height: 1.25rem;
                    }
                    
                    @include media-breakpoint-down(sm) {
                        font-size: $font-size-xs;
                        line-height: 1.125rem;
                        margin-top: calc($spacer * 0.25);
                    }
                }
            }

            .unlock-row {
                @include media-breakpoint-down(lg) {
                    margin-top: calc($spacer * 3) !important;
                }

                @include media-breakpoint-down(md) {
                    margin-top: calc($spacer * 2) !important;
                }

                @include media-breakpoint-down(sm) {
                    margin-top: calc($spacer * 1.5) !important;
                }
            }

            .unlock-col {
                @include media-breakpoint-down(sm) {
                    padding-left: calc($spacer * 0.5);
                    padding-right: calc($spacer * 0.5);
                }

                &.d-flex {
                    flex-direction: column;
                }
            }

            .connection-line-wrapper {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                padding-top: calc($spacer * 5);
                position: relative;
                flex-direction: column;

                @include media-breakpoint-down(lg) {
                    padding-top: calc($spacer * 2.5);
                    padding-left: 0;
                    padding-right: 0;
                    margin: 0;
                }

                @include media-breakpoint-down(md) {
                    padding-top: calc($spacer * 1.5);
                    padding-left: 0;
                    padding-right: 0;
                    margin: 0;
                }

                @include media-breakpoint-down(sm) {
                    padding-top: calc($spacer * 0.5);
                    padding-left: 0;
                    padding-right: 0;
                    margin: 0;
                    margin-top: calc($spacer * 0.25);
                }

                :deep(.connection-line-svg) {
                    @include media-breakpoint-down(lg) {
                        margin-top: calc($spacer * -0.125);
                    }

                    @include media-breakpoint-down(md) {
                        margin-top: calc($spacer * -0.375);
                    }

                    @include media-breakpoint-down(sm) {
                        margin-top: calc($spacer * -0.625);
                    }
                }
            }
        }
    }
</style>
