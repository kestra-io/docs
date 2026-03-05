<template>
    <div class="meeting-container">
        <div v-if="!valid" class="meeting-form">
            <form
                class="row"
                ref="cloud-form"
                @submit.prevent="onSubmit"
                novalidate
            >
                <div v-if="message" class="col-12 alert-danger mb-4">
                    {{ message }}
                </div>

                <div class="col-md-6 mb-2">
                    <label for="firstname">First name <span class="required">*</span></label>
                    <input
                        name="firstname"
                        type="text"
                        class="form-control"
                        id="firstname"
                        required
                    />
                </div>

                <div class="col-md-6 mb-2">
                    <label for="lastname">Last name <span class="required">*</span></label>
                    <input
                        name="lastname"
                        type="text"
                        class="form-control"
                        id="lastname"
                        required
                    />
                </div>

                <div class="col-12 mb-2">
                    <label for="email">Company Email <span class="required">*</span></label>
                    <input
                        name="email"
                        type="email"
                        class="form-control"
                        id="email"
                        required
                    />
                </div>

                <div class="col-12 mb-2">
                    <label for="use_case_context">Tell us more about your Orchestration strategy and how we can help <span class="required">*</span></label>
                    <textarea
                        name="use_case_context"
                        class="form-control"
                        id="use_case_context"
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div class="col-12 mb-2 text-center">
                    <p class="privacy-text">
                        By submitting this form, you agree to our
                        <a target="_blank" href="/privacy-policy">Privacy Policy</a>.
                    </p>
                </div>

                <div class="col-12 d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary" :disabled="submitting">
                        {{ submitting ? 'Sending...' : 'Request access' }}
                    </button>
                </div>
            </form>
        </div>

        <div v-else class="iframe-container" data-usal="zoomin">
            <iframe
                v-if="meetingUrl"
                :src="meetingUrl"
                allowtransparency="true"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            ></iframe>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, useTemplateRef, onMounted } from "vue"
    import axios from "axios"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"
    import { getHubspotTracking } from "~/utils/hubspot"
    import { getMeetingUrl, ensureMeetingsScriptLoaded } from "~/composables/useMeeting"

    const gtm = useGtm()
    const formRef = useTemplateRef<HTMLFormElement>("cloud-form")

    const message = ref("")
    const valid = ref(false)
    const meetingUrl = ref("")
    const submitting = ref(false)

    const HUBSPOT_URL = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/d9c2b4db-0b35-409d-a69e-8e4186867b03"

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

            await axios.post(HUBSPOT_URL, payload)

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
        width: 100%;
        height: 100%;
        padding: 2rem;

        @include media-breakpoint-down(lg) {
            padding: 2rem 0rem;
        }

        .meeting-form {
            width: 100%;
            padding: 2rem;
            @include media-breakpoint-up(lg) {
                max-width: 633px;
                max-height: fit-content;
                padding: 2rem 4rem;
            }
            background: var(--ks-background-primary);
            border-radius: $border-radius-lg;
            border: 1px solid var(--ks-border-secondary);
            position: relative;
            z-index: 1;

            label {
                display: block;
                font-size: $font-size-md;
                margin-bottom: 0.5rem;

                .required {
                    color: var(--ks-content-alert-danger);
                }
            }

            .alert-danger {
                color: var(--ks-content-alert-danger);
                font-weight: 700;
            }

            .form-control {
                border: 1px solid var(--ks-border-secondary);
                padding: 0.75rem 1rem;
                background: var(--ks-background-input);
                color: var(--ks-content-primary);
                font-size: $font-size-sm;
                border-radius: 4px;
                margin-bottom: 0.5rem;

                &:focus {
                    border-color: var(--ks-border-active);
                    box-shadow: 0 0 0 0.15rem var(--ks-shadows-light);
                    outline: none;
                }
            }

            .privacy-text {
                color: var(--ks-content-primary);
                font-size: $font-size-sm;
                margin-top: 1rem;

                a {
                    color: var(--ks-content-color-highlight);
                    text-decoration: none;
                    &:hover {
                        text-decoration: underline;
                    }
                }
            }

            .btn-primary {
                &:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            }
        }

        .iframe-container {
            width: 100%;
            height: 750px;
            border-radius: $border-radius-lg;
            overflow: hidden;
            background: transparent;
            position: relative;
            z-index: 1;

            @include media-breakpoint-down(lg) {
                height: 600px;
            }

            iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
        }
    }
</style>
