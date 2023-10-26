<template>
  <div class="workflow">
    <LayoutSection>
      <div class="row justify-content-center align-items-center">
        <div class="col-12 col-md-5 workflow-image" data-aos="fade-left">
          <img
            src="/landing/features/scheduling/workflow/workflow_1.svg"
            class="w-100 "
            alt="Centralized Control"
          />
        </div>

        <div class="col-12 col-md-5">
          <div class="row justify-content-center">
            <div class="col-12 col-md-9" data-aos="fade-right">
              <h3 class="workflow-title">Centralized Control</h3>
              <p class="workflow-para">
                Kestra serves as a unified platform that allows you to automate
                and schedule tasks across a wide range of business-critical
                systems. From CRM and ERP to Big Data and Business Intelligence,
                Kestra ensures that all your systems work together seamlessly,
                requiring minimal human intervention.

              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-5">
          <div class="row justify-content-center">
            <div class="col-12 col-md-9" data-aos="fade-left">
              <h3 class="workflow-title">
                Event-Driven Workflows Without Spaghetti Code
              </h3>
              <p class="workflow-para">
                Whether you're looking to trigger flows based on the results of
                other flows, file detection from various sources like SFTP or
                Google Cloud Storage, or even the outcomes of SQL queries,
                Kestra offers a versatile set of triggers to meet all your
                automation needs.
                <NuxtLink
                  href="#"
                  class="text-decoration-underline link-offset-2"
                  >Learn more</NuxtLink
                >
              </p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-5 workflow-image" data-aos="fade-right">
          <img
            src="/landing/features/scheduling/workflow/workflow_2.svg"
            class="w-100 "
            alt="Event Driven"
          />
        </div>
        <div class="col-12 col-md-5 workflow-image" data-aos="fade-left">
          <img
            src="/landing/features/scheduling/workflow/workflow_3.svg"
            class="w-100 "
            alt="Everything as code"
          />
        </div>
        <div class="col-12 col-md-5">
          <div class="row justify-content-center">
            <div class="col-12 col-md-9" data-aos="fade-right">
              <h3 class="workflow-title">Everything as Code</h3>
              <p class="workflow-para">
                Manage your resources programmatically, ensuring
                reproducibility, version control, and seamless collaboration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutSection>
    <div class="container-fluid">
      <div class="container">
        <img
          src="/landing/features/scheduling/workflow/line.svg"
          class="w-100"
          alt="line"
        />
        <div class="row">
          <div class="col-lg-6" data-aos="zoom-in">
            <img
              class="img-fluid"
              src="/landing/features/scheduling/workflow/workflow_4.svg"
              alt="Logos of tools that integrate with Kestra such as Snowflake, Airbyte, DBT or Fivetran and Kestra at the center of It"
            />
          </div>
          <div class="col-lg-6 mt-5 plugin">
            <h2 data-aos="fade-left " class="plugin-title">Connect Your</h2>
            <h2 data-aos="fade-left" class="plugin-title plugin-title-animated">
              Entire Tech Stack
            </h2>
            <h2 data-aos="fade-left" class="plugin-title">with Plugins</h2>
            <p class="plugin-para mt-3" data-aos="fade-right ">
              Customize and extend Kestra's integrations with custom plugins,
              tailored to your specifics needs. Integrate internal systems,
              third-party APIs, cloud services or databases using simple and
              scalable integrations.
            </p>

            <NuxtLink
              href="/plugins"
              class="btn btn-animated btn-dark-animated mt-2"
              data-aos="zoom-in"
              >See all Plugins</NuxtLink
            >
          </div>
          <img
            src="/landing/features/scheduling/workflow/line.svg"
            class="w-100 p-0 m-0"
            alt="line"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "../../../assets/styles/variable";
p {
  line-height: 1.5rem;
  // color: $purple-32;
}
.workflow {
  background-color: $black-4;
  &-title {
    font-weight: 300 !important;
    font-size: $h2-font-size;
  }
  &-para {
    font-weight: 400 !important;
  }
  &-image {
    position: relative;
    > img {
      position: relative;
      z-index: 10;
    }

    &::before {
      content: "";
      position: absolute;
      height: 266.49px;
      width: 170px;
      background: url("/landing/features/scheduling/configurations-left-bg-light.svg") no-repeat;
      right: 17.5rem;
      top: -5.25rem;
      z-index: 1;
    }
  }
}

.section {
  padding: calc($spacer * 4) 0;
}
.plugin {
  &-title {
    font-size: $font-size-3xl !important;
    font-weight: 300;
    margin-bottom: 0;
  }
  &-title-animated {
    background: var(
      --Text_gradient,
      linear-gradient(90deg, #e151f7 2.16%, #5c47f5 65.09%)
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  &-para {
    font-weight: 400;
    font-size: $font-size-base;
  }
}
</style>
<script setup>
import Section from "../../layout/Section.vue";
</script>