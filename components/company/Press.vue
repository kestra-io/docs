<template>
  <div class="container-fluid">
    <div class="hero container">
      <div class="row">
        <div class="col-md-6 align-items-center d-flex order-1 order-md-0">
          <div class="text-white">
            <h1 data-aos="fade-right" class="heading">
              Brand Assets
            </h1>
            <p class="baseline" data-aos="fade-left">
              For Media Inquiries and Exclusive Insights, Reach Out to Our Press Team at <a href="mailto:press@kestra.io">press@kestra.io</a>
            </p>

            <div class="cta">
              <NuxtLink
                  href="/docs/enterprise/kestra-identity"
                  class="btn btn-animated btn-purple-animated mt-2"
                  data-aos="zoom-in"
              >
                Download assets
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
              src="/landing/company/presskit-logo.svg"
              alt="A screenshot of the user interface of Kestra's application"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
      color: var(--bs-white);
      padding-top: 80px;
      margin-top: -80px;
      background: $black-1 url(/landing/contact/Mask-vectors.svg) no-repeat 31% center;
      background-size: 190% 99%;

      @include media-breakpoint-down(md) {
        background: #070708 url(/landing/contact/Mask-vectors.svg) no-repeat 50% 116%;
        background-size: 220% 124%;
      }
    }

    .heading {
      font-size: $font-size-4xl;
      font-weight: 300;
      line-height: 3.7rem;
      @include media-breakpoint-down(lg) {
        line-height: calc($font-size-base * 1.625);;
      }
    }

    .baseline {
      font-weight: 300;
      line-height: 2rem;
      font-size: $font-size-xl;
    }

    .btn {
      border: 1px solid #3d3d3f !important;
      background-color: $black-4 !important;
    }

    .headerimg {
      transform: scale(1.3);
      z-index: 50;
    }

    .img-container {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 5rem;
      padding-right: 2rem;

      .img-fluid {
        max-width: 204px;
        max-height: 204px;
      }

      &::before {
        content: "";
        position: absolute;
        width: 234px;
        height: 367px;
        background: linear-gradient(
                140deg,
                rgba(70, 24, 255, 0) -41.95%,
                #7e1cfa 77.28%
        );
        filter: blur(100px);
        left: 10.6rem;
        top: -5rem;
        z-index: 0;
      }
    }
</style>