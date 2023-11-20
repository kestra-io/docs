<template>
  <section class="container mt-5 text-center">
    <h3 class="mb-5 title">
      Use Cases in <span class="title-animated">Retail</span>
    </h3>
    <div class="row d-flex justify-content-center">
      <div class="col-12 col-md-6 col-lg-4 mb-4 ">
        <div class="card h-100 " data-aos="fade-right">
          <div class="card-body mx-z">
            <img
              src="/retail/useCases/Icon_useCase1.svg"
              alt="Automated Inventory svg"
              class="icon mb-2"
            />
            <h6 class="card-heading">Automated Inventory Management</h6>
            <p class="card-para">
              Eliminate manual tracking and use Kestra to automate your
              inventory management system.
            </p> 
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4 mask ">
        <div class="card h-100 d-flex" data-aos="fade-right">
          <div class="card-body mx-2">
            <img
              src="/retail/useCases/Icon_useCase2.svg"
              alt="Customer Experience svg"
              class="icon mb-2"
            />
            <h6 class="card-heading">Enhanced Customer Experience</h6>
            <p class="card-para">
              Use Kestra to collect, analyze, and use customer feedback.
              Automate the delivery of personalized promotions and
              recommendations based on customer data.
            </p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card h-100 d-flex" data-aos="fade-right">
          <div class="card-body mx-2">
            <img
              src="/retail/useCases/Icon_useCase3.svg"
              alt="Compliance and Reporting svg"
              class="icon mb-2"
            />
            <h6 class="card-heading">Compliance and Reporting</h6>
            <p class="card-para">
              Automate the reporting processes, ensuring that all data complies
              with retail standards and regulations. Ideal for generating
              automated end-of-day sales reports, inventory counts, and more.
            </p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card h-100 d-flex" data-aos="fade-right">
          <div class="card-body mx-2">
            <img
              src="/retail/useCases/Icon_useCase4.svg"
              alt="Report Automation svg"
              class="icon mb-2"
            />
            <h6 class="card-heading">Report Automation for Supply Chain</h6>
            <p class="card-para">
              Automate supplier evaluation and order placement, ensuring a
              smooth and efficient supply chain operation.
            </p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card h-100 d-flex" data-aos="fade-right">
          <div class="card-body mx-2">
            <img
              src="/retail/useCases/Icon_useCase5.svg"
              alt="Streamlined svg"
              class="icon mb-2"
            />
            <h6 class="card-heading">Streamlined Data Management</h6>
            <p class="card-para">
              Centralize your fragmented data workflow into a unified control
              plane, thereby simplifying orchestration and improving efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="line mt-5" />
  </section>
</template>
<script setup>
import Section from "../layout/Section.vue";
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";


.container{
    background-image: url('/retail/headerMask.svg');
}
.title {
  font-weight: 300;
  font-size: $font-size-3xl;
  &-animated {
    background: linear-gradient(90deg, #e151f7 67.8%, #5c47f5 88.03%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
h3 {
  color: $white;
  text-align: center;
  margin-bottom: 0;
}

.card {
    z-index: 99;
  background-color: $black-2;
  color: $white;
  box-shadow: none !important;
  &-body {
    padding: 64px 32px 32px 32px;
  }
  &-heading {
    font-size: $font-size-xl;
    font-weight: 300;
    line-height: 32px;
  }
  &-para {
    font-size: $font-size-sm;
    font-weight: 400;
    line-height: 22px;
    color: $white-1;
  }
}
.icon {
  width: 42px;
}
.line {
  height: 1px;
  background: $black-6;
}
.mask{
    position: relative;
    &::after {
      content: "";
      position: absolute;
      height: 266.493px;
      width: 170.248px;
      background: url("/retail/solution/light-mask.svg") no-repeat;
      bottom: -70px;
      right: -100px;
      z-index: 1;
      background: linear-gradient(180deg, rgba(98, 24, 255, 0.00) 0%, #6117FF 100%);
filter: blur(100px);
    }
}
</style>