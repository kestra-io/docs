<template>
    <div class="container-fluid header">
        <div class="background"></div>
        <div class="hero hero-sm container position-relative z-1">
            <div class="row align-items-center mb-5">
                <div class="col-lg-6 align-items-center d-flex order-1 order-lg-0">
                    <div class="hero-content">
                        <img height="56" loading="lazy" :src="logo" :alt="logo" class="mb-3" />
                        <h1 v-if="title">{{ title }}</h1>
                        <p class="baseline">{{ metaDescription }}</p>
                    </div>
                </div>
                <div class="col-lg-6 order-0 order-lg-1">
                    <div class="image-container">
                        <img class="image" :src="heroImage" :alt="metaDescription" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <section>
                <div class="metrics">
                    <div class="counter-box text-center">
                        <MDCParserAndRenderer :content="kpi1" />
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center">
                        <MDCParserAndRenderer :content="kpi2" />
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center">
                        <MDCParserAndRenderer :content="kpi3" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script lang="ts" setup>
  import MDCParserAndRenderer from '../plugins/MDCParserAndRenderer.vue';

  const props = defineProps<{
    slug: string;
    title: string;
    metaDescription: string;
    heroImage: string;
    logo: string;
    kpi1: string;
    kpi2: string;
    kpi3: string;
  }>();
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $white;
        z-index: -1;
    }

    .header {
        position: relative;

        &::before {
            content: "";
            position: absolute;
            right: -100.767px;
            top: 52.197px;
            width: 818.767px;
            height: 414.991px;

            background-image: url("/stories/header/dots.svg");
            background-repeat: no-repeat;
            background-size: contain;
            z-index: 0;
            pointer-events: none;
        }

        .container {
            position: relative;
            z-index: 2;
        }

        h1 {
            color: $black-2;
            font-family: $font-family-sans-serif;
            font-weight: 700;
            font-size: $font-size-3xl;
            margin-bottom: 16px;
            line-height: 1.2;
            padding-bottom: 0;

            @include media-breakpoint-down(sm) {
                font-size: 1.875rem;
            }
        }

        .baseline {
            color: #000;
            font-family: "Mona Sans", sans-serif;
            font-size: $font-size-base;
            font-style: normal;
            font-weight: 500;
            line-height: 23px;

            margin-bottom: 2rem;
            padding-bottom: 0;
        }

        .image-container {
            border-radius: 13px;
            border: 1px solid #D4D4D4;
            background: #F4F4F4;
            display: flex;
            padding: 6px;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            width: 100%;
        }

        .image {
            width: 100%;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
        }

        :deep(.hero.hero-sm) {
            border-bottom: none;
            padding-bottom: 3rem;
        }

        .metrics {
            gap: 1rem;
            justify-content: center;

            .separator {
                width: 1px;
                height: 50px;
                background-color: $white-3;
            }

            .counter-box {
                text-align: center;

                :deep(h5),
                :deep(h4),
                :deep(strong) {
                    color: $black-2;
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 0;
                    line-height: 1;
                }

                :deep(p) {
                    color: $white-5;
                    font-size: $font-size-sm;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin: 0.5rem 0 0 0;
                    letter-spacing: 0.05em;
                }
            }
        }
    }
</style>