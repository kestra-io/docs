<script lang="ts" setup>
    /**
     * The /demo form (`components/demo/Meeting.vue`), restyled for the LP.
     *
     * Per the PR #5276 review (2026-08-06): exactly the same form as
     * kestra.io/demo — same fields (First name, Last name, Company email,
     * Number of employees), same HubSpot form GUID and payload, same "Let's
     * Talk" button, same native validation with a single alert, and the same
     * post-submit behaviour: the form swaps inline to the HubSpot Meetings
     * calendar routed by company-size tier. No redirect. Matching the payload
     * exactly also guarantees the HubSpot form definition accepts it — the
     * earlier Company/Team-size variant sent properties the form may not carry.
     *
     * Only differences from Meeting.vue, all invisible:
     * - DOM ids are instance-scoped (`idPrefix`) — the form renders twice per
     *   page (hero + final section) and duplicate ids would break labels/focus;
     * - the dataLayer additionally gets the pilot's `form_submit` event and
     *   `lp_variant` on both events (GTM must keep ONE conversion trigger —
     *   `form_submit` or `bookdemo_form` — or demos double-count);
     * - the PostHog `bookdemo_form` capture carries lp_variant + first-touch
     *   UTMs from `~/scripts/lp-attribution`;
     * - the gclid falls back to the sessionStorage attribution copy when
     *   localStorage is unavailable.
     */
    import { ref, useTemplateRef } from "vue"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { getHubspotTracking, submitHubspotForm } from "~/utils/hubspot"
    import { getStoredClickId } from "~/scripts/gclid"
    import {
        getLpAttribution,
        getLpUtmProperties,
    } from "~/scripts/lp-attribution"
    import {
        ensureMeetingsScriptLoaded,
        getMeetingUrl,
        tierFromEmployees,
    } from "~/composables/useMeeting.js"
    import { $fetch } from "~/utils/fetch"

    const props = defineProps<{
        /** Variant slug — the `lp_variant` property on every event. */
        variant: string
        /** Instance prefix for DOM ids (form renders twice per page). */
        idPrefix?: string
    }>()

    const fid = (name: string) => `lp-${props.idPrefix ?? "form"}-${name}`

    /** Same live "Book a Demo" form as /demo (`demo/Meeting.vue`). */
    const hubSpotFormId = "d8175470-14ee-454d-afc4-ce8065dee9f2"

    const COMPANY_SIZE_OBJECT_TYPE_ID = "0-2"
    const COMPANY_SIZE_PROPERTY = "number_of_employees"

    const valid = ref(false)
    const message = ref("")
    const meetingUrl = ref<string>()
    const submitting = ref(false)
    const formRef = useTemplateRef<HTMLFormElement>("lp-demo-form")

    /** Guard so a retry after a server failure never double-counts a conversion. */
    let conversionReported = false

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

    const onSubmit = async (e: Event) => {
        e.preventDefault()
        e.stopPropagation()

        if (submitting.value) return

        const form = formRef.value
        const hsq = ((window as unknown as { _hsq: unknown[] })._hsq ||=
            []) as unknown[]

        if (!form?.checkValidity()) {
            valid.value = false
            message.value = "Please check the form fields and try again."
            return
        }

        submitting.value = true
        message.value = ""

        const fn = (form["first-name"] as HTMLInputElement).value
        const ln = (form["last-name"] as HTMLInputElement).value
        const em = (form["email"] as HTMLInputElement).value
        const emp = (form["employees"] as HTMLSelectElement).value
        const attribution = getLpAttribution()
        const clickId = getStoredClickId()
        const clickIdValue = clickId?.value ?? attribution.gclid ?? ""

        hsq.push([
            "identify",
            {
                email: em,
                firstname: fn,
                lastname: ln,
                kuid: localStorage.getItem("KUID") || "",
            },
        ])

        const ip = await $fetch<{ ip: string }>(
            "https://api.ipify.org?format=json",
        )
        const formData = {
            fields: [
                { objectTypeId: "0-1", name: "email", value: em },
                { objectTypeId: "0-1", name: "firstname", value: fn },
                { objectTypeId: "0-1", name: "lastname", value: ln },
                {
                    objectTypeId: COMPANY_SIZE_OBJECT_TYPE_ID,
                    name: COMPANY_SIZE_PROPERTY,
                    value: emp,
                },
                {
                    objectTypeId: "0-1",
                    name: "kuid",
                    value: localStorage.getItem("KUID") || "",
                },
                // Google Ads click id for offline conversion import — the
                // standard `hs_google_click_id` property, read natively by
                // HubSpot's Google Ads sync. Sent only when present.
                ...(clickIdValue
                    ? [
                          {
                              objectTypeId: "0-1",
                              name: "hs_google_click_id",
                              value: clickIdValue,
                          },
                      ]
                    : []),
            ],
            context: {
                hutk: getHubspotTracking() || undefined,
                ipAddress: ip.ip,
                pageUri: `/lp/${props.variant}`,
                pageName: document.title,
            },
        }

        try {
            await submitHubspotForm<{ inlineMessage?: string }>(
                hubSpotFormId,
                formData,
            )
        } catch (error: any) {
            submitting.value = false
            valid.value = false
            console.error("Error submitting form data to HubSpot", error)
            if (
                error?.response?.data?.errors?.some?.(
                    (err: any) => err.errorType === "BLOCKED_EMAIL",
                )
            ) {
                message.value = "Please use a professional email address"
            } else {
                message.value =
                    error?.response?.data?.message ||
                    "It looks like we've hit a snag. Please ensure cookies are enabled and that any ad-blockers are disabled for this site, then try again."
            }
            return
        }

        valid.value = true
        meetingUrl.value = withContactParams(
            getMeetingUrl(tierFromEmployees(emp)),
            {
                firstname: fn,
                lastname: ln,
                email: em,
            },
        )

        try {
            posthog.capture("bookdemo_form", {
                lp_variant: props.variant,
                company_size: emp,
                ...getLpUtmProperties(),
            })
            hsq.push(["trackCustomBehavioralEvent", { name: "bookdemo_form" }])
            // Push directly to the dataLayer: the vue-gtm plugin is initialized
            // with `enabled: false` (GTM loads after cookie consent), so
            // gtm.trackEvent() would never reach the dataLayer.
            window.dataLayer = window.dataLayer || []
            if (!conversionReported) {
                window.dataLayer.push({
                    event: "bookdemo_form",
                    noninteraction: false,
                    lp_variant: props.variant,
                })
                // The pilot's spec event — GTM must trigger on this OR on
                // bookdemo_form, not both, or the same demo counts twice.
                window.dataLayer.push({
                    event: "form_submit",
                    noninteraction: false,
                    lp_variant: props.variant,
                    company_size: emp,
                })
                conversionReported = true
            }
            if (typeof identify === "function") identify(em)
        } catch (analyticsError) {
            console.error("Demo form analytics error", analyticsError)
        }

        void ensureMeetingsScriptLoaded().then(() => {
            hsq.push(["refreshPageHandlers"])
            hsq.push(["trackPageView"])
        })
    }
</script>

<template>
    <div v-if="valid" class="lp-form__meeting">
        <iframe
            v-if="meetingUrl"
            :src="meetingUrl"
            title="Book a time for your demo"
            allowtransparency="true"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
    </div>
    <form
        v-else
        ref="lp-demo-form"
        class="lp-form"
        novalidate
        @submit="onSubmit"
    >
        <p v-if="message" class="lp-form__server-error" role="alert">
            {{ message }}
        </p>

        <div class="lp-form__names">
            <div class="lp-field">
                <label class="lp-visually-hidden" :for="fid('first-name')">
                    First name
                </label>
                <input
                    :id="fid('first-name')"
                    name="first-name"
                    autocomplete="given-name"
                    type="text"
                    class="lp-input"
                    placeholder="First name *"
                    required
                />
            </div>

            <div class="lp-field">
                <label class="lp-visually-hidden" :for="fid('last-name')">
                    Last name
                </label>
                <input
                    :id="fid('last-name')"
                    name="last-name"
                    autocomplete="family-name"
                    type="text"
                    class="lp-input"
                    placeholder="Last name *"
                    required
                />
            </div>
        </div>

        <div class="lp-field">
            <label class="lp-visually-hidden" :for="fid('email')">
                Company email
            </label>
            <input
                :id="fid('email')"
                name="email"
                type="email"
                autocomplete="email"
                class="lp-input"
                placeholder="Company email *"
                required
            />
        </div>

        <div class="lp-field">
            <label class="lp-visually-hidden" :for="fid('employees')">
                Number of employees
            </label>
            <select
                :id="fid('employees')"
                name="employees"
                class="lp-select"
                required
            >
                <option value="" disabled selected>
                    Number of employees *
                </option>
                <option value="below 100">below 100</option>
                <option value="between 100 and 999">between 100 and 999</option>
                <option value="1000+">1000+</option>
            </select>
        </div>

        <p class="lp-fineprint lp-form__agree">
            By submitting this form, you agree to our
            <a target="_blank" href="/privacy-policy">Privacy Policy.</a>
        </p>

        <button
            class="lp-btn lp-btn--primary lp-btn--block lp-form__submit"
            type="submit"
            :disabled="submitting"
        >
            Let's Talk
        </button>
    </form>
</template>

<style lang="scss" scoped>
    .lp-form {
        width: 100%;
    }

    .lp-form__names {
        display: grid;
        gap: 1.125rem;

        @include media-breakpoint-up(sm) {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
        }

        /* The grid gap spaces these two; neutralise the global
           `.lp-field + .lp-field` margin or Last name sits lower. */
        :deep(.lp-field + .lp-field) {
            margin-top: 0;
        }
    }

    .lp-form__names + .lp-field,
    .lp-field + .lp-field {
        margin-top: 1.125rem;
    }

    /* Placeholder-grey until an option is picked (matches /demo). */
    .lp-select:invalid {
        color: var(--ks-content-tertiary);
    }

    .lp-form__server-error {
        margin-bottom: 1rem;
        padding: 0.75rem 0.875rem;
        border: 1px solid var(--ks-border-alert-danger);
        border-radius: 0.5rem;
        background-color: var(--ks-background-alert-danger);
        color: var(--ks-content-alert-danger);
        font-size: 0.9375rem;
    }

    .lp-form__agree {
        margin-top: 1rem;
    }

    .lp-form__submit {
        margin-top: 1rem;
    }

    /* Post-submit inline calendar, as on /demo — no redirect. */
    .lp-form__meeting {
        width: 100%;

        iframe {
            display: block;
            width: 100%;
            min-height: 46.875rem; /* 750px, as /demo */
            border: none;
        }
    }
</style>
