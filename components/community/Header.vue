<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6">
                    <p class="overline">Community</p>
                    <h1>Connect, Collaborate, and Empower Your Data Journey</h1>
                    <p class="baseline">Connect with peers, exchange ideas and drive innovation in data orchestration</p>
                </div>
                <div class="col-md-6">
                    <img src="/landing/community/frame_518.png" />
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
    }
</style>