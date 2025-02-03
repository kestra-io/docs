<template>
    <div class="container text-center mb-5">
        <div class="rounded-3">
                <h5 data-aos="fade-right" class="pt-5">Get Kestra updates to your inbox</h5>
                <div v-if="valid === true && message" class="alert alert-success" v-html="message" />
                <div v-if="valid === false && message" class="alert alert-danger">{{ message }}</div>
                <form class=" g-3  justify-content-center needs-validation" ref="newsletter" id="newsletter" @submit="checkForm" novalidate data-aos="fade-left">
                    <div class="d-flex justify-content-center mb-2">
                        <label class="visually-hidden" for="newsletter-email">Email</label>
                        <input type="email" class="form-control form-control-lg " id="newsletter-email" placeholder="Email" required>
                    </div>
                        <button type="submit" class="btn btn-dark px-5">Submit</button>
                </form>

                <p class="mt-1 mb-5" data-aos="zoom-in">Stay up to date with the latest features and changes to Kestra</p>
            </div>
    </div>
</template>

<script>
    import axios from "axios";

    const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/433b234f-f3c6-431c-898a-ef699e5525fa";
    const gtm = useGtm();

    export default {
        data() {
            return {
                valid: undefined,
                message: undefined,
            };
        },
        methods:{
            checkForm: function (e) {
                e.preventDefault()
                e.stopPropagation()

                const form = this.$refs.newsletter;
                const route = useRoute()
                if (!form.checkValidity()) {
                    this.valid = false;
                    this.message = "Invalid form, please review the fields."
                } else {
                    this.valid = true;
                    form.classList.add('was-validated')

                    const formData = {
                        fields: [{
                            objectTypeId: "0-1",
                            name: "email",
                            value: form.email.value
                        }],
                        context: {
                            pageUri: route.path,
                            pageName: route.path
                        }
                    }

                    gtm?.trackEvent({
                        event: "newsletter_form",
                        noninteraction: false,
                    })

                    axios.post(hubSpotUrl, formData)
                        .then((response) => {
                            if (response.status !== 200) {
                                this.message = response.data.message;
                                this.valid = false;
                            } else {
                                this.valid = true;
                                this.message = response.data.inlineMessage;
                                form.reset()
                                form.classList.remove('was-validated')
                            }
                        })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        max-width: 600px;
            position: relative;
            background: $purple-8;
            color: var(--bs-primary);
            border: $block-border;
            border-radius: 8px;
        input {
            border-radius: $border-radius;
        }
        #email{
            max-width: 300px;
        }

        .btn-lg {
            background: $purple-24;
            padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
            line-height: 2rem;
        }

        h5 {
            font-weight: 100;
            line-height: 1.875rem;

            span {
                color: var(--bs-black);
            }
        }
        p{
            font-size: $font-size-xs;
            line-height: 1.188rem;
        }

        @include media-breakpoint-down(sm) {
            max-width: 80%
        }
    }

</style>