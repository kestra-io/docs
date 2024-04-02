<template>
  <div class="container-fluid">
    <div class="hero container">
      <div class="row">
        <div class="col-md-6 align-items-center d-flex order-1 order-md-0">
          <div class="text-white">
            <h1 class="heading">{{ title }}</h1>
            <p class="text-white baseline fs-4">{{ metaDescription }}</p>
            <div class="cta">
              <NuxtLink
                  href="/demo"
                  class="btn text-white btn-animated btn-purple-animated mt-2"
                  data-aos="zoom-in"
              >
                Talk to Us
              </NuxtLink>
            </div>
          </div>
        </div>
        <div
            class="col-md-6 order-0 order-md-1 mt-3 img-container"
            data-aos="zoom-in"
        >
          <img
              class="zoom img-fluid headerimg"
              :src="heroImage"
              alt="A screenshot of the user interface of Kestra's application"
          />
        </div>
      </div>
      <hr class="line" />
    </div>
  </div>
</template>

<script setup>
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
    }
  })

  const pagelist = ['/stories', props.slug]
</script>

<style scoped lang="scss">
  @import "../../assets/styles/variable";

  .container-fluid {
    background: $black-4;
    color: var(--bs-white);
    padding-top: 80px;
    margin-top: -80px;
    background-image: url(/landing/features/mask.svg);
    background-repeat: no-repeat;

    .line {
      color: rgba(255, 255, 255, 0.1) !important;
      height: 1px !important;
    }
  }

  .heading {
    font-size: $font-size-4xl;
    font-weight: 300;
    line-height: 3.7rem;
      margin-bottom: $spacer;
    padding: 0;
    @include media-breakpoint-down(lg) {
      line-height: calc($font-size-base * 1.625);;
    }
  }

  .baseline {
    font-weight: 300;
    line-height: 2rem;
    font-size: $font-size-xl;
    padding: 0 !important;
    margin-bottom: $spacer;
    @include media-breakpoint-up(lg) {
        max-width: 80%;
    }
  }

  .btn {
    border: 1px solid #3d3d3f !important;
    background-color: $black-4 !important;
  }

  .headerimg {
    transform: scale(1.3);
    z-index: 50;
  }

  .hero {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  :deep(.slug) {
    margin-left: 0;
    color: $purple;
  }
  :deep(.link) {
    color: $purple;
  }
</style>