<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="title-block mb-3">
                <p class="title" v-if="title">
                    Simplify Your <br />
                    <span>{{ title }}</span>
                </p>
                <p class="title" v-else v-html="titleHtml" />
                <p class="description" v-if="description">
                    {{ description }}
                </p>
            </div>
            <div class="row d-flex justify-content-center mt-5 cards-container">
                <div
                    class="col-12 col-md-6 col-lg-4 mb-4 z-2"
                    data-usal="zoomin"
                    v-for="cardItem in cardsData"
                >
                    <Card
                        :icon="cardItem.icon"
                        :cardInfo="cardItem.cardInfo"
                        :number="cardItem.number"
                        :title="cardItem.title"
                        :description="cardItem.description"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Card from "~/components/card/Card.vue"

    type CardDetail = {
        title?: string
        description?: string
    }

    type CardItem = {
        icon?: string
        cardInfo?: CardDetail
        title?: string
        description?: string
        number?: string
    }

    const props = withDefaults(
        defineProps<{
            title?: string
            description?: string | undefined
            titleHtml?: string
            cardsData: Array<CardItem>
        }>(),
        {
            description: undefined,
        },
    )
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        text-align: center;
        color: $white;
        font-family: $font-family-sans-serif;
        font-weight: 300;

        .container {
            padding-top: calc($spacer * 5.625);
            padding-bottom: calc($spacer * 5.625);
            background: #111113 url("/retail/header-mask.svg") 100% 100%;

            .title-block {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                z-index: 3;

                .title {
                    font-size: 3.125rem;
                    margin-bottom: $rem-1;
                    font-weight: 500;
                    line-height: 3.438rem;

                    :deep(span),
                    span {
                        background: linear-gradient(90deg, #e151f7 65.38%, #5c47f5 82.43%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    @include media-breakpoint-down(sm) {
                        font-size: 1.875rem !important;
                        line-height: calc($spacer * 1.875);
                    }
                }

                .description {
                    font-size: $h6-font-size;
                    font-weight: 400;
                    line-height: 1.625rem;
                    text-align: center;
                    color: $white;
                    max-width: 54%;

                    @include media-breakpoint-down(lg) {
                        font-size: $font-size-sm;
                        line-height: 1rem;
                        max-width: unset;
                    }
                }
            }

            .cards-container {
                position: relative;

                &::after {
                    content: "";
                    position: absolute;
                    height: 30rem;
                    width: 30rem;
                    bottom: 40%;
                    left: 40%;
                    z-index: 1;
                    filter: blur(100px);
                    background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
                }

                :deep(.card-title) {
                    text-align: left;
                }
            }
        }
    }

    .container-fluid.red {
        .title-block {
            .title {
                :deep(span) {
                    background: linear-gradient(
                        90.03deg,
                        #e3262f 57.94%,
                        #ab0009 87.71%
                    ) !important;
                    background-clip: text !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-fill-color: transparent !important;
                }
            }
        }

        .cards-container {
            &::after {
                background: linear-gradient(
                    180deg,
                    rgba(253, 114, 120, 0) 11.24%,
                    #e3262f 72.98%
                ) !important;
                bottom: 35% !important;
                width: 15rem !important;
                height: 15rem !important;
                left: 40% !important;
            }
        }

        :deep(.card-icon) {
            &::before {
                background: linear-gradient(
                    134.95deg,
                    #e3262f 18.11%,
                    #fcd8df 27.65%,
                    #db2727 36.31%,
                    rgba(219, 39, 39, 0) 58.84%,
                    rgba(252, 108, 108, 0.84) 80.5%
                ) !important;
            }

            .material-design-icon {
                filter: drop-shadow(2px 4px 4px rgba(171, 29, 28, 0.25));

                svg path {
                    fill: url(#featureiconsgradientRed) !important;
                }
            }
        }
    }
</style>