<script lang="ts" setup>
    /**
     * Google Ads LP demo form. Three fields, one CTA, native validation
     * messages replaced by the inline copy from the brief.
     *
     * Submission order is mandatory and must not be reshuffled:
     *   1. validate
     *   2. PostHog identify() + `demo_requested`  — before any navigation
     *   3. GA4 / Google Ads dataLayer events      — the primary conversion
     *   4. HubSpot Forms submit                   — the lead record
     *   5. redirect to /lp/<variant>/thanks
     *
     * Why that order matters: steps 2–3 must have left the tab before step 5
     * navigates away (a known past bug on this site was a fire-and-forget
     * identify() racing a redirect). Step 4 is an awaited network round-trip
     * that sits between them, which is the real guarantee — plus an explicit
     * bounded flush in `flushAnalytics()`.
     */
    import { ref } from "vue"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { getHubspotTracking, submitHubspotForm } from "~/utils/hubspot"
    import { getStoredClickId } from "~/scripts/gclid"
    import {
        getLpAttribution,
        getLpUtmProperties,
    } from "~/scripts/lp-attribution"
    import { LP_SHARED, LP_TEAM_SIZES } from "~/contents/lp/shared"

    const props = defineProps<{
        /** Variant slug — also the `lp_variant` property on every event. */
        variant: string
    }>()

    const copy = LP_SHARED.form

    /**
     * TODO(virgile): confirm the HubSpot form to use. This is the live
     * "Book a Demo" form (same GUID as `/demo`, see `demo/Meeting.vue`), chosen
     * so the LP works on day one and the leads land in the existing workflow.
     * Two things to verify before spending money on it:
     *   1. the form definition must accept `company` (a standard contact
     *      property, but the field has to exist on the form or the Forms API
     *      rejects the whole submission),
     *   2. free-mail domains must NOT be blocked on it — the pilot decision is
     *      to accept them and route downstream (HubSpot answers BLOCKED_EMAIL
     *      when its "blocked domains" setting is on; handled below).
     * A dedicated "Google Ads LP" form would also give clean per-source
     * reporting — swap the GUID here if one is created.
     */
    const HUBSPOT_FORM_ID = "d8175470-14ee-454d-afc4-ce8065dee9f2"

    const CONTACT = "0-1"
    const COMPANY = "0-2"

    const FREE_EMAIL_DOMAINS = new Set([
        "gmail.com",
        "googlemail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "live.com",
        "msn.com",
        "icloud.com",
        "me.com",
        "aol.com",
        "gmx.com",
        "proton.me",
        "protonmail.com",
        "yandex.com",
        "qq.com",
        "163.com",
    ])

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

    const email = ref("")
    const company = ref("")
    const teamSize = ref("")

    const errors = ref<{ email: string; company: string; teamSize: string }>({
        email: "",
        company: "",
        teamSize: "",
    })
    const serverError = ref("")
    const submitting = ref(false)

    /** Guard so a retry after a server failure never double-counts a conversion. */
    let conversionReported = false

    const validateEmail = () => {
        const value = email.value.trim()
        errors.value.email = !value
            ? copy.email.errorEmpty
            : !EMAIL_RE.test(value)
              ? copy.email.errorInvalid
              : ""
        return !errors.value.email
    }

    const validateCompany = () => {
        errors.value.company = company.value.trim()
            ? ""
            : copy.company.errorEmpty
        return !errors.value.company
    }

    const validateTeamSize = () => {
        errors.value.teamSize = teamSize.value ? "" : copy.teamSize.errorEmpty
        return !errors.value.teamSize
    }

    const focusFirstError = () => {
        const order: Array<[string, string]> = [
            ["email", "lp-email"],
            ["company", "lp-company"],
            ["teamSize", "lp-team-size"],
        ]
        for (const [key, id] of order) {
            if (errors.value[key as keyof typeof errors.value]) {
                document.getElementById(id)?.focus()
                return
            }
        }
    }

    /**
     * posthog-js batches events. `send_instantly` puts the request on the wire
     * now; `flush()` exists on recent versions, so use it when available and
     * otherwise fall back to a short bounded wait. Never longer than 400ms —
     * this sits in front of a user-visible redirect.
     */
    const flushAnalytics = async () => {
        try {
            const flush = (posthog as unknown as { flush?: () => void }).flush
            if (typeof flush === "function") flush.call(posthog)
        } catch {
            /* analytics must never block the lead */
        }
        await new Promise((resolve) => setTimeout(resolve, 150))
    }

    const onSubmit = async (event: Event) => {
        event.preventDefault()
        if (submitting.value) return

        serverError.value = ""

        const validEmail = validateEmail()
        const validCompany = validateCompany()
        const validTeamSize = validateTeamSize()

        if (!validEmail || !validCompany || !validTeamSize) {
            focusFirstError()
            return
        }

        submitting.value = true

        const emailValue = email.value.trim()
        const companyValue = company.value.trim()
        // Captured for downstream routing — free-mail leads are accepted, not
        // blocked (pilot decision), but sales needs to see them as such.
        const emailDomain = emailValue.split("@")[1]?.toLowerCase() ?? ""
        const teamSizeOption = LP_TEAM_SIZES.find(
            (option) => option.value === teamSize.value,
        )
        const attribution = getLpAttribution()
        const clickId = getStoredClickId()
        const clickIdValue = clickId?.value ?? attribution.gclid ?? ""

        // ---------------------------------------------- 2. PostHog ----------
        try {
            identify(emailValue)
            posthog.capture(
                "demo_requested",
                {
                    lp_variant: props.variant,
                    team_size: teamSize.value,
                    company: companyValue,
                    email_domain: emailDomain,
                    is_free_email: FREE_EMAIL_DOMAINS.has(emailDomain),
                    has_gclid: Boolean(clickIdValue),
                    ...getLpUtmProperties(),
                },
                { send_instantly: true },
            )
            await flushAnalytics()
        } catch (error) {
            console.error("LP form: PostHog step failed", error)
        }

        // ------------------------------------- 3. GA4 / Google Ads ----------
        try {
            window.dataLayer = window.dataLayer || []
            if (!conversionReported) {
                // Spec event for this pilot (needs its own GTM trigger).
                window.dataLayer.push({
                    event: "form_submit",
                    noninteraction: false,
                    lp_variant: props.variant,
                    team_size: teamSize.value,
                })
                // The event the live Google Ads "Book a Demo" conversion action
                // already triggers on (see GOOGLE-ADS-TRACKING-SOLUTION.md).
                // Pushed as well so the LP converts without waiting on a GTM
                // change — remove one of the two once GTM is reconfigured, or
                // the same demo is counted twice.
                window.dataLayer.push({
                    event: "bookdemo_form",
                    noninteraction: false,
                    lp_variant: props.variant,
                })
                conversionReported = true
            }
        } catch (error) {
            console.error("LP form: dataLayer step failed", error)
        }

        // -------------------------------------------- 4. HubSpot ------------
        const fields: Array<Record<string, unknown>> = [
            { objectTypeId: CONTACT, name: "email", value: emailValue },
            { objectTypeId: CONTACT, name: "company", value: companyValue },
            {
                objectTypeId: COMPANY,
                name: "number_of_employees",
                // Mapped to the property's allowed enum — see LP_TEAM_SIZES.
                value: teamSizeOption?.employees ?? "below 100",
            },
            {
                objectTypeId: CONTACT,
                name: "kuid",
                value: localStorage.getItem("KUID") || "",
            },
        ]

        if (clickIdValue) {
            // Standard HubSpot property read natively by its Google Ads
            // offline-conversion sync: this is what lets a *qualified* demo be
            // imported back against the original ad click.
            fields.push({
                objectTypeId: CONTACT,
                name: "hs_google_click_id",
                value: clickIdValue,
            })
        }

        // TODO(virgile): add these once the properties exist in HubSpot — they
        // are the difference between "a lead came from Google Ads" and "a lead
        // came from this ad group on this variant".
        //   { objectTypeId: CONTACT, name: "lp_variant", value: props.variant },
        //   { objectTypeId: CONTACT, name: "lp_team_size", value: teamSize.value },
        //   { objectTypeId: CONTACT, name: "utm_source", value: attribution.utm_source ?? "" },
        //   { objectTypeId: CONTACT, name: "utm_medium", value: attribution.utm_medium ?? "" },
        //   { objectTypeId: CONTACT, name: "utm_campaign", value: attribution.utm_campaign ?? "" },
        //   { objectTypeId: CONTACT, name: "utm_term", value: attribution.utm_term ?? "" },
        //   { objectTypeId: CONTACT, name: "utm_content", value: attribution.utm_content ?? "" },

        try {
            await submitHubspotForm(HUBSPOT_FORM_ID, {
                fields,
                context: {
                    hutk: getHubspotTracking() || undefined,
                    pageUri: window.location.href,
                    pageName: document.title,
                },
            })
        } catch (error: any) {
            submitting.value = false
            console.error("LP form: HubSpot submit failed", error)

            const hubspotErrors = error?.response?.data?.errors
            if (
                Array.isArray(hubspotErrors) &&
                hubspotErrors.some((e: any) => e?.errorType === "BLOCKED_EMAIL")
            ) {
                // Should not happen once free-mail blocking is off on the form.
                serverError.value = "Please use your work email address."
                return
            }

            serverError.value = copy.errorServer
            return
        }

        // ------------------------------------- 5. hand off to /thanks -------
        // Only what the confirmation page actually needs: the mapped size, to
        // route to the right calendar, and the variant, to label its analytics
        // event. Neither is personal data.
        //
        // The email is deliberately NOT stored. It would let the scheduler
        // prefill one field, at the cost of parking an address in clear text in
        // web storage (CodeQL `js/clear-text-storage-of-sensitive-data`) for a
        // convenience the visitor can cover by typing it once. Don't add it
        // back without deciding that trade explicitly. Passing it through the
        // URL instead is worse still — query strings leak into referrers, logs
        // and analytics.
        try {
            sessionStorage.setItem(
                "ka_lp_lead",
                JSON.stringify({
                    employees: teamSizeOption?.employees ?? "below 100",
                    variant: props.variant,
                }),
            )
        } catch {
            /* sessionStorage unavailable — /thanks falls back to the
               generic calendar, which still books a meeting */
        }

        window.location.assign(`/lp/${props.variant}/thanks`)
    }
</script>

<template>
    <form class="lp-form" novalidate @submit="onSubmit">
        <p v-if="serverError" class="lp-form__server-error" role="alert">
            {{ serverError }}
        </p>

        <div class="lp-field">
            <label class="lp-label" for="lp-email">{{
                copy.email.label
            }}</label>
            <input
                id="lp-email"
                v-model="email"
                class="lp-input"
                type="email"
                name="email"
                inputmode="email"
                autocomplete="email"
                :placeholder="copy.email.placeholder"
                :aria-invalid="Boolean(errors.email)"
                :aria-describedby="errors.email ? 'lp-email-error' : undefined"
                required
                @blur="validateEmail"
            />
            <p
                v-if="errors.email"
                id="lp-email-error"
                class="lp-error"
                role="alert"
            >
                {{ errors.email }}
            </p>
        </div>

        <div class="lp-field">
            <label class="lp-label" for="lp-company">
                {{ copy.company.label }}
            </label>
            <input
                id="lp-company"
                v-model="company"
                class="lp-input"
                type="text"
                name="company"
                autocomplete="organization"
                :placeholder="copy.company.placeholder"
                :aria-invalid="Boolean(errors.company)"
                :aria-describedby="
                    errors.company ? 'lp-company-error' : undefined
                "
                required
                @blur="validateCompany"
            />
            <p
                v-if="errors.company"
                id="lp-company-error"
                class="lp-error"
                role="alert"
            >
                {{ errors.company }}
            </p>
        </div>

        <div class="lp-field">
            <label class="lp-label" for="lp-team-size">
                {{ copy.teamSize.label }}
            </label>
            <select
                id="lp-team-size"
                v-model="teamSize"
                class="lp-select"
                name="team_size"
                :aria-invalid="Boolean(errors.teamSize)"
                :aria-describedby="
                    errors.teamSize ? 'lp-team-size-error' : undefined
                "
                required
                @change="validateTeamSize"
                @blur="validateTeamSize"
            >
                <option value="" disabled>
                    {{ copy.teamSize.placeholder }}
                </option>
                <option
                    v-for="option in LP_TEAM_SIZES"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.value }}
                </option>
            </select>
            <p
                v-if="errors.teamSize"
                id="lp-team-size-error"
                class="lp-error"
                role="alert"
            >
                {{ errors.teamSize }}
            </p>
        </div>

        <button
            class="lp-btn lp-btn--primary lp-btn--block lp-form__submit"
            type="submit"
            :disabled="submitting"
            data-lp-cta="form"
        >
            {{ submitting ? copy.submitting : copy.submit }}
        </button>

        <p class="lp-fineprint lp-form__reassurance">{{ copy.reassurance }}</p>
        <p class="lp-fineprint">
            By submitting, you agree to our
            <a href="/privacy-policy">Privacy Policy</a>.
        </p>
    </form>
</template>

<style lang="scss" scoped>
    .lp-form {
        width: 100%;
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

    .lp-form__submit {
        margin-top: 1.5rem;
    }

    .lp-form__reassurance {
        margin-top: 1rem;
    }
</style>
