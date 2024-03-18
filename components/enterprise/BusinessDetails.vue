<template>
    <div class="container" data-aos="fade-left">
        <LayoutTabContent :navLinks="businessDetails.navLinks" />
    </div>
</template>

<script setup>
  import businessDetails from "~/data/business-details.js";
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

</style>