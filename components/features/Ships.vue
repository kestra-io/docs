<template>
  <div class="container-fluid">
    <Section>
      <div class="container">
        <div class="heading mx-auto">
          <h2 class="title text-center">
            <span class="title-animate">Simplicity Scales</span>, Complexity
            Fails
            <p class="desc">
              Less time spent writing boilerplate orchestration code, more time
              for what matters to your business
            </p>
          </h2>
        </div>
        <div class="row d-flex justify-content-center">
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card h-100" data-aos="fade-right">
              <div class="card-body mx-2 text-center">
                <img
                  src="/landing/features/deploy.svg"
                  alt="BackFill pattern svg"
                  class="mb-2"
                />
                <h6 class="card-heading">Deploy and Run Anywhere</h6>
                <p class="card-para">
                  From on-premise installations to cloud-based services,
                  containers to clusters, Kestra can be deployed anywhere.
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4 mb-4 mask">
            <div class="card h-100 d-flex" data-aos="fade-right">
              <div class="card-body mx-2 text-center">
                <img
                  src="/landing/features/seamless.svg"
                  alt="Tune-Based svg"
                  class="mb-2"
                />
                <h6 class="card-heading">Seamless Integrations</h6>
                <p class="card-para">
                  Connect to various data sources and cloud services like AWS,
                  GCP, and Microsoft Azure.
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4 mb-4">
            <div class="card h-100 d-flex" data-aos="fade-right">
              <div class="card-body mx-2 text-center">
                <img
                  src="/landing/features/scale.svg"
                  alt="Event-Driven svg"
                  class="mb-2"
                />
                <h6 class="card-heading">Scale to Millions Executions</h6>
                <p class="card-para">
                  Kestra has been built with leading cloud-native technologies
                  and a strong architecture, enabling scaling to millions of
                  executions without hassle.
                </p>
              </div>
            </div>
          </div>
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

  &::before {
    content: "";
    position: absolute;
    width: 525px;
    height: 161px;
    background: linear-gradient(
      140deg,
      rgba(70, 24, 255, 0) -41.95%,
      #7e1cfa 77.28%
    );
    filter: blur(90px);
    left: 14.6rem;
    top: 12rem;
    z-index: 0;
  }
}

.desc {
  font-size: $h6-font-size !important;
  line-height: 1.625rem !important;
  text-align: center;
  color: #fff;
  padding-top: 18px;
  padding-bottom: 13px;
  font-weight: 300;
}

.card {
  background-color: $black-4;
  color: $body-tertiary-color;
  z-index: 99;
  box-shadow: none !important;
  border: 1px solid #3d3d3f;

  &-body {
    padding: 1.4rem 1.2rem 1rem 1.2rem;
  }

  &-heading {
    font-size: $h6-font-size;
    font-weight: 600;
    line-height: 1.8rem;
  }

  &-para {
    font-size: $font-size-sm;
    font-weight: 300;
    line-height: 1.5;
    color: $white-1;
  }
}

.heading {
  max-width: 970px;
  font-size: $h2-font-size !important;
  line-height: 2.7rem;

  .title {
    line-height: 4rem;
    text-align: center;
    font-weight: 300 !important;
    color: #ffffff;

    &-animate {
      background: linear-gradient(90deg, #e151f7 24.82%, #5c47f5 76.81%);
      background-clip: text;
      font-weight: 400 !important;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>