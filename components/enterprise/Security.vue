<template>
    <div class="content">
        <div class="sticky-features-wrapper">
            <div class="scroll-block">
                <div class="sticky-features-item">
                    <div class="features-item-content w--current" :class="{'w--current': isItemInView(0)}">
                        <h3>More Security</h3>
                        <p class="mt-3">
                            Ensures top-tier security with SSO, audit logs, and revision history for complete
                            transparency. Integration with secrets managers and API tokens enhances secure automation,
                            while end-to-end encryption protects your data at all times.
                        </p>
                        <NuxtLink href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                            <span>Get a Demo</span>
                        </NuxtLink>
                    </div>
                </div>
                <div class="sticky-features-item">
                    <div class="features-item-content" :class="{'w--current': isItemInView(1)}">
                        <h3>Better Governance</h3>
                        <p class="mt-3">
                            Give your team secured, isolated environments and control over workflows. With tailored
                            automation and precise access management, you can ensure compliance and efficiency at scale.
                        </p>
                        <NuxtLink href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                            <span>Get a Demo</span>
                        </NuxtLink>
                    </div>
                </div>
                <div class="sticky-features-item mb__5">
                    <div class="features-item-content" :class="{'w--current': isItemInView(2)}">
                        <h3>Scale with no limits</h3>
                        <p class="mt-3">
 Kestra Enterprise scales with no downtime. Its reliable architecture and task runners, support both internal and external execution, minimize risk and provide performance insights—allowing you to optimize without worrying about infrastructure limitations.
                        </p>
                        <NuxtLink href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                            <span>Get a Demo</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="sticky-features-visuals">
                <div class="sticky-features-sticky">
                    <div class="sticky-features-box">
                        <img
                            class="u-img-cover"
                            :src="imageUrls[getCurrentImageIndex()]"
                            alt="A dashboard with success or fail task events"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row mb-5-rem security-item">
                <div class="col-md-6 order-0 order-md-1 d-flex justify-content-center" data-aos="fade-left">
                    <img
                        class="img-fluid"
                        src="/landing/enterprise/security-1-1.svg"
                        alt="A dashboard with success or fail task events"
                    />
                </div>
                <div class="item-info" data-aos="fade-right">
                    <div>
                        <h3>More Security</h3>
                        <p class="mt-3">
                            Ensures top-tier security with SSO, audit logs, and revision history for complete
                            transparency. Integration with secrets managers and API tokens enhances secure automation,
                            while end-to-end encryption protects your data at all times.
                        </p>
                        <NuxtLink href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                            <span>Get a Demo</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="security-item mb-5-rem">
                <div class="col-md-6 order-0 order-md-1 rounded-2" data-aos="fade-left">
                    <img
                        class="img-fluid"
                        src="/landing/enterprise/security-2-2.svg"
                        alt="A dashboard with success or fail task events"
                    />
                </div>
                <div class="item-info" data-aos="fade-right">
                    <div>
                        <h3>Better Governance</h3>
                        <p class="mt-3">
                            Give your team secured, isolated environments and control over workflows. With tailored
                            automation and precise access management, you can ensure compliance and efficiency at scale.
                        </p>
                        <NuxtLink href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                            <span>Get a Demo</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="security-item mb-5-rem">
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <img
                        class="img-fluid"
                        src="/landing/enterprise/security-3-3.svg"
                        alt="A dashboard with success or fail task events"
                    />
                </div>
                <div class="item-info" data-aos="fade-right">
                    <div>
                        <h3>Scale with no limits</h3>
                        <p class="mt-3">
                            Kestra Enterprise scales with no downtime. Its reliable architecture and task runners,
                            support both internal and external execution, minimize risk and provide performance
                            insights—allowing you to optimize without worrying about infrastructure limitations.
                        </p>
                        <NuxtLink href="/demo" class="demo-btn btn btn-animated btn-purple-animated">
                            <span>Get a Demo</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        itemPositions: [],
        prevImageIndex: 0,
        imageUrls: {
          0: '/landing/enterprise/security-1-1.svg',
          1: '/landing/enterprise/security-2-2.svg',
          2: '/landing/enterprise/security-3-3.svg',
        },
      }
    },
    mounted() {
      this.updateItemPositions();
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      updateItemPositions() {
        this.itemPositions = [];
        const items = this.$el.querySelectorAll('.sticky-features-item');
        items.forEach(item => {
          const rect = item.getBoundingClientRect();
          this.itemPositions.push({rect, isCentered: false});
        });
      },
      handleScroll() {
        this.updateItemPositions();
        this.itemPositions.forEach((item, index) => {
          const centerOfViewport = window.innerHeight / 2;
          const itemCenter = item.rect.top + item.rect.height / 2;
          const isCentered = Math.abs(itemCenter - centerOfViewport) <= 150;
          this.itemPositions[index] = {...item, isCentered};
        });
      },
      isItemInView(index) {
        return this.itemPositions[index] && this.itemPositions[index].isCentered;
      },
      getCurrentImageIndex() {
        for (let i = 0; i < this.itemPositions.length; i++) {
          if (this.isItemInView(i)) {
            this.prevImageIndex = i;
            return i;
          }
        }
        return this.prevImageIndex;
      },
    },
  }
</script>
<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .content {
        padding: 160px 0;
        display: flex;
        background-color: $white;
        position: relative;
        justify-content: center;
        width: 100%;

        @include media-breakpoint-down(xl) {
            padding: 120px $rem-2;
        }

        @include media-breakpoint-down(md) {
            padding: 60px $rem-2;
        }

        .sticky-features-wrapper {
            display: grid;
            grid-template-columns: 42% 54%;
            position: relative;
            max-width: 1120px;
            justify-content: space-between;
            @media only screen and (max-width: 767px) {
                display: none;
            }

            .sticky-features-visuals {
                align-self: stretch;
                position: relative;

                .sticky-features-sticky {
                    border-radius: 4px;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    padding-top: 74vh;
                    display: flex;
                    position: sticky;
                    top: 16vh;

                    .sticky-features-box {
                        border: 1px solid var(--color--grey-border);
                        border-radius: 4px;
                        height: 100%;
                        position: absolute;
                        inset: 0%;

                        .u-img-cover {
                            object-fit: cover;
                            object-position: 50% 50%;
                            width: 100%;
                            max-width: 600px;
                            height: 100%;
                            inset: 0%;
                            border-radius: 20px;
                        }
                    }
                }
            }

            .scroll-block {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 500px;
                padding: 200px 0;

                .w--current {
                    opacity: 1 !important;
                    cursor: default;
                    overflow: visible;
                }

                .mb__5 {
                    padding-bottom: 50px !important;
                }

                .sticky-features-item {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    padding-bottom: 0;
                    gap: 64px;
                    height: 50%;

                    .features-item-content {
                        transition: opacity .3s;
                        opacity: .15;
                        cursor: default;
                        padding: 0;
                        text-decoration: none;
                        position: relative;
                        @media only screen and (max-width: 768px) {
                            flex-wrap: wrap;
                            justify-content: center;
                        }

                        h3 {
                            font-weight: 400;
                            font-size: 41px;
                            color: #070708;
                            line-height: $rem-3;
                        }

                        p {
                            font-size: 18px;
                            color: #070708;
                            line-height: 28px;
                        }
                    }
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

            > span {
                font-family: $font-family-sans-serif;
                font-size: var(--fontsizemd);
                font-weight: 700;
                text-align: center;
                color: $white;
            }
        }


        .container {
            padding: 120px 0;
            max-width: 1120px;
            border-top: none;
            display: none;

            @media only screen and (max-width: 767px) {
                display: block;
            }

            @include media-breakpoint-down(md) {
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


                @include media-breakpoint-down(md) {
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .item-info {
                    height: 100%;
                    text-align: start;
                    max-width: 476px;

                    h3 {
                        font-weight: 400;
                        font-size: 41px;
                        color: #070708;
                        line-height: $rem-3;
                    }

                    @include media-breakpoint-down(md) {
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

                > span {
                    font-family: $font-family-sans-serif;
                    font-size: var(--fontsizemd);
                    font-weight: 700;
                    line-height: var(--fontline-heightmd);
                    text-align: center;
                    color: $white;
                }

                @include media-breakpoint-down(md) {
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
                &::after {
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


