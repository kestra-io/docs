<template>
  <div class="container-fluid">
    <Section>
      <div class="container">
        <div class="heading mx-auto">
          <h2 class="title text-center">
            <p>
              Integrate with tools you already<span class="title-animate">
                know
              </span>
              and <span class="title-animate">love</span>
            </p>
          </h2>
        </div>

        <div
          data-aos="fade-right"
          class="d-flex justify-content-center flex-wrap plugins gap-4 my-5"
        >
          <img
            v-for="plugin in items"
            :key="plugin.name"
            :src="plugin.icon"
            :alt="plugin.name"
          />
        </div>
      </div>
    </Section>
  </div>
</template>

<script setup>
import Section from "../layout/Section.vue";

const items = ref([
  {
    name: "Fivetran",
    icon: "/retail/plugins/fivetran.svg",
  },
  {
    name: "Snowflake",
    icon: "/retail/plugins/snowflake.svg",
  },
  {
    name: "AWS",
    icon: "/retail/plugins/aws.svg",
  },
  {
    name: "databricks",
    icon: "/retail/plugins/databricks.svg",
  },
  {
    name: "Azure",
    icon: "/retail/plugins/azure.svg",
  },
  {
    name: "dbt",
    icon: "/retail/plugins/dbt.svg",
  },
  {
    name: "Airbyte",
    icon: "/retail/plugins/airbyte.svg",
  },
  {
    name: "Docker",
    icon: "/retail/plugins/docker.svg",
  },
  {
    name: "Terraform",
    icon: "/retail/plugins/terraform.svg",
  },
  {
    name: "Google Cloud",
    icon: "/retail/plugins/cloud.svg",
  },
  {
    name: "Github",
    icon: "/retail/plugins/github.svg",
  },
]);
</script>


<style lang="scss" scoped>
@import "../../assets/styles/variable";

.container-fluid {
  background-color: $black-1;

  .container {
    background-image: url(/landing/features/mask.svg);
  }
  .heading {
    max-width: 550px;
    font-size: $h2-font-size !important;
    line-height: 4rem;
    font-size: $font-size-3xl;

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
}
</style>