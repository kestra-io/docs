<template>
    <div class="main">
        <div class="hero container">
            <h2>CAREERS</h2>
            <h1>Become a Kestra Member</h1>
            <h2>Join our amazing team and drive innovation in a collaborative workspace</h2>
            <div class="text-center cta">
                <a href="#positions" class="btn btn-lg btn-primary">
                    Open positions
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