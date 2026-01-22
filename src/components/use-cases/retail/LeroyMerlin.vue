<template>
    <div class="base-container">
        <div class="container header" data-usal="fade-r">
            <div class="row">
                <div class="col-md-6">
                    <div>
                        <NuxtImg
                            :width="content.logo.width"
                            :height="content.logo.height"
                            loading="lazy"
                            format="webp"
                            :src="content.logo.href"
                            :alt="content.logo.alt"
                        />
                        <p class="my-3 subtitle">{{ content.logo.subtitle }}</p>
                    </div>
                    <h4 class="title fw-light">
                        Leroy Merlin France enabling data <br />mesh architecture and 900% <br />
                        increase in productivity with Kestra:<br />
                    </h4>
                    <p class="description my-4 fw-light">
                        {{ content.description }}
                    </p>
                    <div class="d-flex flex-wrap gap-2">
                        <a :href="content.cta.href">
                            <button class="btn btn-dark" :class="content.cta.style">
                                {{ content.cta.text }}
                            </button>
                        </a>
                    </div>
                </div>

                <div class="col-lg-6">
                    <NuxtImg
                        :width="content.image.width"
                        :height="content.image.height"
                        loading="lazy"
                        format="webp"
                        class="zoom img-fluid"
                        :src="content.image.href"
                        :alt="content.image.alt"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "LeroyMerlin",

        props: {
            content: {
                type: Object,
                required: true,
                default: () => ({
                    description: "",
                    cta: [],
                    logo: {},
                    image: {},
                    background: "",
                }),
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .subtitle {
        font-size: $font-size-base;
    }

    .base-container {
        position: relative;
        &::after {
            content: "";
            position: absolute;
            height: 272px;
            width: 176px;
            top: 48px;
            left: 256px;
            z-index: 1;
            filter: blur(100px);
            background: linear-gradient(180deg, rgba(24, 172, 255, 0) 0%, #17ff58 100%);
        }
    }

    .title {
        background: url("/retail/header-mask.svg") no-repeat center;
        font-size: $h3-font-size;
    }

    .description {
        font-size: $h6-font-size;
    }

    .btn-dark {
        --bs-btn-bg: $black-4;
        --bs-btn-hover-bg: $black-4;
        border: 1px solid $black-6;
    }
</style>