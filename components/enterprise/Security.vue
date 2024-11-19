<template>
    <div class="main-box">
        <div class="container">
            <div class="mb-5-rem security-item">
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <NuxtImg width="600px" height="750px" loading="lazy" format="webp" class="img-fluid" src="/landing/enterprise/security-1.png" alt="A dashboard with success or fail task events" />
                </div>
                <div class="item-info" data-aos="fade-right">
                    <div>
                        <h3>More Security</h3>
                        <p class="mt-3">
                            Ensures top-tier security with SSO, audit logs, and revision history for complete transparency. Integration with secrets managers and API tokens enhances secure automation, while end-to-end encryption protects your data at all times.
                        </p>
                        <NuxtLink href="/demo" class="demo-btn">
                            <span>Get a Demo</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="security-item mb-5-rem">
                <div class="col-md-6 order-0 order-md-1 rounded-2" data-aos="fade-left">
                    <NuxtImg width="600px" height="750px" loading="lazy" format="webp" class="img-fluid" src="/landing/enterprise/security-2.png" alt="Stylized view of administrator settings with role-based view" />
                </div>
                <div class="item-info" data-aos="fade-right">
                    <div>
                        <h3>Better Governance</h3>
                        <p class="mt-3">
                            Give your team secured, isolated environments and  control over workflows. With tailored automation and precise access management, you can ensure compliance and efficiency at scale.
                        </p>
                        <NuxtLink href="/demo" class="demo-btn">
                            <span>Get a Demo</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="security-item mb-5-rem">
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <NuxtImg radius="20" width="600px" height="750px" loading="lazy" format="webp" class="img-fluid" src="/landing/enterprise/security-3.png" alt="A dashboard with success or fail task events" />
                </div>
                <div class="item-info" data-aos="fade-right">
                    <div>
                        <h3>Scale with no limits</h3>
                        <p class="mt-3">
                            Kestra Enterprise scales with no downtime. Its reliable architecture and task runners, support both internal and external execution, minimize risk and provide performance insights—allowing you to optimize without worrying about infrastructure limitations.
                        </p>
                        <NuxtLink href="/demo" class="demo-btn">
                            <span>Get a Demo</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import Section from '../layout/Section.vue';
    export default {
      components: {Section},
    }
</script>
<style scoped lang="scss">
    @import "../../assets/styles/variable";
    :deep(section) {
        margin-top: calc($spacer * 7.8);
        position: relative;

        &:before {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            background: url("/landing/ee/background-mask.svg") no-repeat center;
            background-size: 156% 100%;
            overflow: hidden;
            top: -33%;
            z-index: -1;
        }
        .subtitle {
            margin: 0 !important;
            p {
                margin: 0 !important;
            }

            div.main {
                padding-top: 0 !important;
            }
        }
    }
    .main-box {
        width: 100%;
        background-color: $white;

        @media only screen and (max-width: 1200px) {
            padding-left: $rem-2;
            padding-right: $rem-2;
        }

        .container {
            padding: 120px 0;
            max-width: 1120px;
            border-top: none;

            @media only screen and (max-width: 769px) {
                padding-bottom: 40px;
                padding-top: 65px;
            }

            .img-fluid {
                border-radius: 10px;
            }

            .mb-5-rem {
                margin-bottom: $rem-5;
            }

            .security-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 64px;


                @media only screen and (max-width: 768px) {
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .item-info {
                    height: 100%;
                    text-align: start;
                    max-width: 476px;

                    h3 {
                        font-size: 41px;
                        color: #070708;
                        line-height: $rem-3;
                    }

                    @media only screen and (max-width: 768px) {
                        order: 1;
                    }
                }
            }

            .demo-btn {
                margin-top: 26px;
                cursor: pointer;
                padding: 10px 16px;
                max-width: 121px;
                background-color: #6862F5;
                border-radius: 4px;

                >span {
                    font-family: $font-family-sans-serif;
                    font-size: var(--fontsizemd);
                    font-weight: 700;
                    line-height: var(--fontline-heightmd);
                    text-align: center;
                    color: $white;
                }

                @media only screen and (max-width: 768px) {
                    margin-top: 10px;
                }
            }

            h3 {
                color: $black;
                font-family: $font-family-sans-serif;
                font-size: 41px;
                font-weight: 600;
                line-height: 48.18px;
                text-align: left;
                margin: 0;
            }

            p {
                color: #070708;
                font-size: 18px;
                line-height: 28px;
                text-align: left;
                font-weight: 400;
                max-width: calc($spacer * 28);

                @media only screen and (max-width: 420px) {
                    font-size: 18px;
                }

                b {
                    color: $white;
                    font-weight: 600;
                }
            }

            .image-container {
                position: relative;
                z-index: 10;

                &::before,
                &::after
                {
                    content: "";
                    position: absolute;
                    width: calc($spacer * 12);
                    height: calc($spacer * 12);
                    background: radial-gradient(50% 50% at 50% 50%, #343434 0%, rgba(127, 122, 232, 0) 195% 117%);
                    filter: blur(47px);
                    z-index: -5;
                }

                &::before {
                    left: -1rem;
                    top: 11rem;
                }

                &::after {
                    left: 27rem;
                    top: -2rem;
                }

                @include media-breakpoint-down(lg) {
                    &::after {
                        left: 13rem;
                    }

                    &::before {
                        left: -3rem;
                        top: 5rem;
                    }
                }

                @include media-breakpoint-down(md) {
                    &::after {
                        left: 23rem;
                    }
                }
            }

            .security-features {
                display: flex;
                justify-content: center;
                gap: calc($spacer * 1.8);
                position: relative;

                :deep(.title-block) {
                    align-items: center;
                }

                @include media-breakpoint-down(lg) {
                    flex-direction: column;
                    align-items: center;

                    :deep(.card) {
                        width: 60%;
                        justify-content: center;
                        align-items: center;
                    }
                }

                @include media-breakpoint-down(md) {
                    :deep(.card) {
                        width: auto;
                    }
                }
                &::before {
                    content: "";
                    position: absolute;
                    width: calc($spacer * 12);
                    height: calc($spacer * 12);
                    background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
                    filter: blur(100px);
                    z-index: -5;
                    left: 49rem;
                    top: -1rem;

                    @include media-breakpoint-down(lg) {
                        left: 35%;
                        top: 50%;
                    }
                }
            }
        }
    }
</style>
