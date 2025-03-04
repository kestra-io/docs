<template>
    <div class="container-fluid bg-dark-4">
        <div class="container py-5 my-3">
            <div class="hero-container py-lg-5 d-flex justify-content-center align-items-center">
                <div class="header text-white">
                    <img src="/landing/cloud/cloud-hero.svg" alt="Kestra Cloud Comming Soon">
                    <h1 class="my-3">
                        Kestra <span class="text-gradient">Cloud</span> <br>Coming Soon
                    </h1>
                    <span class="tag">
                        Private Alpha
                    </span>
                    <h6 class="fw-light lh-lg m-0">
                        Register now to be the first to know when we launch!
                    </h6>
                </div>

                <div class="col-12 col-md-8 col-lg-5 form-container mx-auto pt-3">
                    <div data-aos="zoom-in">
                        <div v-if="valid" class="alert alert-info mb-0">
                            Thanks for your interest in the cloud version of Kestra we will come back to you as soon as possible!
                        </div>
                        <form v-else class="row needs-validation" ref="demo-form" @submit="onSubmit" novalidate data-aos="fade-left">
                            <div v-if="message" class="alert alert-danger mt-3 mb-0">{{ message }}</div>
                            <div class="col-12">
                                <label for="demo-email">Company Email <span class="text-danger">*</span></label>
                                <input name="email" type="email" class="form-control" id="demo-email" placeholder="Company Email" required>
                            </div>
                            <div class="col-12 mt-3">
                                <div class="form-check">
                                    <input class="form-check-input" name="newsletter" type="checkbox" value="true">
                                    <label class="form-check-label" for="flexCheckDefault">
                                        I agree to receive other communications from Kestra.
                                    </label>
                                </div>
                            </div>

                            <div class="col-12 mt-3 text-muted">
                                <small>By clicking submit below, you consent to allow Kestra to store and process the personal information submitted above to provide you the content requested.</small>
                            </div>

                            <div class="col-12 mt-4 d-flex justify-content-center">
                                <button type="submit" class="btn btn-primary w-100">
                                    Submit
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    import axios from "axios";
    import {getHubspotTracking} from "~/utils/hubspot.js";
    import posthog from "posthog-js";

    const route = useRoute();
    const gtm = useGtm();
    const formRef = useTemplateRef('demo-form');

    const valid = ref(false)
    const message = ref("")

    const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/fbce3efa-1f99-4ab9-928c-26167aa51424";

    const onSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()


        const form = formRef.value;
        const hsq = (window._hsq = window._hsq || []);

        if (!form.checkValidity()) {
            valid.value = false;
            message.value = "Invalid form, please review the fields."
        } else {
            hsq.push(["identify", {
                email: form['email'].value,
                kuid: localStorage.getItem("KUID"),
            }]);

            let ip = await axios.get("https://api.ipify.org?format=json");
            const formData = {
                fields: [
                    {
                        objectTypeId: "0-1",
                        name: "email",
                        value: form['email'].value
                    },
                    {
                        objectTypeId: "0-1",
                        name: "form_submission_identifier",
                        value: "Contact for Cloud Edition"
                    },
                    {
                        objectTypeId: "0-1",
                        name: "kuid",
                        value: localStorage.getItem("KUID")
                    }
                ],
                context: {
                    hutk: getHubspotTracking(),
                    ipAddress: ip.data.ip,
                    pageUri: route.path,
                    pageName: document.title
                },
                legalConsentOptions: {
                    "consent": {
                        "consentToProcess": true,
                        "text": "I agree to allow Kestra  to store and process my personal data.",
                        "communications": [
                            {
                                "subscriptionTypeId": 178416206,
                                "value": form['newsletter'].checked,
                                "text": "I agree to receive other communications from Kestra."
                            }
                        ]
                    }
                }
            }

            posthog.capture("cloud_form");
            hsq.push(['trackCustomBehavioralEvent', {name: 'cloud_form'}]);

            gtm?.trackEvent({
                event: "cloud_form",
                noninteraction: false,
            })

            identify(form['email'].value);

            axios.post(hubSpotUrl, formData, {})
                .then(() => {
                    valid.value = true;
                })
                .catch((error) => {
                    valid.value = false;
                    if (error.response.data.errors.filter(e => e.errorType === "BLOCKED_EMAIL").length > 0) {
                        message.value = "Please use a professional email address";
                    } else {
                        message.value = error.response.data.message
                    }
                })
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .form-group.required .form-label::after {
        content: "*";
        color: red;
    }

    .custom-control-input {
        background-color: $black-4;
    }

    .container-fluid {
        position: relative;

        &::after {
            content: "";
            position: absolute;
            width: 262px;
            height: 170px;
            background: linear-gradient(180deg,
                rgba(98, 24, 255, 0) 0%,
                #6117ff 100%);
            filter: blur(100px);
            left: 15%;
            top: 10%;
            z-index: 1;
        }

        .hero-container {
            h1 {
                font-size: $font-size-4xl !important;
                line-height: $font-size-4xl;
                max-width: 80%;
                font-weight: 400;
            }

            h6 {
                font-size: $font-size-xl;
            }

            .text-gradient {
                background: linear-gradient(90.03deg, #e151f7 2.16%, #5c47f5 65.09%);
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                align-items: flex-start !important;
                gap: calc($spacer * 2);

                h1 {
                    max-width: unset;
                    font-size: calc($font-size-base * 1.625) !important;
                    line-height: calc($spacer * 1.625);
                }

                h6 {
                    line-height: unset !important;
                }
            }

            .tag {
                max-width: fit-content;
                border-radius: calc($spacer * 0.25);
                color: $white;
                background-color: #5A3ABC;
                padding: calc($spacer * 0.3) calc($spacer * 0.25);
                font-size: $font-size-md;
                line-height: 1.5rem;
                font-weight: 600;
            }
        }


        .input {
            background-color: $black-4;
            border: 1px;
            border-style: $black-3;
            border: none;
        }

        .para {
            color: $white-3;
        }

        .desc {
            color: $white-3;
            line-height: 1.375rem;
            font-size: $font-size-sm
        }

        .container {
            background-image: url("/landing/contact/Mask.svg");
            z-index: 20;
        }

        .form-container {
            background-color: $black-2;
            border-style: solid;
            border-color: $black-3;
            padding: 1rem;
            height: fit-content;
            color: var(--bs-white);

            .text-muted {
                color: var(--bs-white) !important;
                opacity: 0.5;
            }

            @include media-breakpoint-down(lg) {
                margin: 0 !important;
                width: 100%;
            }
        }


    }
</style>
