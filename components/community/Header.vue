<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-7 align-items-center d-flex">
                    <div>
                        <p  data-aos="fade-left" class="overline">Community</p>
                        <h1 data-aos="fade-right">Connect, Collaborate, and Empower Your Data Journey</h1>
                        <p class="baseline" data-aos="fade-left">Connect with peers, exchange ideas and drive innovation in data orchestration</p>
                        <NuxtLink href="https://kestra.io/slack" class="btn btn-lg btn-primary mb-2" data-aos="zoom-in" target="_blank">
                            Join us on Slack
                        </NuxtLink>
                    </div>
                </div>
                <div class="col-md-5">
                    <img src="/landing/community/header.svg" class="img-fluid" alt="Illustration of diverse people around Kestra's logo, symbolizing Kestra's thriving community"  data-aos="zoom-in"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Console from "vue-material-design-icons/Console.vue"
    import Email from "vue-material-design-icons/Email.vue"

    export default {
        components: {Console, Email}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-8;
        .hero {
            padding-top: 4rem;
            padding-bottom: 4rem;
        }
    }
</style>