<template>
      <div class="container">
        <div class="container mb-5">
            <div class="mt-5">
                <h1 data-aos="fade-left" class="text-white title">Frequently Asked Questions</h1>
            </div>
            <CustomDetails class="que text-white" title="Is it easy to upgrade from Open Source edition to Kestra Enterprise?">
                <p class="ans">Yet to answer</p>
            </CustomDetails>
            <CustomDetails class="que text-white" title="Does the Enterprise Edition comes with Enterprise Support and SLAs?">
                <p class="ans">yet to answer</p>
            </CustomDetails>

            <CustomDetails class="que text-white" title="Is Kestra Enterprise made for small teams?">
                <p class="ans">Kestra Enterprise is addressing any organizations & professionals seeking to secure production workloads with high-security standards and enterprise support.</p>
            </CustomDetails>
        </div>
    </div>
    
</template>

<script setup>
import CustomDetails from "../components/layout/CustomDetails.vue";
</script>


<style scoped lang="scss">
@import "../../assets/styles/variable";

.que{
    background-color: $black-2;
    box-shadow: none;
    border: 1px solid $black-3;
    line-height: 1.625rem !important;
    font-weight: 700;
    font-size: $font-size-lg;
}
.ans{
    font-weight: 300;
    line-height: 1.625rem;
    font-size: $font-size-lg;
}
.title{
    font-size: $font-size-3xl;
    font-weight: 300;
    line-height: 2.7rem;
    padding-bottom: 35px;
}
h2 {
    margin-top: 2rem;
}
</style>
