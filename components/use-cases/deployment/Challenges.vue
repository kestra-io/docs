<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="title-block mb-3">
                <p class="title" v-if="title">
                    Simplify Your <br>
                    <span>{{title}}</span>
                </p>
                <p class="title" v-else v-html="titleHtml" />
                <p class="description" v-if="description">
                    {{ description }}
                </p>
            </div>
            <div class="row d-flex justify-content-center mt-5 cards-container">
                <div
                    class="col-12 col-md-6 col-lg-4 mb-4 z-2"
                    data-aos="zoom-in"
                    v-for="cardItem in cardsData"
                >
                    <Card
                        :icon="cardItem.icon"
                        :cardInfo="cardItem.cardInfo"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue";
    import CommentQuoteOutline from "vue-material-design-icons/CommentQuoteOutline.vue";
    import ChartBellCurve from "vue-material-design-icons/ChartBellCurve.vue";
    import FileChartOutline from "vue-material-design-icons/FileChartOutline.vue";
    import ImageFilterCenterFocus from "vue-material-design-icons/ImageFilterCenterFocus.vue";
    import Card from '../../card/Card.vue';

    type CardItem = {
        icon?: string;
        cardInfo?: any;
    };

    const props = withDefaults(defineProps<{
        title?: string;
        description?: string | undefined;
        titleHtml?: string;
    }>(), {
        description: undefined,
    });

    const cardsData = [
        {
            icon: RefreshAuto,
            cardInfo: {
                title: 'Healthcare  Data Management',
                description: 'Automates the integration and management of patient data from various sources, ensuring that records are always updated and accurate.'
            },
        },
        {
            icon: CommentQuoteOutline,
            cardInfo: {
                title: 'Genomic Data Processing',
                description: 'Process large volumes of genomic data quickly and accurately. Kestra automates sequencing workflows and data analysis, significantly cutting down processing times and minimizing errors,'
            },
        },
        {
            icon: ChartBellCurve,
            cardInfo: {
                title: 'Regulatory Compliance',
                description: 'Automate the generation of compliance reports, access logs, and data usage reports. Ensure  compliance with regulatory standards reducing the risk of breaches and improving data governance.'
            },
        },
        {
            icon: FileChartOutline,
            cardInfo: {
                title: 'Predictive Analytics',
                description: ' Integrates your workflows with machine learning models and analytics platforms to utilize patient data for predictive analytics.'
            },
        },
        {
            icon: ImageFilterCenterFocus,
            cardInfo: {
                title: 'Streamlined Data Management',
                description: 'Centralize your fragmented data workflow into a unified control plane, thereby simplifying orchestration and improving efficiency.'
            },
        },
    ];
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        text-align: center;
        color: $white;
        font-family: $font-family-sans-serif;
        font-weight: 300;

        .container {
            padding-top: calc($spacer * 5.625);
            padding-bottom: calc($spacer * 5.625);
            background: #111113 url('/retail/header-mask.svg') 100% 100%;

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

                    :deep(span), span {
                        background: linear-gradient(90deg, #E151F7 65.38%, #5C47F5 82.43%);
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
                    background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
                }

                :deep(.card-title) {
                    text-align: left;
                }
            }
        }
    }
</style>
