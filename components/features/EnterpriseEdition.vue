<template>
    <div class="container-fluid">
      <Section>
        <div class="container">
          <div class="text-center pb-3">
            <img src="/landing/features/Frame.svg" />
          </div>
          <div class="heading mx-auto">
            <h2 class="title text-center">
              Take Kestra to the next level with the
              <span class="title-animate">Enterprise Edition</span>
            </h2>
          </div>
          <div class="desc container">
            <p>
              Ensure scalability and high availability with managed Kafka and
              Elasticsearch integrated into the Enterprise Edition to eliminate
              single point of failure.
            </p>
          </div>
          <div class="text-center rounded">
            <NuxtLink href="/enterprise">
              <button class="btn btn-dark mx-2 mt-2">Learn more</button>
            </NuxtLink>
            <NuxtLink href="/demo">
              <button class="btn btn-animated btn-purple-animated mx-2 mt-2">
                Talk to Us
              </button>
            </NuxtLink>
          </div>
        </div>
      </Section>
    </div>
  </template>
  <script>
  import Section from "../layout/Section.vue";
  export default {
    components: { Section },
  };
  </script>
  <style lang="scss" scoped>
  @import "../../assets/styles/variable";
  .container-fluid {
    background-color: $black-1;
  }
  .container {
    position: relative;
    z-index: 10;
    &::after {
      content: "";
      position: absolute;
      width: 170px;
      height: 100px;
      background: linear-gradient(
        140deg,
        rgba(70, 24, 255, 0) -41.95%,
        #7E1CFA 77.28%
      );
      filter: blur(100px);
      left: 25rem;
      top: 1.6rem;
      z-index: 0;
    }
  }
  .btn-dark {
    background-color: $black-4;
    border: 1px solid $black-6;
  }
  .desc {
    font-size: $h6-font-size !important;
    line-height: 1.625rem !important;
    text-align: center;
    color: #fff;
    font-weight: 300;
    max-width: 700px;
  }
  .heading {
    max-width: 610px;
    font-size: $font-size-3xl !important;
    .title {
      font-weight: 400 !important;
      line-height: 3.1rem;
      text-align: center;
      color: #FFFFFF;
      &-animate {
        background: linear-gradient(90deg, #E151F7 24.82%, #5C47F5 76.81%);
        font-weight: 400 !important;
        font-size: $font-size-3xl !important;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
  </style>