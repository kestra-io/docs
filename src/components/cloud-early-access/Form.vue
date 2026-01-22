<template>
    <div class="column-container">
        <div class="left-column">
            <div class="form-container">
                <h1 class="form-title">Apply for Your Free<br />30-Day Kestra Cloud Trial</h1>

                <p class="form-description">
                    Get early access to Kestra Cloud with 0 setup, 0 cost, and full orchestration
                    power. Fill out this short form to tell us more about your use case and request
                    your invite.
                </p>
                <div v-if="valid" v-html="validMessage" class="success" />
                <form v-else @submit="onSubmit" ref="cloud-form" novalidate data-usal="fade-l">
                    <div v-if="message" class="alert alert-danger mt-3 mb-0">
                        {{ message }}
                    </div>

                    <div class="form-group">
                        <label for="firstname"
                            ><span class="required-field">*</span> First Name</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            name="firstname"
                            id="firstname"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="lastname"
                            ><span class="required-field">*</span> Last Name</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            name="lastname"
                            id="lastname"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="email"
                            ><span class="required-field">*</span> Company Mail</label
                        >
                        <input type="email" class="form-control" name="email" id="email" required />
                    </div>

                    <div class="form-group">
                        <label for="company"
                            ><span class="required-field">*</span> Company Name</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            name="company"
                            id="company"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label
                            ><span class="required-field">*</span> When would you like to start your
                            free trial?</label
                        >
                        <div class="radio-options">
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="immediately"
                                    value="immediately"
                                    name="start_date_select"
                                    checked
                                    required
                                />
                                <label for="immediately">Immediately</label>
                            </div>
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="in1-2weeks"
                                    value="1-2weeks"
                                    name="start_date_select"
                                    required
                                />
                                <label for="in1-2weeks">In 1-2 weeks</label>
                            </div>
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="within1month"
                                    value="1month"
                                    name="start_date_select"
                                    required
                                />
                                <label for="within1month">Within 1 month</label>
                            </div>
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="later"
                                    value="later"
                                    name="start_date_select"
                                    required
                                />
                                <label for="later">Later (3 months+)</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label
                            ><span class="required-field">*</span> Expected Production
                            Timeline</label
                        >
                        <div class="radio-options">
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="asap"
                                    value="As soon as possible"
                                    name="production"
                                    checked
                                    required
                                />
                                <label for="asap">As soon as possible</label>
                            </div>
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="within1month-timeline"
                                    value="1 month"
                                    name="production"
                                    required
                                />
                                <label for="within1month-timeline">Within 1 month</label>
                            </div>
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="within3months"
                                    value="Within 3 months"
                                    name="production"
                                    required
                                />
                                <label for="within3months">Within 3 months</label>
                            </div>
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="within6months"
                                    value="Within 6 months"
                                    name="production"
                                    required
                                />
                                <label for="within6months">Within 6 months</label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label
                            ><span class="required-field">*</span> How many users will need
                            access?</label
                        >
                        <div class="radio-options">
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="1user"
                                    value="1"
                                    name="number_of_users"
                                    checked
                                    required
                                />
                                <label for="1user">1</label>
                            </div>
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="2-5users"
                                    value="2-5"
                                    name="number_of_users"
                                    required
                                />
                                <label for="2-5users">2-5</label>
                            </div>
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="5-15users"
                                    value="5-15"
                                    name="number_of_users"
                                    required
                                />
                                <label for="5-15users">5-15</label>
                            </div>
                            <div class="radio-option">
                                <input
                                    type="radio"
                                    id="15plus"
                                    value="15+"
                                    name="number_of_users"
                                    required
                                />
                                <label for="15plus">15+</label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Submit</button>
                </form>
            </div>
        </div>

        <div class="right-column">
            <div class="box"></div>
            <div class="testimonial">
                <p class="testimonial-quote">
                    “Kestra Cloud has been a pivotal part of giving us flexibility and scalability
                    we need to pull off complex processes we do at Foundation Direct.”
                </p>
                <p class="testimonial-author">
                    <strong>
                        Michael Heidner - SVP of Analytics and Business Intelligence & Kestra Cloud
                        Early Adopter
                    </strong>
                </p>
                <div class="testimonial-logo">
                    <img src="./images/foundation.svg?url" alt="Foundation Direct logo" />
                </div>
            </div>
            <div class="flow-image" data-usal="fade-l">
                <img src="./images/flow-edit.png?url" alt="Kestra Flow" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, useTemplateRef } from "vue"
    import axios from "axios"
    import { getHubspotTracking } from "~/utils/hubspot.js"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"

    const props = defineProps<{
        routePath: string
    }>()

    const gtm = useGtm()
    const formRef = useTemplateRef("cloud-form")

    const valid = ref(false)
    const validMessage = ref("")
    const message = ref("")

    const hubSpotUrl =
        "https://api.hsforms.com/submissions/v3/integration/submit/27220195/7d9519e3-4b96-42c8-9e54-251be6668cca"

    function getRadioValue(formEl: HTMLFormElement, name: string) {
        const radio = formEl.querySelector(
            `input[name="${name}"]:checked`,
        ) as HTMLInputElement | null
        return radio ? radio.value : ""
    }

    const onSubmit = async (e: Event) => {
        e.preventDefault()
        e.stopPropagation()

        const form = formRef.value as HTMLFormElement
        const hsq = ((window as any)._hsq = (window as any)._hsq || [])

        if (!form.checkValidity()) {
            valid.value = false
            message.value = "Invalid form: Please review the fields."
        } else {
            hsq.push([
                "identify",
                {
                    email: form["email"].value,
                    firstname: form["firstname"].value,
                    lastname: form["lastname"].value,
                    company: form["company"].value,
                    kuid: localStorage.getItem("KUID"),
                },
            ])

            let ip = await axios.get("https://api.ipify.org?format=json")
            const formData = {
                fields: [
                    {
                        objectTypeId: "0-1",
                        name: "firstname",
                        value: form["firstname"].value,
                    },
                    {
                        objectTypeId: "0-1",
                        name: "lastname",
                        value: form["lastname"].value,
                    },
                    {
                        objectTypeId: "0-1",
                        name: "email",
                        value: form["email"].value,
                    },
                    {
                        objectTypeId: "0-2",
                        name: "name",
                        value: form["company"].value,
                    },
                    {
                        objectTypeId: "0-1",
                        name: "start_date_select",
                        value: getRadioValue(form, "start_date_select"),
                    },
                    {
                        objectTypeId: "0-1",
                        name: "production",
                        value: getRadioValue(form, "production"),
                    },
                    {
                        objectTypeId: "0-1",
                        name: "number_of_users",
                        value: getRadioValue(form, "number_of_users"),
                    },
                    {
                        objectTypeId: "0-1",
                        name: "kuid",
                        value: localStorage.getItem("KUID"),
                    },
                    {
                        objectTypeId: "0-1",
                        name: "form_submission_identifier",
                        value: "Cloud Early Access Form",
                    },
                ],
                context: {
                    hutk: getHubspotTracking(),
                    ipAddress: ip.data.ip,
                    pageUri: props.routePath,
                    pageName: document.title,
                },
            }

            posthog.capture("cloud_form")
            hsq.push(["trackCustomBehavioralEvent", { name: "cloud_form" }])

            gtm?.trackEvent({
                event: "cloud_form",
                noninteraction: false,
            })

            identify(form["email"].value)

            axios
                .post(hubSpotUrl, formData, {})
                .then(() => {
                    valid.value = true
                    validMessage.value =
                        "Thanks for your interest in the cloud version of Kestra we will come back to you as soon as possible! 👍"
                    window.scrollTo({ top: 0, behavior: "smooth" })
                })
                .catch((error) => {
                    valid.value = false
                    if (
                        error.response?.data?.errors?.filter(
                            (e: any) => e.errorType === "BLOCKED_EMAIL",
                        ).length > 0
                    ) {
                        message.value = "Please use a professional email address"
                    } else {
                        message.value = error.response?.data?.message || "Form submission error"
                    }
                })
        }
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .column-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        min-height: 1234px;

        @media (max-width: 868px) {
            grid-template-columns: 1fr;
            min-height: auto;
        }

        .left-column {
            background-color: $white;
            padding: 64px 0;
            display: flex;
            justify-content: center;
            align-items: start;
            min-height: 100%;

            @media (max-width: 768px) {
                padding: 64px 20px;
                min-height: auto;
            }

            .form {
                &-container {
                    width: 400px;

                    @media (max-width: 768px) {
                        width: 100%;
                    }
                }

                &-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                &-description {
                    font-size: $font-size-md;
                    margin-bottom: 20px;
                }

                &-group {
                    margin-bottom: 15px;

                    .required-field {
                        color: #ab0009;
                    }

                    > label {
                        font-weight: 700;
                        margin-bottom: 4px;
                        line-height: 22px;
                        font-size: $font-size-sm;
                        display: block;
                    }
                }

                &-control {
                    width: 100%;
                    padding: 4px 12px 4px 16px;
                    margin-top: 5px;
                    border: 1px solid #e3e3e3;
                    border-radius: 4px;
                    background-color: $white;
                }
            }

            .radio {
                &-options {
                    display: flex;
                    flex-direction: column;
                    margin-top: 16px;
                }

                &-option {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;

                    input[type="radio"] {
                        appearance: none;
                        width: 20px;
                        height: 20px;
                        margin-right: 12px;
                        border: 2px solid #9797a6;
                        border-radius: 50%;
                        position: relative;
                        cursor: pointer;

                        &:checked {
                            border-color: $purple-40;

                            &::after {
                                content: "";
                                position: absolute;
                                inset: 3px;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background: $purple-40;
                            }
                        }

                        &:focus {
                            outline: 0;
                            box-shadow: 0 0 0 2px rgba($purple-40, 0.25);
                        }
                    }

                    label {
                        cursor: pointer;
                        font-size: $font-size-sm;
                        line-height: 22px;
                    }
                }
            }

            .success {
                margin: 20px 0;
                padding: 20px;
                color: #016046;
                background: #e4f9f3;
                border: 1px solid #21ce9c;
                border-radius: $border-radius-lg;
                font-weight: 600;
                animation:
                    successAppear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
                    glowEffect 2s ease-in-out infinite;
            }

            @keyframes successAppear {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }

                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            @keyframes glowEffect {
                0%,
                100% {
                    box-shadow: 0 0 15px rgba(76, 175, 80, 0.1);
                }

                50% {
                    box-shadow: 0 0 25px rgba(76, 175, 80, 0.2);
                }
            }

            .alert-danger {
                margin: 20px 0;
                padding: 10px 20px;
                background: #fff2f3;
                color: #ab0009;
                border: 1px solid #fd7279;
                border-radius: $border-radius;
                font-weight: 600;
            }
        }

        .right-column {
            background-color: #151515;
            background-image:
                linear-gradient(to bottom, #151515 0%, rgba(21, 21, 21, 0) 50%),
                url("./images/gradient-1.svg"), url("./images/gradient-2.png");
            background-repeat: no-repeat, no-repeat, no-repeat;
            background-position: center, bottom, bottom;
            background-size:
                100%,
                100% 70%,
                100% 80%;
            position: relative;
            overflow: hidden;
            color: $white;
            min-height: 100%;
            padding: 12rem;
            padding-left: 5rem;
            padding-right: 0;
            display: flex;
            flex-direction: column;

            .box {
                position: absolute;
                width: 460px;
                height: 460px;
                right: 0;
                bottom: 0;
                background: url("./images/box.png") no-repeat;
                background-size: contain;
                background-position: bottom right;
                z-index: 0;
                opacity: 1;

                @media (max-width: 768px) {
                    width: 300px;
                    height: 300px;
                }
            }

            @media screen and (max-width: 768px) {
                padding: 100px 0;
                padding-left: 30px;
                min-height: auto;
            }

            .testimonial {
                margin: 0 0 48px;
                padding: 0 64px 0 24px;
                border-left: 1px solid #fff;
                font-weight: 700;
                position: relative;
                z-index: 2;

                &-quote {
                    font-size: $font-size-lg;
                    line-height: 28px;
                    margin-bottom: 10px;
                }

                &-author {
                    font-size: $font-size-sm;
                    color: #e1e1e1;
                    margin-bottom: 10px;
                }

                &-logo img {
                    aspect-ratio: 187/40;
                    object-fit: contain;
                }
            }

            .flow-image {
                width: 100%;
                position: relative;
                right: 0;
                z-index: 2;

                img {
                    width: 100%;
                    height: auto;
                    object-fit: contain;
                    border-radius: 15px 0 0 15px;
                    max-width: 100%;
                    max-height: 100%;
                    margin-left: auto;
                    display: block;
                }

                &::after {
                    content: "";
                    position: absolute;
                    right: -20px;
                    bottom: 0;
                    width: 202px;
                    height: 155px;
                    background: url("./images/visual-cloud.png") no-repeat;
                    background-size: contain;
                    background-position: bottom right;
                    transform: translateY(20%);
                    z-index: 2;

                    @media (max-width: 768px) {
                        width: 120px;
                        height: 120px;
                    }
                }
            }
        }
    }
</style>