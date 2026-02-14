<template>
    <section>
            <div class="container pt-5 text-center discover-cloud">
        <div class="row">
            <div class="col-md-12 col-lg-5 center">
                <img :src="discoverCloudImage.src" alt="Discover Cloud Logo" />
            </div>
            <div class="col-md-12 col-lg-7">
                <h2 class="highlight">Discover Kestra Cloud</h2>
                <p>
                    Join Kestra Cloud Early Adopter Program to unlock full, hands-on access to
                    Kestra Cloud. Enjoy a fully managed platform and personalized support.
                </p>
                <a to="/cloud/" class="btn btn-primary mt-3 cta-btn">
                    Request Access to Kestra Cloud
                </a>
            </div>
        </div>
    </div>
    </section>
</template>

<script setup lang="ts">
    import discoverCloudImage from "./images/discover_cloud.png"
</script>

<style lang="scss">
    @import "~/assets/styles/variable";

    section {
        background-color: var(--ks-background-secondary);
        padding: $rem-3 0;
    }
    .discover-cloud {
        border: 1px solid var(--ks-border-secondary);
        border-radius: 1rem;
        padding: 2rem;
        & > div,
        .center {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        & h2 {
            font-size: $font-size-3xl;
        }
        & p {
            font-size: $font-size-base !important;
            color: var(--ks-content-secondary) !important;
            margin-top: $rem-1;
        }
        .highlight {
            background: linear-gradient(90deg, #51cff7 57.35%, #4782f5 95.94%) !important;
            background-clip: text !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
        }
        .cta-btn {
            display: inline-block;
            padding: 12px 24px;
            text-decoration: none;
            cursor: pointer;
            position: relative;
            z-index: 2;
            pointer-events: auto;
        }
        img {
            width: 350px;
            max-width: 80%;
            height: auto;
        }
    }
</style>