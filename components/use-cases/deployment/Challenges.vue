<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="title-block mb-3">
                <p class="title" v-if="title">
                    Simplify Your <br>
                    <span>{{title}}</span>
                </p>
                <p class="title" v-else v-html="titleHtml" />
                <p class="description">
                    {{description}}
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

<script>
  import Card from '../../components/card/Card.vue';

  export default {
    components: {
      Card,
    },
    props: {
      title: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: true,
      },
      titleHtml: {
        type: String,
        required: false,
      },
      cardsData: {
        type: Array,
        required: true,
      }
    },
  }
</script>

<script setup>


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

            .title-block {
                display: flex;
                flex-direction: column;
                align-items: center;

                .title {
                    font-size: 3.125rem;
                    margin-bottom: $rem-1;
                    font-weight: 600;
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

            }
        }
    }
</style>
