<template>
    <div class="main pt-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 mt-5 plugin">
            <img src="/retail/leroy-marin.svg" alt="leroy marin"/>
            <p class="my-3">Customer Success</p>
            <!-- <h2 data-aos="fade-left " class="plugin-title">Connect Your</h2> -->
            <h4 data-aos="fade-left" class="plugin-title plugin-title-animated">
              Leroy Merlin France enabling data mesh architecture and 900%
              increase in productivity with Kestra:
            </h4>
            <!-- <h2 data-aos="fade-left" class="plugin-title">with Plugins</h2> -->
            <p class="plugin-para mt-3" data-aos="fade-right ">
              Leroy Merlin France transformed its data infrastructure by
              adopting Kestra, enabling a data mesh architecture and achieving a
              remarkable 900% boost in productivity. The shift empowered
              hundreds of data practitioners to create high-quality, scalable
              analytics, fundamentally changing how data is managed and valued
              across the organization.
            </p>

            <NuxtLink href="/docs" class="btn btn-dark" data-aos="zoom-in"
              >Read the Story</NuxtLink
            >
          </div>
          <div class="col-lg-6" data-aos="zoom-in">
            <img
              src="/retail/architecture.svg"
              class="w-100 p-0 m-0"
              alt="retail architecture"
            />
          </div>
        </div>
        <div class="line mt-5"/>
      </div>
    </div>
</template>
<style lang="scss" scoped>
@import "../../assets/styles/variable";
.main {
  color: white;
  background: $black-7;
  position: relative;
  &::after {
      content: "";
      position: absolute;
      height: 266.493px;
      width: 170.248px;
      background: url("/retail/grey-mask.svg") no-repeat;
      top: 50px;
      left: 250px;
      z-index: 1;
      filter: blur(100px);
      background: linear-gradient(180deg, rgba(24, 172, 255, 0.00) 0%, #17FF58 100%);
    }
}
.btn-dark {
  --bs-btn-bg: $black-4;
  --bs-btn-hover-bg: $black-4;
  border: 1px solid $black-6;
}
p {
  font-weight: 400 !important;
  font-size: 1rem !important;
  color: $white-1 !important;
}
h4 {
  font-weight: 300;
  line-height: 46px;
  font-size: 30px;
  z-index: 10;
}
.line{
    height: 1px;
    background: $black-6;
}
</style>