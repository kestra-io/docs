<template>
    <section>
        <div class="container">
            <h1 data-usal="fade-r" class="title text-center mb-3">
                <span class="highlight" v-html="title"></span>
            </h1>
            <p class="description fw-light">{{ description }}</p>
            <div class="row m-0 content mt-4">
                <template v-for="item in items">
                    <div class="col-md-6 my-2 my-md-4">
                        <div class="d-flex">
                            <div class="icon">
                                <img width="69px" height="69px" loading="lazy" format="webp" :src="item.icon"
                                    :alt="item.title" />
                            </div>
                            <div>
                                <h4 class="mb-2">{{ item.title }}</h4>
                                <p>{{ item.text }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "RetailOps",
        props: {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            items: {
                type: Array,
                required: true,
                default: () => [],
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    section {
        z-index: 1;
        padding: calc($spacer * 3) $spacer;
        .description {
            text-align: center;
            max-width: $container-max-width;
            margin: $spacer auto 0;
            font-weight: 300;
        }
        .content {
            background: var(--ks-background-secondary);
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
            .title {
                max-width: $container-max-width;
                margin: $spacer auto 0;
            }
            .icon {
                margin-right: 1rem;
                height: 100px;
            }
        }
    }
</style>