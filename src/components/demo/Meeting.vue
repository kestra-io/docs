<script lang="ts" setup>
import { ref, useTemplateRef } from "vue"
import axios from "axios"
import posthog from "posthog-js"
import { useGtm } from "@gtm-support/vue-gtm"
import identify from "~/utils/identify"
import { getHubspotTracking } from "~/utils/hubspot.js"
import { getMeetingUrl } from "~/composables/useMeeting.js"

const gtm = useGtm()
const valid = ref(false)
const message = ref("")
const meetingUrl = ref<string>()
const formRef = useTemplateRef("demo-form")

const props = defineProps<{
    routePath: string
    headerBackground: {
        src: string
    }
}>()

const hubSpotUrl =
        "https://api.hsforms.com/submissions/v3/integration/submit/27220195/d8175470-14ee-454d-afc4-ce8065dee9f2"

const onSubmit = async (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    const script = document.createElement("script")
    script.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
    script.defer = true
    document.body.appendChild(script)

    script.addEventListener(
        "load",
        async () => {
            const form = formRef.value
            const hsq = (window._hsq = window._hsq || [])

            if (!form?.checkValidity()) {
                valid.value = false
                message.value = "Please check the form fields and try again."
                return
            }

            const fn = form["first-name"].value
            const ln = form["last-name"].value
            const em = form["email"].value

            hsq.push([
                "identify",
                {
                    email: em,
                    firstname: fn,
                    lastname: ln,
                    kuid: localStorage.getItem("KUID") || "",
                },
            ])

            const ip = await axios.get("https://api.ipify.org?format=json")
            const formData = {
                fields: [
                    { objectTypeId: "0-1", name: "email", value: em },
                    { objectTypeId: "0-1", name: "firstname", value: fn },
                    { objectTypeId: "0-1", name: "lastname", value: ln },
                    {
                        objectTypeId: "0-1",
                        name: "kuid",
                        value: localStorage.getItem("KUID") || "",
                    },
                ],
                context: {
                    hutk: getHubspotTracking() || undefined,
                    ipAddress: ip.data.ip,
                    pageUri: props.routePath,
                    pageName: document.title,
                },
            }

            posthog.capture("bookdemo_form")
            hsq.push(["trackCustomBehavioralEvent", { name: "bookdemo_form" }])
            gtm?.trackEvent({
                event: "bookdemo_form",
                noninteraction: false,
            })
            // Guarded in case identify() isn't globally defined
            // eslint-disable-next-line no-undef
            if (typeof identify === "function") identify(em)

            axios
                .post(hubSpotUrl, formData, {})
                .then(async () => {
                    valid.value = true
                    hsq.push(["refreshPageHandlers"])
                    hsq.push(["trackPageView"])

                    meetingUrl.value = withContactParams(getMeetingUrl(), {
                        firstname: fn,
                        lastname: ln,
                        email: em,
                    })
                })
                .catch((error) => {
                    valid.value = false
                    if (
                        error?.response?.data?.errors?.some?.(
                            (e: any) => e.errorType === "BLOCKED_EMAIL",
                        )
                    ) {
                        message.value = "Please use a professional email address"
                    } else {
                        message.value =
                            error?.response?.data?.message ||
                            "It looks like we've hit a snag. Please ensure cookies are enabled and that any ad-blockers are disabled for this site, then try again."
                    }
                })
        },
        { once: true },
    )
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
        if (firstname) url.searchParams.set("firstname", String(firstname).trim())
        if (lastname) url.searchParams.set("lastname", String(lastname).trim())
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
</script>

<template>
    <div class="col-12 col-lg-6 align-items-center d-flex meeting-container">
        <div v-if="valid === false" class="meeting-form">
            <img
                class="background d-none d-md-block"
                :src="headerBackground.src"
                aria-hidden="true"
                data-usal="fade-r"
            />
            <form
                class="row needs-validation"
                ref="demo-form"
                novalidate
                data-usal="fade-l"
                @submit="onSubmit"
            >
                <div v-if="message" class="alert alert-danger mt-3 mb-0">
                    {{ message }}
                </div>

                <div class="col-md-6 col-12">
                    <label for="demo-first-name" class="form-label mb-0">
                        First name
                    </label>
                    <input
                        id="demo-first-name"
                        name="first-name"
                        type="text"
                        class="form-control"
                        placeholder="First name"
                        required
                    />
                </div>

                <div class="col-md-6 col-12">
                    <label for="demo-last-name" class="form-label mb-0">
                        Last name
                    </label>
                    <input
                        id="demo-last-name"
                        name="last-name"
                        type="text"
                        class="form-control"
                        placeholder="Last name"
                        required
                    />
                </div>

                <div class="col-12">
                    <label for="demo-email" class="form-label mb-0">
                        Company email
                    </label>
                    <input
                        id="demo-email"
                        name="email"
                        type="email"
                        class="form-control"
                        placeholder="Company email"
                        required
                    />
                </div>

                <div class="col-12 mt-3">
                    <small class="agree">
                        By submitting this form, you agree to our
                        <a target="_blank" href="/privacy-policy"> Privacy Policy. </a>
                    </small>
                </div>

                <div class="col-12 mt-4 d-flex justify-content-center">
                    <button type="submit" class="btn btn-primary w-100">
                        Let's Talk
                    </button>
                </div>
            </form>
        </div>

        <div v-else class="custom-meetings-iframe-container embed-responsive">
            <div class="iframe-wrapper">
                <iframe
                    v-if="meetingUrl"
                    :src="meetingUrl"
                    class="embed-responsive-item"
                    style="
                        min-height: 750px;
                        min-width: 350px;
                        border: none;
                        width: 100%;
                    "
                    allowtransparency="true"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
            </div>
        </div>
    </div>
</template>
