<template>
    <div class="container">
        <h1 data-usal="fade-r" class="title text-center mb-3">
            End-To-End Solution for Managing <br />
            <span>Complex</span> Retail Operations
        </h1>
        <p class="description fw-light">{{ content.description }}</p>
        <div class="row m-0 content my-2 my-md-4">
            <template v-for="item in content.items">
                <div class="col-md-6 my-2 my-md-4">
                    <div class="d-flex">
                        <div class="icon">
                            <NuxtImg
                                width="69px"
                                height="69px"
                                loading="lazy"
                                format="webp"
                                :src="item.icon"
                                :alt="item.title"
                            />
                        </div>
                        <div>
                            <h4 class="fw-light mb-2">{{ item.title }}</h4>
                            <p>{{ item.text }}</p>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RetailOps",
        props: {
            content: {
                type: Object,
                required: true,
                default: () => ({
                    header: "",
                    description: "",
                    items: [],
                }),
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .description {
        text-align: center;
        font-size: $font-size-lg;
        max-width: $container-max-width;
        margin: $spacer auto 0;
        font-weight: 300;
    }

    .container {
        position: relative;
        z-index: 1;

        &::after {
            content: "";
            position: absolute;
            height: 266.493px;
            width: 170.248px;
            bottom: -70px;
            right: -100px;
            z-index: -1;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
            filter: blur(100px);
        }
    }

    .content {
        background: $black-2;
        padding: calc($spacer * 2.375) calc($spacer * 3);
        border-radius: 8px;

        @include media-breakpoint-down(lg) {
            padding: calc($spacer * 1.375) calc($spacer * 2);
        }

        @include media-breakpoint-down(md) {
            padding: calc($spacer * 0.375) $spacer;
        }

        @include media-breakpoint-down(sm) {
            padding: 0;
        }

        &::before {
            content: "";
            position: absolute;
            width: 228px;
            height: 480px;
            background: url("/retail/solutions/light-mask.svg") no-repeat;
            bottom: 0;
            left: 14px;
            z-index: 1;
            border-radius: 8px;
        }
    }

    .title {
        font-weight: 400;
        font-size: $font-size-3xl;
        span {
            background: var(--Text_gradient, linear-gradient(90deg, #e151f7 2%, #5c47f5 65%));
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .icon {
        margin-right: 1rem;
        height: 100px;
    }
</style>