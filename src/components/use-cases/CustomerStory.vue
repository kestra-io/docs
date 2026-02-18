<template>
    <section class="container-fluid ">
        <div class="container">
            <div class="row align-items-end">
                <div class="col-lg-6 align-items-center d-flex order-1 order-lg-0">
                    <div class="company-info">
                        <div
                            class="mt-md-0 mt-4 mb-4"
                            :style="{ width: logo.width }"
                            v-html="logo.src"
                            role="img"
                            :aria-label="logo.alt"
                            data-usal="zoomin"
                        />
                        <p>Customer Success</p>
                        <h2 data-usal="fade-r" v-if="title" v-html="title" class="my-4" />
                        <p data-usal="fade-l">
                            {{ description }}
                        </p>
                        <div class="mt-4">
                            <a :href="href" class="btn btn-secondary" data-usal="zoomin">
                                Read the Story
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 order-0 order-lg-1">
                    <img
                        width="626px"
                        class="mt-md-0 position-relative z-2 company-image"
                        data-usal="zoomin"
                        :src="image.src"
                        :alt="image.alt"
                    />
                </div>
            </div>
        </div>
    </section>
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
            logo: {
                type: Object,
                required: true,
                default: () => ({
                    src: "",
                    alt: "",
                    width: "",
                }),
            },
            image: {
                type: Object,
                required: true,
                default: () => ({
                    src: "",
                    alt: "",
                }),
            },
            href: {
                type: String,
                required: true,
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        background-size: 100% 100%;
        position: relative;
        overflow: hidden;
        padding: calc($spacer * 4) $spacer;
        background-color: var(--ks-background-secondary);
        h2,
        p {
            color: var(--ks-content-primary);
            font-weight: 500;
            padding-bottom: 0;
            margin: 0;
        }
        .company-image {
            width: 100%;
        }
        .company-info {
            :deep(svg) {
                width: 100%;
                height: auto;
            }
        }
    }
</style>