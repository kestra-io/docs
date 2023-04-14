<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-md-6">
                    <p class="overline">Usages & Use Cases</p>
                    <h1>Unlock the Full Potential of Kestra</h1>
                    <p class="baseline">Harness your data, unlock valuable insights, and drive informed decision-making</p>
                </div>
                <div class="col-md-6">
                    <img src="/landing/company/ui.png" width="600"/>
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