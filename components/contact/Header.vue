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
                    <form id="contactUs" ref="contactUs" @submit="checkForm" class="needs-validation" novalidate data-aos="fade-left">
                        <div class="row">
                            <div class="form-group col-md-6 has-error">
                                <label for="firstName">First Name *</label>
                                <input type="text" class="form-control" id="firstName" required>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="lastName">Last Name *</label>
                                <input type="text" class="form-control" id="lastName" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label for="company">Company</label>
                                <input type="text" class="form-control" id="company">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="email">Email *</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="message">Message *</label>
                            <textarea class="form-control" rows="3" id="message" required></textarea>
                        </div>
                        <div class="checkbox consent">
                            <label for="newsletterConsent">
                                <input type="checkbox" id="newsletterConsent" class="form-check-input">&nbsp;&nbsp;I agree to receive other communications from Kestra.
                            </label>
                        </div>
                        <div class="consent">
                            <p>
                                You can unsubscribe from these communications at any time. For more information on how to unsubscribe, our privacy practices, and how we are committed to protecting and respecting your privacy, please review our <NuxtLink href="/privacy-policy">Privacy Policy</NuxtLink>.
                            </p>

                            <p>
                                By clicking submit below, you consent to allow Kestra to store and process the personal information submitted above to provide you with the content requested.
                            </p>
                        </div>

                        <button type="submit" class="btn btn-primary me-2" data-aos="zoom-in">Submit</button>
                    </form>
                    <p class="mandatory-fields mt-2">* Mandatory fields</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Console from "vue-material-design-icons/Console.vue"
    import Email from "vue-material-design-icons/Email.vue"

    const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/77f32ae3-0f49-404a-a28d-6dfe92c8bc78";

    export default {
        components: {Console, Email},
        methods:{
            checkForm: function (e) {
                e.preventDefault()
                e.stopPropagation()

                const form = this.$refs.contactUs;
                const route = useRoute()
                if (form.checkValidity()) {
                    form.classList.add('was-validated')

                    const formData = {
                        fields: [{
                            objectTypeId: "0-1",
                            name: "firstname",
                            value: form.firstName.value
                        },
                        {
                            objectTypeId: "0-1",
                            name: "lastname",
                            value: form.lastName.value
                        },
                        {
                            objectTypeId: "0-1",
                            name: "company",
                            value: form.company.value
                        },
                        {
                            objectTypeId: "0-1",
                            name: "email",
                            value: form.email.value
                        },
                        {
                            objectTypeId: "0-1",
                            name: "message",
                            value: form.message.value
                        },
                        {
                            objectTypeId: "0-1",
                            name: "LEGAL_CONSENT.subscription_type_178282008",
                            value: form.newsletterConsent.checked
                        }],
                        context: {
                            pageUri: route.path,
                            pageName: route.path
                        }
                    }
                    fetch(hubSpotUrl, {method: "POST", body: JSON.stringify(formData), headers: {"Content-Type": "application/json"}})
                        .then((_) => {
                                form.reset()
                                form.classList.remove('was-validated')
                            })
                }
            }
    }
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