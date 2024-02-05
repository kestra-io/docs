<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-7 align-items-center d-flex order-1 order-md-0">
                    <div>
                        <h1 data-aos="fade-right">Connect, Collaborate</h1>
                        <p class="baseline" data-aos="fade-left">Connect with peers, exchange ideas and contribute to an amazing community!</p>
                        <NuxtLink href="https://kestra.io/slack" class="btn btn-animated btn-purple-animated" data-aos="zoom-in" target="_blank">
                            Join us on Slack
                        </NuxtLink>
                    </div>
                </div>
                <div class="col-md-5 order-0 order-md-1">
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
        background: url("/landing/community/header-bg.svg") no-repeat center;
        background-size: 100% 100%;
        color: $white;

        .container {
            border-bottom: $block-border;
        }

        .hero {
            padding-top: 4rem;
            padding-bottom: 4rem;
        }

        h1, p {
            font-weight: 300;
            padding-bottom: 0;
            margin-bottom: 1rem;
        }

        h1 {
            font-size: $font-size-4xl;
        }

        p {
            font-size: $font-size-xl;
        }
    }
</style>