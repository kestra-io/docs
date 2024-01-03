<template>
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="row">
                <div class="col-md-6 d-flex align-items-center order-1 order-md-0">
                    <div>
                        <p data-aos="fade-left" class="overline">Usages & Use Cases</p>
                        <h1 data-aos="fade-right">Unlock the Full Potential of Kestra</h1>
                        <p data-aos="fade-left" class="baseline">Harness your data, unlock valuable insights, and drive informed decision-making</p>
                    </div>
                </div>
                <div class="col-md-6 order-0 order-md-1">
                    <img class="zoom img-fluid" src="/landing/company/ui.png" alt="Picture of the user interface of Kestra on light mode" data-aos="zoom-in" />
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