<template>
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="mb-5 pb-5 row">
                <div class="col-lg-6 align-items-center d-flex order-1 order-lg-0">
                    <div>
                        <NuxtImg
                            width="216"
                            height="56"
                            loading="lazy"
                            format="webp"
                            :src="logo"
                            :alt="logo"
                        />
                        <h1 v-if="title">{{title}}</h1>
                        <p class="text-white baseline fs-4">{{ metaDescription }}</p>
                        <div class="cta">
                            <NuxtLink
                                href="/demo"
                                class="btn text-white btn-animated btn-purple-animated mt-2"
                            >
                                Talk to Us
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 order-0 order-lg-1">
                    <img
                        class="hero-image"
                        :src="heroImage"
                        :alt="metaDescription"
                    />
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">

            <Section
                subtitle="Join the community"
            >
                <div class="metrics">
                    <div class="counter-box text-center">
                        <ContentRendererMarkdown :value="kpi1Content" />
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center">
                        <ContentRendererMarkdown :value="kpi2Content" />
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center">
                        <ContentRendererMarkdown :value="kpi3Content" />
                    </div>
                </div>
            </Section>
        </div>
    </div>
</template>

<script setup>
  import {parseMarkdown} from '@nuxtjs/mdc/runtime'

  const props = defineProps({
    slug: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    metaDescription: {
      type: String,
      required: true
    },
    heroImage: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true
    },
    kpi1: {
      type: String,
      required: true
    },
    kpi2: {
      type: String,
      required: true
    },
    kpi3: {
      type: String,
      required: true
    }
  });
  const kpi1Content = ref('');
  const kpi2Content = ref('');
  const kpi3Content = ref('');

  const pagelist = ['/stories', props.slug];

  kpi1Content.value = await parseMarkdown(props.kpi1, {});
  kpi2Content.value = await parseMarkdown(props.kpi2, {});
  kpi3Content.value = await parseMarkdown(props.kpi3, {});

</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .container-fluid {
      background: url("/landing/usecases/cicd/bg.svg") no-repeat center;
      background-size: 100% 100%;
      padding-top: 80px;
      margin-top: -80px;
      position: relative;
      overflow: hidden;

      &::after ,
      &::before {
          content: "";
          position: absolute;
          z-index: -147;
          filter: blur(100px);
          background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
      }

      &::after {
          height: 34rem;
          width: 80%;
          bottom: -28%;
          left: 9%;
      }

      &::before {
          height: 36rem;
          width: 39rem;
          bottom: 25%;
          left: 51%;
      }

      @include media-breakpoint-down(lg) {
          &::before {
              width: 80%;
              bottom: 45%;
              left: 10%;
          }
      }

      h1, p {
          color: $white;
          font-family: $font-family-sans-serif;
          font-weight: 300;
          padding-bottom: 0;
      }

      h1 {
          font-size: $font-size-3xl;
          margin-bottom: 16px;
          font-weight: 500;

          @include media-breakpoint-down(sm) {
              font-size: 1.875rem;
          }

          :deep(span) {
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

      .hero-image {
          width: 100%;
          border-radius: calc($spacer * 0.25);
      }

      :deep(.hero.hero-sm) {
          border-bottom: 1px solid #FFFFFF1A;
      }
  }

  .container {
      position: relative;
      :deep(section) {
          padding: 4.156rem 0;
          border-radius: 8px;
          background: #111113;
          position: absolute;
          width: 100%;
          top: -5.5rem;
          .subtitle {
              font-weight: 400;
              font-size: $font-size-sm;
          }
          .main {
              background-color: $black-2 !important;
          }
      }
      .metrics {
          padding-left: calc($spacer * 2);
          padding-right: calc($spacer * 2);
          margin: 0 auto;
          display: flex;
          justify-content: space-around;
          flex-flow: row wrap;

          .line-separator {
              width: calc($spacer * 0.063);
              background-color: #242427;
              @include media-breakpoint-down(xl) {
                  display: none;
              }
          }

          .counter-box {
              text-align: center;
              font-family: $font-family-sans-serif;
              font-style: normal;
              :deep(h5) {
                  color: $white !important;
                  font-size: 48.09px;
                  font-weight: 600;
                  display: block;
              }
              :deep(p) {
                  color: #ABABB2;
                  text-transform: uppercase;
                  font-size: 11.61px;
                  font-weight: 500;
                  margin: 0;
              }
          }
      }
  }
</style>