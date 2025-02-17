<template>
    <div class="container mb-5">
        <div class="business-container">
            <div class="business-by-us">
                <div class="info-content">
                    <div class="info-item">
                        <div class="icon-block">
                            <img src="/demo/arrow-up-thin.svg" alt="Work">
                            <p>900%</p>
                        </div>
                        <p>in data production</p>
                    </div>
                    <div class="vertical-line"></div>
                    <div class="info-item">
                        <h3>“What was delivered in weeks is now completed <br> in days with full control for a great partnership.”</h3>
                    </div>
                    <div class="vertical-line"></div>
                    <div class="info-item align-items-start">
                        <h3>Julien Henrion</h3>
                        <p class="subtitle">Head of Data Engineering</p>
                        <img src="/landing/enterprise/leroymerlin.svg" alt="Leroy Merlin">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .business-container {
        margin-top: 4rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: calc($spacer * 1.625);
        background-color: $black-2;
        border-radius: calc($spacer * 0.5);
        border: 1px solid #404559;
        overflow: hidden;
        position: relative;

        &::after, &::before {
            position: absolute;
            content: "";
            z-index: 0;
            width: 10rem;
            height: 10rem;
            background: linear-gradient(180deg, #7021ff 0%, #6305bf 100%);
            filter: blur(100px);
        }

        &::after {
            left: 0;
            bottom: 4.87rem;
        }

        &::before {
            right: 0;
            top: 6.625rem;
        }

        @include media-breakpoint-down(md) {
            &::after, &::before {
                width: 8rem;
                height: 8rem;
            }

            &::after {
                bottom: -4.87rem;
            }

            &::before {
                top: -4.375rem;
            }
        }

        .business-by-us {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: calc($spacer * 0.758);

            .info-content {
                display: flex;
                gap: 2rem;
                justify-content: space-around;
                align-items: center;
                z-index: 4;

                @include media-breakpoint-down(lg) {
                    flex-direction: column;
                }

                .vertical-line {
                    background-color: #FFFFFF30;
                    min-height: calc($spacer * 6.875);
                    width: 1px;
                    @include media-breakpoint-down(lg) {
                        height: 1px;
                        min-height: 1px;
                        width: 100%;
                    }
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: calc($spacer * 0.5);
                    align-items: center;

                    h3, p {
                        margin: 0;
                        color: $white;
                    }

                    h3 {
                        font-size: $font-size-lg;
                        font-weight: 600;
                    }

                    p {
                        font-size: $font-size-sm;
                        font-weight: 400;
                    }

                    p.subtitle {
                        color: $purple;
                    }

                    .icon-block {
                        display: flex;
                        align-items: center;
                        gap: 2px;
                        :deep(.arrow-up-thin-icon) {
                            width: 24px;
                            height: 24.41px;
                            .material-design-icon__svg {
                                fill: #736BCD;
                                width: 24px;
                                height: 24px;
                                bottom: 0;
                            }
                        }

                        p {
                            font-weight: 800;
                            margin: 0;
                            font-size: $h3-font-size;
                        }
                    }

                }
            }
        }
    }
</style>
