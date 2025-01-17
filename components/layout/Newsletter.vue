<template>
    <div class="container text-center mb-5">
        <div class="rounded-3">
            <div>
                <h3 data-aos="fade-right"><span>Get Kestra updates</span> to your inbox</h3>
                <div v-if="valid === true && message" class="alert alert-success" v-html="message" />
                <div v-if="valid === false && message" class="alert alert-danger">{{ message }}</div>
                <form class="row g-3 mt-4 mb-4 justify-content-center needs-validation" ref="newsletter" id="newsletter" @submit="checkForm" novalidate data-aos="fade-left">
                    <div class="col-md-5 col-12">
                        <label class="visually-hidden" for="newsletter-email">Email</label>
                        <input type="email" class="form-control form-control-lg" id="newsletter-email" placeholder="Email" required>
                    </div>

                    <div class="col-md-auto col-12">
                        <button type="submit" class="btn btn-dark">Subscribe</button>
                    </div>
                </form>

                <p class="mt-3" data-aos="zoom-in">Stay up to date with the latest features and changes to Kestra</p>
                <div class="d-flex align-items-center justify-content-center gap-3 socials">
                    <a href="https://twitter.com/kestra_io" class="d-flex align-items-center social-item gap-1" title="Twitter" target="_blank">
                        <twitter />
                        <p class="m-0">Twitter</p>
                    </a>
                    <a href="https://www.youtube.com/@kestra-io" class="d-flex align-items-center social-item gap-1" title="YouTube" target="_blank">
                        <youtube />
                        <p class="m-0">Youtube</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Twitter from "vue-material-design-icons/Twitter.vue";
    import Youtube from "vue-material-design-icons/Youtube.vue";
    import axios from "axios";
    import identify from "../../utils/identify.js";

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

                    identify(form.email.value);

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
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: $rem-5;

        > div {
            position: relative;
            background: $black-2;
            padding: calc($spacer * 3);
            color: $purple-35;
            border: $block-border;
            @include media-breakpoint-down(md) {
                padding: calc($spacer * 0.5);
            }
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

            &::placeholder {
                color: $white-1;
            }
        }

        .btn-lg {
            background: $purple-24;
            padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
            line-height: 2rem;
        }

        h3 {
            font-size: $h3-font-size;
            font-weight: 400;

            span {
                color: $body-tertiary-color;
            }
        }

        .socials {
            .social-item {
                color: $white-4;
                .material-design-icon {
                    font-size: $font-size-xl;
                    height: $btn-font-size-lg;
                }

                p {
                    color: $white-4;
                    font-family: $font-family-sans-serif;
                    font-size: $font-size-base;
                }
            }
        }
    }

</style>