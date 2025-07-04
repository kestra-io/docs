<template>
    <div class="container-fluid bg-dark-4">
        <div class="hero hero-sm container">
            <div class="row">
                <div class="col-lg-6 align-items-center d-flex order-1 order-lg-0">
                    <div>
                        <h1 data-aos="fade-right">
                            Provisioning <br>
                            <span>and Deployment</span>
                        </h1>
                        <p data-aos="fade-left" class="baseline">
                            Automate, Scale, Provision and Optimize Your Infrastructure with Kestra
                        </p>
                        <div class="cta">
                            <NuxtLink href="/demo" class="btn btn-animated btn-dark-animated me-3" data-aos="zoom-in">
                                Talk to us
                            </NuxtLink>
                            <NuxtLink href="/docs/getting-started/quickstart#start-kestra" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                                Get started
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 order-0 order-lg-1">
                    <NuxtImg
                        width="603px"
                        loading="lazy"
                        format="webp"
                        class="mt-md-0"
                        data-aos="zoom-in"
                        src="/landing/usecases/provisioning-and-deployment/header-hero.svg"
                        alt="Data Engineers"
                    />
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
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      imageSrc: {
        type: String,
        required: true,
      },
    },
  }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/usecases/cicd/bg.svg") no-repeat center;
        background-size: 100% 100%;
        padding-top: 80px;
        margin-top: -80px;
        position: relative;
        overflow: hidden;

        &::after {
            content: "";
            position: absolute;
            height: 20rem;
            width: 40%;
            bottom: 2%;
            left: 30%;
            z-index: -147;
            filter: blur(100px);
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
        }

        h1, p {
            color: $white;
            font-family: $font-family-sans-serif;
            font-weight: 300;
            padding-bottom: 0;
        }

        h1 {
            font-size: $font-size-4xl;
            margin-bottom: 16px;
            font-weight: 500;

            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
            }

            span {
                background: linear-gradient(90deg, #E151F7 65.38%, #5C47F5 82.43%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        p {
            font-size: $font-size-xl;

            @include media-breakpoint-down(sm) {
                font-size: $h6-font-size;
            }
        }

        img {
            width: 100%;
        }

        :deep(.hero.hero-sm) {
            border-bottom: 1px solid #FFFFFF1A;
        }
    }
</style>
