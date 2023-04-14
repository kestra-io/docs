<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6">
                    <p class="overline">Reduce costs increase productivity</p>
                    <h1>Kestra Enterprise Edition for Scaling companies<span class="dot">.</span></h1>
                    <p class="baseline">Get full access of all the Open source features and unlock the full potential with Enterprise only features</p>
                    <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary me-2">
                        Book a demo <VideoPlus />
                    </a>
                    <NuxtLink href="/company/contact" class="btn btn-lg btn-dark">
                        Contact us
                    </NuxtLink>
                </div>
                <div class="col-md-6">
                    <img class="img-fluid" src="/landing/ee/background.svg" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import VideoPlus from "vue-material-design-icons/VideoPlus.vue"

    export default {
        components: {VideoPlus}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-7;
        color: var(--bs-white);
    }
</style>