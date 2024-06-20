<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 align-items-center d-flex order-1 order-lg-0">
                    <div class="company-info">
                        <NuxtImg
                            :width="logoWidth"
                            loading="lazy"
                            format="webp"
                            class="mt-md-0"
                            data-aos="zoom-in"
                            :src="logoPath"
                            :alt="logoAlt"
                        />
                        <p>Customer Success</p>
                        <h1 data-aos="fade-right" v-if="titleHtml" v-html="titleHtml" />
                        <p data-aos="fade-left" class="baseline">
                            {{description}}
                        </p>
                        <div class="cta">
                            <NuxtLink href="/demo" class="btn btn-dark me-3" data-aos="zoom-in">
                                Read the Story
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 order-0 order-lg-1">
                    <NuxtImg
                        width="626px"
                        loading="lazy"
                        format="webp"
                        class="mt-md-0 position-relative z-2 company-image mb-3"
                        data-aos="zoom-in"
                        :src="imageSrc"
                        :alt="imageAlt"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      titleHtml: {
        type: String,
        required: true,
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
      imageSrc: {
        type: String,
        required: true,
      },
      imageAlt: {
        type: String,
        required: true,
      },
      logoWidth: {
        type: String,
        required: true,
      },
    },
  }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        background-size: 100% 100%;
        padding: 6rem 0;
        position: relative;
        overflow: hidden;

        &::after {
            content: "";
            position: absolute;
            height: 20rem;
            width: 40%;
            bottom: 2%;
            left: 30%;
            z-index: 1;
            filter: blur(100px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
        }

        h1, p {
            color: $white;
            font-family: $font-family-sans-serif;
            font-weight: 300;
            padding-bottom: 0;
            margin: 0;
        }

        h1 {
            font-size: $h2-font-size;
            font-weight: 600;

            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
            }

            :deep(span) {
                background: linear-gradient(90deg, #E151F7 65.38%, #5C47F5 82.43%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        p {
            font-size: $h5-font-size;
            font-weight: 500;
            @include media-breakpoint-down(sm) {
                font-size: $h6-font-size;
            }
        }

        .company-info {
            display: flex;
            flex-direction: column;
            gap: $spacer;
            position: relative;
            z-index: 2;

        }

        .company-image {
            width: 100%;
        }
    }
</style>
