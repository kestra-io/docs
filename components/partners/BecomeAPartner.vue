<template>
    <a id="form" />
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="row justify-content-center mb-4">
                <div class="col-md-10 col-lg-7 text-center">
                    <h3 data-aos="fade-left">Become a Partner</h3>
                    <p>If you are interested in becoming a Kestra partner, please  contact us with any questions.</p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-12 col-md-12 col-lg-12 col-xl-8">
                    <div class="card">
                        <div class="card-body">
                            <div class="card-text">
                                <div id="hubspotForm" data-aos="fade-left" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        mounted() {
            if (process.client) {
                if (window.hbspt) {
                    window.hbspt.forms.create({
                        region: "eu1",
                        portalId: "27220195",
                        formId: "77f32ae3-0f49-404a-a28d-6dfe92c8bc78",
                        target: "#hubspotForm"
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-13;
    }
</style>
