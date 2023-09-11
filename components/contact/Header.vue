<template>
    <div class="container-fluid">
        <div class="hero hero-sm container">
            <div class="row">
                <div class="col-md-5 get-in-touch">
                    <div>
                        <p class="overline" data-aos="fade-left">Get in touch</p>
                        <h1 data-aos="fade-right">Contact Us</h1>
                        <p class="baseline" data-aos="fade-left">If you have questions, inquiries, or feedback about Kestra, we're looking to hearing from you.</p>
                    </div>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-6">
                    <h3 data-aos="fade-left">Reach Out to Us</h3>
                    <div id="hubspotForm" data-aos="fade-left" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Console from "vue-material-design-icons/Console.vue"
    import Email from "vue-material-design-icons/Email.vue"

    export default {
        components: {Console, Email},
        data() {
            return {
                valid: undefined,
                message: undefined,
            };
        },
        mounted() {
            if (process.client) {
                if (window.hbspt) {
                    window.hbspt.forms.create({
                        region: "eu1",
                        portalId: "27220195",
                        formId: "77f32ae3-0f49-404a-a28d-6dfe92c8bc78",
                        target: "#hubspotForm",
                        onFormSubmit: function($form) {
                            if (window.dataLayer) {
                                window.dataLayer.push({'event': 'contact_form'});
                            }
                        },
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-8;

        .form-group {
            margin-bottom: 10px;
        }

        .checkbox {
            margin-bottom: 10px;
        }

        .consent {
            font-size: small;
        }

        .mandatory-fields {
            color: $primary;
            font-size: small;
        }

        .get-in-touch {
            background: url("/landing/company/contact-us.svg") no-repeat top right;
            display: flex;
            align-items: center;
        }
    }
</style>