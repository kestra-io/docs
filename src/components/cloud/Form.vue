<template>
    <div class="meeting-container" :class="{ plain: variant === 'plain' }">
        <div v-if="!valid" class="meeting-form">
            <div v-if="variant !== 'plain'" class="form-header">
                <h3>Get in touch to get access</h3>
                <p>
                    Tell us what you're building and the team will get you set
                    up with access.
                </p>
            </div>
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
                    <label :for="fieldId('firstname')"
                        >First name <span class="required">*</span></label
                    >
                    <input
                        name="firstname"
                        type="text"
                        class="form-control"
                        :id="fieldId('firstname')"
                        :placeholder="
                            variant === 'plain' ? 'First name *' : undefined
                        "
                        required
                    />
                </div>

                <div class="col-md-6 mb-2">
                    <label :for="fieldId('lastname')"
                        >Last name <span class="required">*</span></label
                    >
                    <input
                        name="lastname"
                        type="text"
                        class="form-control"
                        :id="fieldId('lastname')"
                        :placeholder="
                            variant === 'plain' ? 'Last name *' : undefined
                        "
                        required
                    />
                </div>

                <div class="col-12 mb-2">
                    <label :for="fieldId('email')"
                        >Company Email <span class="required">*</span></label
                    >
                    <input
                        name="email"
                        type="email"
                        class="form-control"
                        :id="fieldId('email')"
                        :placeholder="
                            variant === 'plain' ? 'Company email *' : undefined
                        "
                        required
                    />
                </div>

                <div class="col-12 mb-2">
                    <label :for="fieldId('jobtitle')"
                        >Job title <span class="required">*</span></label
                    >
                    <input
                        name="jobtitle"
                        type="text"
                        class="form-control"
                        :id="fieldId('jobtitle')"
                        :placeholder="
                            variant === 'plain' ? 'Job title *' : undefined
                        "
                        required
                    />
                </div>

                <div class="col-12 mb-2">
                    <label :for="fieldId('employees')"
                        >Number of employees
                        <span class="required">*</span></label
                    >
                    <select
                        name="employees"
                        class="form-control"
                        :id="fieldId('employees')"
                        required
                    >
                        <option value="" disabled selected>
                            {{
                                variant === "plain"
                                    ? "Number of employees *"
                                    : "Select a range"
                            }}
                        </option>
                        <option value="below 100">below 100</option>
                        <option value="between 100 and 999">
                            between 100 and 999
                        </option>
                        <option value="1000+">1000+</option>
                    </select>
                </div>

                <div class="col-12 mb-2">
                    <label :for="fieldId('use_case_context')"
                        >What are you planning to orchestrate?
                        <span class="required">*</span></label
                    >
                    <textarea
                        name="use_case_context"
                        class="form-control"
                        :id="fieldId('use_case_context')"
                        :placeholder="
                            variant === 'plain'
                                ? 'What are you planning to orchestrate? *'
                                : undefined
                        "
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div class="col-12 mb-2 text-center">
                    <p class="privacy-text">
                        By submitting this form, you agree to our
                        <a target="_blank" href="/privacy-policy"
                            >Privacy Policy</a
                        >.
                    </p>
                </div>

                <div class="col-12 d-flex justify-content-center">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="submitting"
                    >
                        {{ submitting ? "Sending..." : submitLabel }}
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
    import { ref, useId, useTemplateRef } from "vue"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { getHubspotTracking, submitHubspotForm } from "~/utils/hubspot"
    import { $fetch } from "~/utils/fetch"
    import {
        CONNOR_CLOUD_MEETING_LINK,
        ensureMeetingsScriptLoaded,
        getMeetingUrl,
        tierFromEmployees,
    } from "~/composables/useMeeting"
    import type { Routing } from "~/utils/hubspotRouting"

    const {
        variant = "default",
        pageUri = "cloud",
        submitLabel = "Request access",
    } = defineProps<{
        /** `"plain"` drops the header and card chrome for a parent card, as on /lp/*. */
        variant?: "default" | "plain"
        /** Passed to HubSpot as the page the lead converted on. */
        pageUri?: string
        submitLabel?: string
    }>()

    // /cloud keeps its plain field ids; the plain variant prefixes them per
    // instance, so the two forms on an /lp/* page keep their labels apart.
    const uid = useId()
    const fieldId = (name: string) =>
        variant === "plain" ? `${uid}-${name}` : name

    const formRef = useTemplateRef<HTMLFormElement>("cloud-form")

    const message = ref("")
    const valid = ref(false)
    const meetingUrl = ref("")
    const submitting = ref(false)

    const HUBSPOT_FORM_ID = "d9c2b4db-0b35-409d-a69e-8e4186867b03"

    const COMPANY_SIZE_OBJECT_TYPE_ID = "0-2"
    const COMPANY_SIZE_PROPERTY = "number_of_employees"

    function cloudMeetingUrl(employees: string, routing?: Routing) {
        return getMeetingUrl(routing?.tier ?? tierFromEmployees(employees), {
            fallback: CONNOR_CLOUD_MEETING_LINK,
            territory: routing?.territory,
        })
    }

    function withContactParams(
        base: string,
        {
            firstname,
            lastname,
            email,
        }: {
            firstname?: string | null
            lastname?: string | null
            email?: string | null
        } = {},
    ) {
        try {
            const url = new URL(base, window.location.origin)
            if (firstname)
                url.searchParams.set("firstname", String(firstname).trim())
            if (lastname)
                url.searchParams.set("lastname", String(lastname).trim())
            if (email) url.searchParams.set("email", String(email).trim())
            return url.toString()
        } catch {
            const sep = base.includes("?") ? "&" : "?"
            const qp = new URLSearchParams()
            if (firstname) qp.set("firstname", String(firstname).trim())
            if (lastname) qp.set("lastname", String(lastname).trim())
            if (email) qp.set("email", String(email).trim())
            return `${base}${sep}${qp.toString()}`
        }
    }

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
            const employees = formDataObj.get("employees") as string
            const jobtitle = formDataObj.get("jobtitle") as string
            const kuid = localStorage.getItem("KUID") || ""

            const hsq = ((window as any)._hsq = (window as any)._hsq || [])
            hsq.push(["identify", { email, firstname, lastname, kuid }])

            const { ip } = await $fetch<{ ip: string }>(
                "https://api.ipify.org?format=json",
            )

            const payload = {
                fields: [
                    { name: "firstname", value: firstname },
                    { name: "lastname", value: lastname },
                    { name: "email", value: email },
                    { name: "jobtitle", value: jobtitle },
                    { name: "use_case_context", value: useCase },
                    {
                        objectTypeId: COMPANY_SIZE_OBJECT_TYPE_ID,
                        name: COMPANY_SIZE_PROPERTY,
                        value: employees,
                    },
                    {
                        name: "form_submission_identifier",
                        value: "Contact for Cloud Edition",
                    },
                    { name: "kuid", value: kuid },
                ],
                context: {
                    hutk: getHubspotTracking() || undefined,
                    ipAddress: ip,
                    pageUri,
                    pageName: document.title,
                },
            }

            const result = await submitHubspotForm<{ routing?: Routing }>(
                HUBSPOT_FORM_ID,
                payload,
            )

            valid.value = true
            meetingUrl.value = withContactParams(
                cloudMeetingUrl(employees, result?.routing),
                {
                firstname,
                lastname,
                email,
            })

            try {
                posthog.capture("cloud_form")
                hsq.push(["trackCustomBehavioralEvent", { name: "cloud_form" }])
                // Straight to the data layer: the vue-gtm plugin is created with
                // `enabled: false`, so its trackEvent never reaches GTM.
                ;(window.dataLayer = window.dataLayer || []).push({
                    event: "cloud_form",
                    noninteraction: false,
                })
                identify(email)
            } catch (analyticsError) {
                console.error("Cloud form analytics error", analyticsError)
            }

            void ensureMeetingsScriptLoaded().then(() => {
                hsq.push(["refreshPageHandlers"])
                hsq.push(["trackPageView"])
            })
        } catch (error: any) {
            const isBlocked = error?.response?.data?.errors?.some(
                (e: any) => e.errorType === "BLOCKED_EMAIL",
            )
            message.value = isBlocked
                ? "Please use a professional email address."
                : error?.response?.data?.message ||
                  "Something went wrong. Please check your connection and try again."
        } finally {
            submitting.value = false
        }
    }
</script>

<style scoped lang="scss">
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

            .form-header {
                margin-bottom: 1.5rem;

                h3 {
                    font-size: $font-size-xl;
                    font-weight: 600;
                    color: var(--ks-content-primary);
                    margin-bottom: 0.5rem;
                }

                p {
                    font-size: $font-size-sm;
                    color: var(--ks-content-secondary);
                    margin: 0;
                }
            }

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

            select.form-control {
                appearance: auto;
                width: 100%;
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

        /* Same field treatment as Meeting.vue's plain variant on /lp/*:
         * placeholders instead of visible labels, one 16px rhythm. */
        &.plain {
            padding: 0;

            .meeting-form {
                max-width: none;
                padding: 0;
                border: 0;
                background: transparent;
            }

            form {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1rem 0.5rem;
                margin: 0;
                @include media-breakpoint-up(md) {
                    grid-template-columns: repeat(2, 1fr);
                }

                > * {
                    width: auto;
                    margin: 0 !important;
                    padding: 0;
                }

                > .col-12:not(.col-md-6) {
                    grid-column: 1 / -1;
                }
            }

            // Visually hidden, still read out: the placeholders carry the text.
            label {
                position: absolute;
                width: 1px;
                height: 1px;
                overflow: hidden;
                clip-path: inset(50%);
                white-space: nowrap;
            }

            .form-control {
                min-height: 48px;
                margin: 0;
                padding: 0.75rem 0.875rem;
                border: 1px solid #e9e9ee;
                border-radius: 8px;
                background: #ffffff;
                color: #08090a;

                &::placeholder {
                    color: #7e7e9b;
                }
            }

            select.form-control {
                appearance: none;
                padding-right: 2.25rem;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237e7e9b'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 0.625rem center;
                background-size: 1.25rem 1.25rem;

                &:invalid {
                    color: #7e7e9b;
                }
            }

            .privacy-text {
                margin: 0;
                color: #3b3a41;
                font-size: $font-size-xs;
                text-align: left;

                a {
                    color: #631bff;
                    text-decoration: underline;
                }
            }

            .btn-primary {
                width: 100%;
                min-height: 52px;
                padding: 0.875rem 1.75rem;
                border-radius: 8px;
                font-size: 1.25rem;
                font-weight: 700;
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
