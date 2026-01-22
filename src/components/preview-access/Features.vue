<template>
    <div class="container mt-5 pt-5">
        <div class="row mt-5">
            <div class="col-md-12 col-lg-7">
                <h2>
                    Kestra
                    <span class="highlight"> Preview Mode </span>
                </h2>
                <h5 class="mt-3">
                    Instantly access a read-only version of Kestra to explore its interface and
                    workflows, no setup required.
                </h5>
                <div class="row mt-4">
                    <div class="col-6">
                        <h6>
                            <img :src="calendarMonthImage.src" />
                            Access to Kestra interface
                        </h6>
                        <p>
                            Enter your details to immediately receive your read-only demo
                            environment.
                        </p>
                    </div>
                    <div class="col-6">
                        <h6>
                            <img :src="smallCloudImage.src" />
                            Explore Kestra Firsthand
                        </h6>
                        <p>
                            Navigate and experience the Kestra interface directly—no setup required.
                        </p>
                    </div>
                    <div class="col-6 mt-3">
                        <h6>
                            <img :src="hammerWrenchImage.src" />
                            Discover Kestra Features
                        </h6>
                        <p>
                            Familiarize yourself with Kestra’s UI, workflow structure, and
                            capabilities at your own pace.
                        </p>
                    </div>
                    <div class="col-6 mt-3">
                        <h6>
                            <img :src="checkCircleImage.src" />
                            Interested in Full Access?
                        </h6>
                        <p>
                            Apply for our Kestra Cloud Early Adopter Program:
                            <href src="/cloud/">Apply</href>
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-md-13 col-lg-5 form">
                <div v-if="valid" v-html="validMessage" class="success" />
                <form
                    v-else
                    class="row needs-validation"
                    ref="cloud-form"
                    @submit="onSubmit"
                    novalidate
                    data-usal="fade-l"
                >
                    <div v-if="message" class="alert alert-danger mt-3 mb-0">
                        {{ message }}
                    </div>
                    <h4 class="mb-4">Request Access to Kestra Preview Environment</h4>
                    <div class="col-6">
                        <label for="firstname">
                            <span class="text-danger">*</span>
                            First Name
                        </label>
                        <input
                            name="firstname"
                            type="text"
                            class="form-control"
                            id="firstname"
                            required
                        />
                    </div>
                    <div class="col-6">
                        <label for="lastname">
                            <span class="text-danger">*</span>
                            Last Name
                        </label>
                        <input
                            name="lastname"
                            type="text"
                            class="form-control"
                            id="lastname"
                            required
                        />
                    </div>
                    <div class="col-12 mt-3">
                        <label for="email">
                            <span class="text-danger">*</span>
                            Company Email
                        </label>
                        <input name="email" type="email" class="form-control" id="email" required />
                    </div>
                    <div class="col-12 mt-4 pb-5 d-flex justify-content-center">
                        <button type="submit" class="btn btn-primary w-100">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import axios from "axios"
    import { getHubspotTracking } from "~/utils/hubspot.js"
    import posthog from "posthog-js"
    import { ref, useTemplateRef } from "vue"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"
    import calendarMonthImage from "./images/calendar_month.png"
    import smallCloudImage from "./images/small_cloud.png"
    import hammerWrenchImage from "./images/hammer_wrench.png"
    import checkCircleImage from "./images/check_circle.png"

    const gtm = useGtm()
    const props = defineProps<{
        routePath: string
    }>()
    const formRef = useTemplateRef("cloud-form")

    const valid = ref(false)
    const validMessage = ref("")
    const message = ref("")

    const hubSpotUrl =
        "https://api.hsforms.com/submissions/v3/integration/submit/27220195/230d0ed2-2484-4e9e-86c6-135a6398fac5"

    const onSubmit = async (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        const form = formRef.value as HTMLFormElement
        const hsq = ((window as any)._hsq = (window as any)._hsq || [])
        if (!form.checkValidity()) {
            valid.value = false
            message.value = "Invalid form, please review the fields."
        } else {
            hsq.push([
                "identify",
                {
                    email: form["email"].value,
                    firstname: form["firstname"].value,
                    lastname: form["lastname"].value,
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
                        objectTypeId: "0-1",
                        name: "form_submission_identifier",
                        value: "Live Demo Request Access",
                    },
                    {
                        objectTypeId: "0-1",
                        name: "kuid",
                        value: localStorage.getItem("KUID"),
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
            gtm?.trackEvent({ event: "cloud_form", noninteraction: false })
            identify(form["email"].value)
            axios
                .post(hubSpotUrl, formData, {})
                .then((response) => {
                    valid.value = true
                    validMessage.value = response.data.inlineMessage
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

<style scoped lang="scss">
    .livedemo {
        & img {
            width: 180px;
            height: auto;
        }
        h6 > img {
            width: 30px;
            height: auto;
            margin-right: 10px;
        }
        & .form {
            position: relative;
            padding: 60px 40px 0 40px;
            border-radius: 16px;
            background-color: white;
            label:not(.form-check-label) {
                font-weight: 600;
            }
            &::after {
                @media (min-width: 992px) {
                    content: "";
                    position: absolute;
                    top: -40%;
                    right: -10%;
                    width: 200px;
                    height: 200px;
                    background-image: url("./images/Logo_kestra.svg");
                    background-size: contain;
                    background-repeat: no-repeat;
                    z-index: 1;
                }
            }
            &::before {
                content: "";
                position: absolute;
                top: -70%;
                right: -135%;
                width: 1200px;
                height: 1000px;
                background-image: url("./images/Topo-bg.png");
                background-size: contain;
                background-repeat: no-repeat;
                z-index: -1;
            }
        }
    }
</style>