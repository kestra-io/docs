<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="container-title mb-5">
                <h2 class="title">Orchestrating {{title}} Scripts with <span>Kestra</span></h2>
            </div>
            <div class="row mb-5 align-items-center justify-content-between" v-for="(scriptItem, index) in scripts">
                <div
                    :class="`col-md-5 order-1 ${(index + 2) % 2 === 0 ? 'order-md-0' : 'order-md-1'}`"
                    :data-aos="`${(index + 2) % 2 === 0 ? 'fade-right' : 'fade-left'}`"
                >
                    <h3>{{scriptItem.title}}</h3>
                    <p>{{scriptItem.description}}</p>
                </div>
                <div
                    :class="`
                        col-md-6 order-0
                        ${(index + 2) % 2 === 0 ? 'order-md-1' : 'order-md-0'}
                        ${scriptItem.mask ? scriptItem.mask : 'mask'}
                    `"
                    :data-aos="`${(index + 2) % 2 !== 0 ? 'fade-right' : 'fade-left'}`"
                >
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        :width="scriptItem.imgWidth"
                        :height="scriptItem.imgHeight && scriptItem.imgHeight"
                        class="img-fluid"
                        :src="scriptItem.source"
                        :alt="scriptItem.title"
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
        default: undefined,
      },
      scripts: {
        type: Array,
        default: null,
        required: true,
      },
    },
  }
</script>

<style scoped lang="scss">
    @import "../../../../assets/styles/variable";

    .container-fluid {
        position: relative;
        z-index: 1;

        .container {
            border-bottom: $block-border;

            .container-title {
                padding-top: calc($spacer * 4);
                width: 100%;
                display: flex;
                justify-content: center;

                .title {
                    text-align: center;
                    font-size: 50px;
                    font-weight: 500;
                    text-align: center;
                    color: $white;

                    @include media-breakpoint-up(lg) {
                        max-width: 60%;
                        line-height: 50px;
                    }

                    span {
                        background: linear-gradient(90.03deg, #E151F7 2.16%, #5C47F5 65.09%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        color: $white;
                    }
                }
            }

            h3 {
                color: $white;
                font-size: $h2-font-size;
                font-weight: 300;
            }

            p, ul {
                color: $white-1;
                font-size: $font-size-md;
                font-weight: 300;

                b {
                    color: $white;
                    font-weight: 600;
                }
            }

            .mask, .mask-1 {
                position: relative;

                & > img {
                    z-index: 10;
                }

                &::after {
                    width: calc($spacer * 15);
                    height: calc($spacer * 15);
                    position: absolute;
                    content: "";
                    filter: blur(65px);
                    background: linear-gradient(180deg, rgba(98, 24, 255, 0.00) 0%, #6117FF 100%);
                    z-index: -2;
                }
            }

            .mask {

                &::after {
                    right: 214px;
                    bottom: 86px;

                    @include media-breakpoint-down(lg) {
                        right: 38px;
                        bottom: 51px;
                    }

                    @include media-breakpoint-down(md) {
                        right: 26px;
                    }

                }
            }

            .mask-1 {

                background-image: url(/landing/features/mask.svg);

                & > img {
                    z-index: 10;
                    width: 100%;
                }

                &::before {
                    width: 9rem;
                    height: 8rem;
                    position: absolute;
                    content: "";
                    filter: blur(79px);
                    background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
                    z-index: -2;
                    right: 530px;
                    bottom: 220px;
                }

                &::after {
                    right: 139px;
                    bottom: 166px;
                }
            }
        }
    }

</style>