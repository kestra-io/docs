<template>
    <div class="container-fluid">
        <div class="container">
            <div class="business-container">
                <div class="business-by-us">
                    <div class="info-content">
                        <div class="info-item">
                            <div class="icon-block">
                                <img src="/demo/arrow-up-thin.svg" alt="Work">
                                <p>{{percent}}%</p>
                            </div>
                            <p>{{percentText}}</p>
                        </div>
                        <div class="vertical-line"></div>
                        <div class="info-item">
                            <h3 v-if="mainInfoHtml" v-html="mainInfoHtml"/>
                        </div>
                        <div class="vertical-line"></div>
                        <div class="info-item align-items-start">
                            <h3>{{companyInfo.personName}}</h3>
                            <p class="subtitle">{{companyInfo.personRole}}</p>
                            <img :src="companyInfo.logo" :alt="companyInfo.logoAlt">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      percent: {
        type: String,
        required: true,
      },
      percentText: {
        type: String,
        required: true,
      },
      mainInfoHtml: {
        type: String,
        required: true,
      },
      companyInfo: {
        type: Object,
        required: true,
      },
    },
  }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

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
            width: 16rem;
            height: 10rem;
            filter: blur(50px);
        }

        &::after {
            left: 0;
            bottom: -2.13rem;
        }

        &::before {
            right: 0;
            top: -6.625rem;
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

                    .icon-block {
                        display: flex;
                        align-items: center;
                        gap: 2px;

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
