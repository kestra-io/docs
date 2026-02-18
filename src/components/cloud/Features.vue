<template>
    <div class="container my-3 py-3">
        <div class="row mt-4">
            <div class="col-md-12 col-lg-7">
                <h2 data-usal="fade-up">
                    Kestra Cloud
                    <span class="highlight">Let's talk to get access</span>
                </h2>
                <h5 class="mt-3" data-usal="fade-up">
                    Be among the first to experience Kestra Cloud <br />with exclusive access before
                    general availability
                </h5>

                <div class="row mt-5">
                    <div v-for="feature in FEATURES" :key="feature.title" class="col-6 mb-3" data-usal="fade-right">
                        <h6>
                            <img :src="feature.icon" :alt="feature.title" />
                            {{ feature.title }}
                        </h6>
                        <p>{{ feature.description }}</p>
                    </div>

                    <div class="col-12 testimonial" data-usal="fade-up">
                        <p class="mb-2 italic">“{{ TESTIMONIAL.text }}”</p>
                        <div class="d-flex flex-column text-white">
                            <strong>{{ TESTIMONIAL.author }}</strong>
                            <small>{{ TESTIMONIAL.designation }}</small>
                        </div>
                        <span class="company-logo" v-html="TESTIMONIAL.logo" role="img" :aria-label="TESTIMONIAL.company" />
                    </div>
                </div>
            </div>

            <div class="col-md-12 col-lg-5 meeting-container">
                <div v-if="!valid" class="meeting-form" data-usal="fade-left">
                    <img
                        class="background"
                        :src="headerBackground.src"
                        aria-hidden="true"
                    />
                    <form
                        class="row needs-validation"
                        ref="cloud-form"
                        @submit.prevent="onSubmit"
                        novalidate
                    >
                        <div v-if="message" class="alert alert-danger mb-4">
                            {{ message }}
                        </div>

                        <h4 class="mb-4">Request Access to Kestra Cloud</h4>

                        <div class="col-md-6 mb-3">
                            <label for="firstname" class="visually-hidden">First Name</label>
                            <input
                                name="firstname"
                                type="text"
                                class="form-control"
                                id="firstname"
                                placeholder="First Name"
                                required
                            />
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="lastname" class="visually-hidden">Last Name</label>
                            <input
                                name="lastname"
                                type="text"
                                class="form-control"
                                id="lastname"
                                placeholder="Last Name"
                                required
                            />
                        </div>

                        <div class="col-12 mb-3">
                            <label for="email" class="visually-hidden">Company Email</label>
                            <input
                                name="email"
                                type="email"
                                class="form-control"
                                id="email"
                                placeholder="Company Email"
                                required
                            />
                        </div>

                        <div class="col-12 mb-3">
                            <label for="use_case_context" class="visually-hidden">Orchestration strategy</label>
                            <textarea
                                name="use_case_context"
                                class="form-control"
                                id="use_case_context"
                                rows="3"
                                placeholder="Tell us more about your Orchestration strategy and how we can help."
                            ></textarea>
                        </div>

                        <div class="col-12 mb-4">
                            <small>
                                By submitting this form, you agree to our
                                <a target="_blank" href="/privacy-policy">Privacy Policy.</a>
                            </small>
                        </div>

                        <div class="col-12">
                            <button type="submit" class="btn btn-primary w-100 py-2" :disabled="submitting">
                                {{ submitting ? 'Sending...' : 'Talk to us' }}
                            </button>
                        </div>
                    </form>
                </div>

                <div v-else class="iframe-container" data-usal="zoom-in">
                    <iframe
                        v-if="meetingUrl"
                        :src="meetingUrl"
                        allowtransparency="true"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    ></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, useTemplateRef, onMounted } from "vue"
    import axios from "axios"
    import posthog from "posthog-js"
    import { useGtm } from "@gtm-support/vue-gtm"
    import { getHubspotTracking } from "~/utils/hubspot"
    import identify from "~/utils/identify"
    import { getMeetingUrl, ensureMeetingsScriptLoaded } from "~/composables/useMeeting"


    import headerBackground from "../demo/assets/header-background.png"
    import calendarMonthImage from "./images/calendar_month.png"
    import smallCloudImage from "./images/small_cloud.png"
    import supportAgentImage from "./images/support_agent.png"
    import checkCircleImage from "./images/check_circle.png"
    import foundationSvg from "./images/foundation.svg?raw"



    const gtm = useGtm()
    const formRef = useTemplateRef<HTMLFormElement>("cloud-form")

    const valid = ref(false)
    const submitting = ref(false)
    const message = ref("")
    const meetingUrl = ref("")

    const FEATURES = [
        {
            title: "Get Exclusive 30-Day Access",
            description: "Explore Kestra Cloud with full, exclusive access for 30 days prior to general availability.",
            icon: calendarMonthImage.src
        },
        {
            title: "Fully Managed Infrastructure",
            description: "No infrastructure setup, deployment worries, or ongoing maintenance. We handle the heavy lifting while you focus on your workflows.",
            icon: smallCloudImage.src
        },
        {
            title: "Dedicated Experts Exchange",
            description: "Receive personalized support and expert guidance throughout your access period.",
            icon: supportAgentImage.src
        },
        {
            title: "Enterprise Feature Set",
            description: "Access enterprise features including enhanced security, RBAC, observability, and governance during your exclusive access.",
            icon: checkCircleImage.src
        }
    ]

    const TESTIMONIAL = {
        text: "Kestra Cloud has been a pivotal part of giving us flexibility and scalability we need to pull off complex processes we do at Foundation Direct.",
        author: "Michael Heidner",
        designation: "SVP of Analytics and Business Intelligence & Kestra Cloud Adopter",
        company: "Foundation Direct",
        logo: foundationSvg
    }

    const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/d9c2b4db-0b35-409d-a69e-8e4186867b03"

    onMounted(() => {
        if (getHubspotTracking() === null) {
            meetingUrl.value = getMeetingUrl()
            valid.value = true
        }
    })

    const onSubmit = async () => {
        const form = formRef.value
        if (!form || !form.checkValidity()) {
            message.value = "Please fill in all required fields correctly."
            return
        }

        submitting.value = true
        message.value = ""

        try {
            const formDataObj = new FormData(form)
            const email = formDataObj.get("email") as string
            const firstname = formDataObj.get("firstname") as string
            const lastname = formDataObj.get("lastname") as string
            const useCase = formDataObj.get("use_case_context") as string
            const kuid = localStorage.getItem("KUID") || ""

            const hsq = ((window as any)._hsq = (window as any)._hsq || [])
            hsq.push(["identify", { email, firstname, lastname, kuid }])

            const { data: { ip } } = await axios.get("https://api.ipify.org?format=json")

            const payload = {
                fields: [
                    { name: "firstname", value: firstname },
                    { name: "lastname", value: lastname },
                    { name: "email", value: email },
                    { name: "use_case_context", value: useCase },
                    { name: "form_submission_identifier", value: "Contact for Cloud Edition" },
                    { name: "kuid", value: kuid },
                ],
                context: {
                    hutk: getHubspotTracking() || undefined,
                    ipAddress: ip,
                    pageUri: "cloud",
                    pageName: document.title,
                },
            }

            await axios.post(hubSpotUrl, payload)

            posthog.capture("cloud_form")
            hsq.push(["trackCustomBehavioralEvent", { name: "cloud_form" }])
            gtm?.trackEvent({ event: "cloud_form", noninteraction: false })
            identify(email)

            valid.value = true
            await ensureMeetingsScriptLoaded()
            hsq.push(["refreshPageHandlers"])
            hsq.push(["trackPageView"])
            meetingUrl.value = getMeetingUrl()
        } catch (error: any) {
            const isBlocked = error?.response?.data?.errors?.some((e: any) => e.errorType === "BLOCKED_EMAIL")
            message.value = isBlocked
                ? "Please use a professional email address."
                : (error?.response?.data?.message || "Something went wrong. Please check your connection and try again.")
        } finally {
            submitting.value = false
        }
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .meeting-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 600px;
        .meeting-form {
            width: 100%;
            max-width: 450px;
            padding: 2.5rem;
            background: var(--ks-background-secondary);
            border-radius: $border-radius-lg;
            position: relative;
            z-index: 1;
            border: $block-border;
            h4 {
                color: var(--ks-content-color-highlight);
                font-weight: 700;
                text-align: center;
            }
            small {
                color: var(--ks-content-tertiary);
                a {
                    color: var(--ks-content-link);
                }
            }
            img.background {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(1.2);
                width: 150%;
                opacity: 0.15;
                filter: blur(10px);
                z-index: -1;
                pointer-events: none;
            }
            .form-control {
                border: $block-border;
                padding: 0.75rem 1rem;
                background: var(--ks-background-secondary);
                color: var(--ks-content-primary);
                &::placeholder {
                    color: var(--ks-content-tertiary);
                }
                &:focus {
                    border-color: var(--ks-border-active);
                    box-shadow: 0 0 0 0.25rem rgba(var(--ks-border-active), 0.1);
                }
            }
        }
        .iframe-container {
            width: 100%;
            height: 750px;
            border-radius: $border-radius-lg;
            overflow: hidden;
            box-shadow: 0px 12.972px 39.7269px rgba(90, 0, 176, 0.1);
            iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
        }
    }

    .testimonial {
        border-left: 1px solid var(--ks-border-secondary);
        padding-left: 1.5rem;
        .italic {
            font-style: italic;
            font-size: 1.1rem;
            line-height: 1.6;
        }
        .company-logo {
            display: inline-block;
            max-height: 40px;
            margin-top: 1rem;
        }
    }

    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
</style>