<template>
  <div class="container-fluid">
    <div class="hero container">
      <div class="row">
        <div class="col-md-6 align-items-center d-flex order-1 order-md-0">
          <div class="text-white">
            <h1 data-aos="fade-right" class="heading">
              Fast, Scalable, Declarative Orchestrator
            </h1>
            <p class="baseline" data-aos="fade-left">
              Build all kinds of Workflows with Kestra: Your All-in-One Solution for Orchestrating Business-Critical Applications
            </p>

            <div class="cta d-flex gap-3">
                            <NuxtLink href="/docs/getting-started/quickstart#start-kestra" class="btn btn-animated btn-dark-animated" data-aos="zoom-in">
                                Get Started
                            </NuxtLink>
                            <a href="/demo"  class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                                Get a demo
                            </a>
                        </div>
          </div>
        </div>
        <div
          class="col-md-6 order-0 order-md-1 mt-3 img-container"
          data-aos="zoom-in"
        >
          <NuxtImg
            width="925px"
            height="745px"
            loading="lazy"
            format="webp"
            class="img-fluid headerimg"
            src="/landing/features/header.svg"
            alt="A screenshot of the user interface of Kestra's application"
          />
        </div>
      </div>
      <hr class="line" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.container-fluid {
  background: $black-4;
  color: var(--bs-white);
  padding-top: 80px;
  margin-top: -80px;
  background-image: url(/landing/features/mask.svg);

  .line {
    background: rgba(255, 255, 255, 0.1) !important;
    height: 1px !important;
  }
}

.heading {
  font-size: $font-size-4xl;
  font-weight: 400;
  line-height: 3.7rem;
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
    left: 3.6rem;
    top: 0px;
    z-index: 0;
  }
}
</style>

