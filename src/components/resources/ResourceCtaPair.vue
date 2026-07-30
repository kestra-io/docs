<template>
    <aside class="cta-pair">
        <h3 class="cta-title">{{ heading }}</h3>
        <p class="cta-text">{{ text }}</p>

        <div v-if="!formOpen && !submitted" class="cta-actions">
            <a href="/demo" class="btn btn-primary" @click="onDemoClick">
                Book a demo
            </a>
            <button
                type="button"
                class="btn btn-secondary"
                @click="onWhitepaperClick"
            >
                {{ requestLabel }}
            </button>
        </div>

        <form
            v-else-if="!submitted"
            class="row cta-form"
            ref="request-form"
            @submit.prevent="onSubmit"
            novalidate
        >
            <div v-if="message" class="col-12 alert-danger mb-3">
                {{ message }}
            </div>

            <div class="col-md-6 mb-2">
                <label for="cta-firstname">First name</label>
                <input
                    name="firstname"
                    type="text"
                    class="form-control"
                    id="cta-firstname"
                    required
                />
            </div>

            <div class="col-md-6 mb-2">
                <label for="cta-lastname">Last name</label>
                <input
                    name="lastname"
                    type="text"
                    class="form-control"
                    id="cta-lastname"
                    required
                />
            </div>

            <div class="col-12 mb-2">
                <label for="cta-email">Company email</label>
                <input
                    name="email"
                    type="email"
                    class="form-control"
                    id="cta-email"
                    required
                />
            </div>

            <div class="col-12 mb-2">
                <label for="cta-jobtitle">Job title</label>
                <input
                    name="jobtitle"
                    type="text"
                    class="form-control"
                    id="cta-jobtitle"
                    required
                />
            </div>

            <div class="col-12 mt-2">
                <button
                    type="submit"
                    class="btn btn-primary w-100"
                    :disabled="submitting"
                >
                    {{ submitting ? "Sending..." : requestLabel }}
                </button>
            </div>

            <div class="col-12 mt-3">
                <p class="privacy-text">
                    We'll email you the {{ assetLabel }} as soon as it's
                    published. By submitting this form, you agree to our
                    <a target="_blank" href="/privacy-policy">Privacy Policy</a
                    >.
                </p>
            </div>
        </form>

        <div v-else class="cta-thanks">
            <h4 class="thanks-title">You're on the list.</h4>
            <p class="cta-text">
                We'll email you the {{ assetLabel }} as soon as it's published.
                In the meantime, if you'd rather talk your migration through
                with someone, we're happy to.
            </p>
            <a href="/demo" class="btn btn-primary" @click="onDemoClick">
                Book a demo
            </a>
        </div>
    </aside>
</template>

<script setup lang="ts">
    import { computed, ref, useTemplateRef } from "vue"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"
    import { getHubspotTracking, submitHubspotForm } from "~/utils/hubspot"

    const props = withDefaults(
        defineProps<{
            heading: string
            text: string
            eventPrefix: string
            formLabel: string
            assetLabel?: string
            hubspotFormId?: string
            pageUri?: string
        }>(),
        {
            assetLabel: "guide",
            // Shared "gated asset request" form. It already carries the
            // firstname / lastname / email / jobtitle / form_submission_identifier
            // / kuid fields, so a new asset needs no new HubSpot form: filter
            // submissions on `form_submission_identifier` instead.
            hubspotFormId: "e1706097-e681-441a-8306-7e715e9daa9a",
        },
    )

    const gtm = useGtm()
    const formRef = useTemplateRef<HTMLFormElement>("request-form")

    const formOpen = ref(false)
    const submitted = ref(false)
    const submitting = ref(false)
    const message = ref("")

    const requestLabel = computed(() => `Get the ${props.assetLabel}`)

    /** Fire the same event into PostHog, GTM and HubSpot behavioural events. */
    const track = (event: string) => {
        posthog.capture(event)
        gtm?.trackEvent({ event, noninteraction: false })
        const hsq = ((window as any)._hsq = (window as any)._hsq || [])
        hsq.push(["trackCustomBehavioralEvent", { name: event }])
    }

    const onDemoClick = () => track(`${props.eventPrefix}_demo_cta_click`)

    const onWhitepaperClick = () => {
        formOpen.value = true
        track(`${props.eventPrefix}_asset_cta_click`)
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
            const data = new FormData(form)
            const email = data.get("email") as string
            const firstname = data.get("firstname") as string
            const lastname = data.get("lastname") as string
            const jobtitle = data.get("jobtitle") as string
            const kuid = localStorage.getItem("KUID") || ""

            const hsq = ((window as any)._hsq = (window as any)._hsq || [])
            hsq.push([
                "identify",
                { email, firstname, lastname, jobtitle, kuid },
            ])

            await submitHubspotForm(props.hubspotFormId, {
                fields: [
                    {
                        objectTypeId: "0-1",
                        name: "firstname",
                        value: firstname,
                    },
                    { objectTypeId: "0-1", name: "lastname", value: lastname },
                    { objectTypeId: "0-1", name: "email", value: email },
                    { objectTypeId: "0-1", name: "jobtitle", value: jobtitle },
                    {
                        objectTypeId: "0-1",
                        name: "form_submission_identifier",
                        value: props.formLabel,
                    },
                    { objectTypeId: "0-1", name: "kuid", value: kuid },
                ],
                context: {
                    hutk: getHubspotTracking() || undefined,
                    pageUri:
                        props.pageUri ??
                        (typeof window !== "undefined"
                            ? window.location.pathname
                            : ""),
                    pageName:
                        typeof document !== "undefined" ? document.title : "",
                },
            })

            track(`${props.eventPrefix}_asset_request`)
            identify(email)

            submitted.value = true
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
    .cta-pair {
        margin-top: 3rem;
        padding: 2rem;
        background: var(--ks-background-secondary);
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;

        @include media-breakpoint-up(md) {
            padding: 2.5rem;
        }
    }

    .cta-title {
        font-size: $font-size-xl;
        font-weight: 600;
        margin: 0 0 0.75rem;
        color: var(--ks-content-primary);
    }

    .thanks-title {
        font-size: $font-size-lg;
        font-weight: 600;
        margin: 0 0 0.75rem;
        color: var(--ks-content-primary);
    }

    .cta-text {
        color: var(--ks-content-secondary);
        margin-bottom: 1.5rem;
    }

    .cta-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;

        .btn {
            flex: 1 1 auto;

            @include media-breakpoint-up(md) {
                flex: 0 0 auto;
            }
        }
    }

    .cta-form {
        label {
            display: block;
            margin-bottom: 0.25rem;
            font-size: $font-size-sm;
            color: var(--ks-content-secondary);
        }
    }

    .privacy-text {
        font-size: $font-size-xs;
        color: var(--ks-content-secondary);
        margin: 0;
    }
</style>
