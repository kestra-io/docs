<template>
  <div class="container-fluid py-5">
    <div class="d-flex justify-content-center container">
      <div class="col-12 col-md-7 py-4">
        <div class="text-center rounded">
          <h3 data-aos="fade-right" class="mb-3 heading-footer">
            Getting Started
          </h3>
          <div
            class="d-flex gap-2 flex-wrap justify-content-center align-items-center"
          >
            <NuxtLink href="/docs/getting-started/quickstart#start-kestra">
              <button class="btn btn-dark mx-2 mt-2">Get Started</button>
            </NuxtLink>
            <NuxtLink href="/demo">
              <button class="btn btn-animated btn-purple-animated mx-2 mt-2">
                Talk to Us
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "../../assets/styles/variable";

.btn-dark {
  background-color: $black-4;
  border: 1px solid $black-6;
}

.container-fluid {
  background-color: $black-4 !important;
}

.heading-footer {
  font-weight: 100 !important;
  color: $body-tertiary-color !important;
  font-size: $h3-font-size !important;
  line-height: 2.5rem;
}

.container {
  border: 1px solid $black-3 !important;
  background-color: $black-2 !important;
  border-radius: 8px;
  position: relative;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    width: 262px;
    height: 170px;
    background: url("/landing/features/scheduling/light-mask2.svg");
    right: 0px;
    top: 0px;
    z-index: 1;
  }
}
</style>