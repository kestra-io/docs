<template>
  <div class="container-fluid">
      <div class="container">
          <div class="enterprise">
            <div class="text-center pb-3">
              <img src="/landing/usecases/provisioning-and-deployment/monograme-kestra.svg" />
            </div>
            <div class="heading mx-auto">
              <h2 class="title text-center">
                  Orchestrate infrastructure
                  components using Kestra
              </h2>
            </div>
            <div class="text-center rounded">
              <NuxtLink class="btn btn-animated btn-purple-animated mx-2 mt-2" href="/docs/getting-started/quickstart#start-kestra">
                    Get started
              </NuxtLink>
            </div>
          </div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../assets/styles/variable";

.container-fluid {
  background-color: $black-4;
}

.enterprise {
    border: 1px solid $black-6;
    border-radius: 0.5rem;
    padding: calc($spacer * 2);
    overflow: hidden;
    position: relative;
    z-index: 10;

    &::after,
    &::before {
        content: "";
        position: absolute;
        width: 18rem;
        height: 18rem;
        background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117FF 100%);
        filter: blur(60px);
        z-index: 0;
    }
    &::after {
        left: 80%;
        top: -43%;
    }

    &::before {
        right: 77%;
        bottom: -15%;
    }
}

.heading {
    max-width: 610px;
    font-size: $font-size-3xl !important;

    .title {
        font-weight: 400 !important;
        text-align: center;
        color: #ffffff;
    }
}
</style>