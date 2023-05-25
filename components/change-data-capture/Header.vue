<template>
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="row">
                <div class="col-lg-6 align-items-center d-flex">
                    <div>
                        <h1 data-aos="fade-right">Harness Change Data Capture for Efficient Data Processing and Analysis</h1>
                        <p data-aos="fade-left" class="baseline">Boost Data Synchronization and Streamlined Processing with Kestra's CDC Capabilities</p>
                        <NuxtLink href="/docs/getting-started" class="btn btn-lg btn-primary" data-aos="zoom-in">
                            Get started
                        </NuxtLink>
                    </div>
                </div>
                <div class="col-lg-6">
                    <img class="mt-5 mt-md-0 img-fluid d-xl-none" data-aos="zoom-in" src="/landing/usecases/cdc-intro.svg" alt="Change Data Capture with Kestra" />
                </div>
            </div>
        </div>
        <div class="container container-white mb-4" data-aos="zoom-in">
            <h5>What is Change Data Capture ?</h5>
            <span>
                Change Data Capture (CDC) tracks and captures data source alterations for efficient processing and analysis. Kestra's CDC features allow businesses to synchronize and manage data effectively, maintaining updated data warehouses and analytics platforms with minimized resource use.
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $light-cyan;
        padding-top: 80px;
        margin-top: -80px;
        padding-bottom: $spacer;
    }

    .container.hero {
        background: url("/landing/usecases/cdc-intro.svg") no-repeat right center;
    }

    @include media-breakpoint-down(xl) {
        .container.hero {
            background: none;
        }
    }

    .container-white {
        background-color: white;
        font-size: small;
        padding: $spacer;
    }


</style>
<script setup lang="ts">
</script>