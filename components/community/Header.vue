<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-7">
                    <p class="overline">Community</p>
                    <h1>Connect, Collaborate, and Empower Your Data Journey</h1>
                    <p class="baseline">Connect with peers, exchange ideas and drive innovation in data orchestration</p>
                </div>
                <div class="col-md-5">
                    <img src="/landing/community/header.svg" class="img-fluid" />
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