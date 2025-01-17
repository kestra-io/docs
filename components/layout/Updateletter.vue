<template>
    <div class="container text-center mb-5 p-0">
        <div class="bg-dark-2">
            <div>
                <h3 data-aos="fade-right">Get Kestra updates to your inbox</h3>
                <div v-if="valid === true && message" class="alert alert-success" v-html="message" />
                <div v-if="valid === false && message" class="alert alert-danger">{{ message }}</div>
                <form class="needs-validation d-flex flex-column align-items-center gap-3" ref="newsletter" id="newsletter" @submit="checkForm" novalidate data-aos="fade-left">
                    <input type="email" class="form-control form-control-lg" id="email" placeholder="Email" required>
                    <button type="submit" class="btn btn-animated btn-purple-animated">Subscribe</button>
                </form>

                <p class="mt-3" data-aos="zoom-in">Stay up to date with the latest features and changes to Kestra</p>
            </div>
        </div>
    </div>
</template>

<script>
    import Twitter from "vue-material-design-icons/Twitter.vue";
    import Youtube from "vue-material-design-icons/Youtube.vue";
    import axios from "axios";

    const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/433b234f-f3c6-431c-898a-ef699e5525fa";

    export default {
        components: {Twitter, Youtube},
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

        > div {
            position: relative;
            padding: calc($spacer * 2.25);
            border-radius: 0.5rem;
            border: $block-border;
            background: url("/landing/faq/newsletter-bg.svg") no-repeat top;
            background-size: cover;

            > div {
                position: relative;
                z-index: 2;
            }
        }

        input {
            border: 1px solid #242427;
            background: $black-4;
            color: $white-1;
            font-size: 15px;
            padding: 13px;
            width: fit-content;
            min-width: 290px;

            @include media-breakpoint-down(sm) {
                min-width: 100%;
            }

            &::placeholder {
                color: $white-1;
            }
        }

        button {
            width: fit-content;
        }

        h3 {
            color: $white-1;
            font-size: 1.563rem;
            font-weight: 100;
            margin-bottom: 1rem;
        }

        p {
            color: $white;
            font-size: $font-size-xs;
            font-weight: 300;
            margin-bottom: 0;
        }

    }

</style>