<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6">
                    <h1>Harness Change Data Capture for Efficient Data Processing and Analysis</h1>
                    <h2>Boost Data Synchronization and Streamlined Processing with Kestra's CDC Capabilities</h2>
                    <NuxtLink href="/docs/getting-started" class="btn btn-lg btn-primary">
                        Get started
                    </NuxtLink>
                </div>
                <div class="col-md-6">
                    <img src="/landing/usecases/cdc-intro.png" />
                </div>
            </div>
        </div>
        <div class="container container-white">
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
        background: #E6F6F6;
        padding-top: 80px;
        margin-top: -80px;
        padding-bottom: $spacer;
    }

    .container-white {
        background-color: white;
        font-size: small;
        padding: $spacer;
    }
</style>