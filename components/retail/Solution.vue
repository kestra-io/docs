<template>
  <div class="container fluid my-5 d-flex justify-content-center flex-column">
    <div class="heading mx-auto pb-4">
      <h3 class="title text-center">End-To-End Solution for Managing
        <span class="title-animated ">Complex</span> Retail Operations </h3>
      <p class="mx-auto mb-0 text-center">
        Powers your business-critical retail applications, streamlines
        inventory, optimizes supply chain, and much more. By breaking down
        organizational silos, Kestra fosters a collaborative environment for
        better operational efficiency.
      </p>
    </div>
    <div class="card mt-2">
      <div class="row">
        <div class="col-12 col-md-6 ">
          <div class="card-body mx-2 sm:d-flex">
            <img
              src="/retail/solution/icon1.svg"
              alt="YAML svg"
              class="icon mb-2"
            />
            <div class="">
              <h6 class="card-heading">YAML-Based workflows</h6>
              <p class="card-para">
                Build, maintain, and scale, your workflows with Kestra's
                YAML-based interface.
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="card-body mx-2 sm:d-flex">
            <img
              src="/retail/solution/icon2.svg"
              alt="CI/CD Integration svg"
              class="icon mb-2"
            />
            <div class="">
              <h6 class="card-heading">Full CI/CD Integration</h6>
              <p class="card-para">
                From Terraform to GitHub Actions, Kestra provides complete
                control over deployment and resource management.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 col-md-6">
          <div class="card-body mx-2 sm:d-flex">
            <img
              src="/retail/solution/icon3.svg"
              alt="Language Agnostic svg"
              class="icon mb-2"
            />
            <div class="">
              <h6 class="card-heading ">Language Agnostic</h6>
              <p class="card-para">
                Kestra's language-agnostic capabilities let you integrate
                various Languages. Customize workflows to align with your unique
                retail business logic.
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="card-body mx-2 sm:d-flex">
            <img
              src="/retail/solution/icon4.svg"
              alt="Event-Driven svg"
              class="icon mb-2"
            />
            <div class="">
              <h6 class="card-heading">Event-Driven orchestration</h6>
              <p class="card-para">
                Kestra's event-driven capabilities ensure that your retail
                operations react in real time.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12 col-md-6">
          <div class="card-body mx-2 sm:d-flex">
            <img
              src="/retail/solution/icon5.svg"
              alt="Developer-Centric svg"
              class="icon mb-2"
            />
            <div class="">
              <h6 class="card-heading">Developer-Centric Platform</h6>
              <p class="card-para">
                API-first design with robust, scalable, cloud-native
                architecture makes Kestra the go-to platform for software
                engineers in the retail industry.
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="card-body mx-2 sm:d-flex">
            <img
              src="/retail/solution/icon6.svg"
              alt="User-Friendly svg"
              class="icon mb-2"
            />
            <div class="">
              <h6 class="card-heading">User-Friendly Interface</h6>
              <p class="card-para">
                Engineered to be intuitive for both developers and business
                professionals, Kestra facilitates quick and efficient workflow
                development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "../../assets/styles/variable";
.container {
  position: relative;
  z-index: 99;
  .heading{
    max-width: 800px;
  }
  &::after {
    content: "";
    position: absolute;
    height: 266.493px;
    width: 170.248px;
    background: url("/retail/solution/light-mask.svg") no-repeat;
    bottom: -70px;
    right: -100px;
    z-index: 1;
    background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
    filter: blur(100px);
  }
  p {
    font-size: $h6-font-size;
    font-weight: 400;
    color: $white-1;
    line-height: 1.625rem;
  }
  .card {
    z-index:10;
    position: relative;
    color: $white;
    background-color: $black-2;
    box-shadow: none;
    padding: 0px 4.375;
    &-heading {
      font-size: $font-size-xl;
      font-weight: 300;
    }
    &-para {
      color: $white-1;
      font-size: $font-size-base;
      font-weight: 400;
    }
    &::before {
      content: "";
      position: absolute;
      width: 228px;
      height: 565px;
      background: url("/retail/solution/light-mask.svg") no-repeat;
      bottom: 200px;
      left: 0;
      z-index: -1;
    }
  }
  .title {
    font-weight: 300;
    font-size: $font-size-3xl;
    &-animated {
      background: linear-gradient(90deg, #e151f7 15.93%, #5c47f5 38.28%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
.line {
  height: 1px;
  background: $black-6;
}

</style>