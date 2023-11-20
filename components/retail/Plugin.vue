<template>
  <div class="container fluid d-flex justify-content-center flex-column pt-5">
    <div data-aos="fade-left" class="title mx-auto text-center heading">Connect Your 
      <span class="title title-animated ">Entire  Stack</span>
      with Plugins
    </div>
    <div
      class="icons d-flex flex-wrap gap-4 my-5 justify-content-center mx-auto"
      data-aos="fade-right"
    >
      <img src="/retail/plugin/fivetran.svg" alt="Fivetran" />
      <img src="/retail/plugin/snowflake.svg" alt="snowflake" />
      <img src="/retail/plugin/aws.svg" alt="aws" />
      <img src="/retail/plugin/databricks.svg" alt="databricks" />
      <img src="/retail/plugin/azure.svg" alt="azure" />
      <img src="/retail/plugin/dbt.svg" alt="dbt" />
      <img src="/retail/plugin/Airbyte.svg" alt="Airbyte" />
      <img src="/retail/plugin/docker.svg" alt="docker" />
      <img src="/retail/plugin/teraform.svg" alt="teraform" />
      <img src="/retail/plugin/cloud.svg" alt="cloud" />
      <img src="/retail/plugin/github.svg" alt="github" />
    </div>
    <NuxtLink href="/demo" class="btn btn-dark mt-2 mx-auto" data-aos="zoom-in">
      See all Plugins
    </NuxtLink>
    <div class="line mt-5"/>
  </div>
</template>
<style lang="scss" scoped>
@import "../../assets/styles/variable";

.container{
  background-image: url('/retail/plugin/pluginMask.svg');
  background-position: 15% 17%;
}
.title {
  font-size: $font-size-3xl !important;
  font-weight: 300;
  margin-bottom: 0;
}
.title-animated {
  background: var(
    --Text_gradient,
    linear-gradient(90deg, #e151f7 2.16%, #5c47f5 65.09%)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.icons {
  max-width: 700px;
}
.btn-dark {
  --bs-btn-bg: $black-4;
  --bs-btn-hover-bg: $black-4;
  border: 1px solid $black-6;
}
.line {
  height: 1px;
  background: $black-6;
}
.heading{
  max-width: 600px;
}
</style>