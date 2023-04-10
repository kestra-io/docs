<template>
    <div class="main">
        <div class="hero container text-center">
            <h2>REDUCE COSTS INCREASE PRODUCTIVITY</h2>
            <h1>Kestra Enterprise Edition for Scaling companies<span class="dot">.</span></h1>
            <h2>Get full access of all the Open source features and unlock the full potential with Enterprise only features</h2>
            <div class="text-center cta">
                <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary me-2">
                    <Console /> Book a demo
                </a>
                <a href="/company/contact" class="btn btn-lg btn-secondary">
                    <Email /> Contact us
                </a>
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

    .main {
        background: $purple-7;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
    }
</style>