<template>
    <div class="guide-form">
        <div v-if="!submitted" class="download-form">
            <h3 class="form-title">{{ title }}</h3>

            <form
                class="row"
                ref="download-form"
                @submit.prevent="onSubmit"
                novalidate
            >
                <div v-if="message" class="col-12 alert-danger mb-3">
                    {{ message }}
                </div>

                <div
                    v-for="field in FIELDS"
                    :key="field.name"
                    :class="[field.half ? 'col-md-6' : 'col-12', 'mb-2']"
                >
                    <label :for="`${uid}-${field.name}`">{{
                        field.label
                    }}</label>
                    <select
                        v-if="field.options"
                        :id="`${uid}-${field.name}`"
                        :name="field.name"
                        class="form-select form-control"
                        :required="!field.optional"
                    >
                        <option value="">Select...</option>
                        <option
                            v-for="option in field.options"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                    <input
                        v-else
                        :id="`${uid}-${field.name}`"
                        :name="field.name"
                        :type="field.type ?? (field.name === 'email' ? 'email' : 'text')"
                        class="form-control"
                        :required="!field.optional"
                    />
                </div>

                <div class="col-12 mt-2">
                    <button
                        type="submit"
                        class="btn btn-primary w-100"
                        :disabled="submitting"
                    >
                        {{ submitting ? "Sending..." : submitLabel }}
                    </button>
                </div>

                <div class="col-12 mt-3">
                    <p class="privacy-text">
                        By submitting this form, you agree to our
                        <a target="_blank" href="/privacy-policy"
                            >Privacy Policy</a
                        >.
                    </p>
                </div>
            </form>
        </div>

        <div v-else class="thank-you" data-usal="zoomin">
            <h3 class="title">{{ thankYouTitle }}</h3>
            <p v-if="thankYouText" class="text">
                {{ thankYouText }}
            </p>
            <a
                v-if="guideUrl"
                :href="guideUrl"
                target="_blank"
                rel="noopener"
                class="btn btn-primary w-100"
            >
                Download the guide
            </a>
            <button
                v-if="followUpHref"
                type="button"
                class="btn btn-secondary w-100 follow-up"
                @click="followUp"
            >
                {{ followUpLabel }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, useId, useTemplateRef } from "vue"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { getHubspotTracking, submitHubspotForm } from "~/utils/hubspot"
    import { $fetch } from "~/utils/fetch"
    import { getStoredClickId } from "~/scripts/gclid"

    /** Defaults are the guide download; without `guideUrl` it is a plain
     *  request with no download link after submit. */
    export type GuideFormField = {
        name: string
        label: string
        half?: boolean
        type?: "text" | "email" | "date"
        options?: { value: string; label: string }[]
        optional?: boolean
    }

    const props = withDefaults(
        defineProps<{
            hubspotFormId: string
            guideUrl?: string
            submissionIdentifier: string
            pageUri: string
            event: string
            title?: string
            submitLabel?: string
            thankYouTitle?: string
            thankYouText?: string
            withCompany?: boolean
            /** An in-page anchor offered after submit, e.g. the call form,
             *  so the download is not the end of the visit. */
            followUpHref?: string
            followUpLabel?: string
            extraFields?: GuideFormField[]
        }>(),
        {
            guideUrl: undefined,
            followUpHref: undefined,
            followUpLabel: "Book a 30-minute call",
            withCompany: false,
            extraFields: () => [],
            title: "Download the Free Guide",
            submitLabel: "Download the guide",
            thankYouTitle: "Thanks — your guide is ready.",
            thankYouText:
                "A copy is on its way to your inbox. You can also download it directly below.",
        },
    )

    const FIELDS: GuideFormField[] = [
        { name: "firstname", label: "First name", half: true },
        { name: "lastname", label: "Last name", half: true },
        { name: "email", label: "Company email" },
        ...(props.withCompany ? [{ name: "company", label: "Company" }] : []),
        { name: "jobtitle", label: "Job title" },
        ...props.extraFields,
    ]

    // Per-instance ids: a page can hold this form twice (a hero and a
    // dialog), and each label must point at its own input.
    const uid = useId()
    const formRef = useTemplateRef<HTMLFormElement>("download-form")

    const message = ref("")
    const submitted = ref(false)
    const submitting = ref(false)

    const onSubmit = async () => {
        const form = formRef.value
        if (!form || !form.checkValidity()) {
            message.value = "Please fill in all required fields correctly."
            return
        }

        submitting.value = true
        message.value = ""

        try {
            const values = Object.fromEntries(new FormData(form)) as Record<
                string,
                string
            >
            const { email, firstname, lastname, company, jobtitle } = values
            const kuid = localStorage.getItem("KUID") || ""

            const hsq = (window._hsq ??= [])
            hsq.push([
                "identify",
                { email, firstname, lastname, company, jobtitle, kuid },
            ])

            // The IP only enriches the HubSpot context; a blocked lookup must
            // not stop the submission.
            const ip = await $fetch<{ ip: string }>(
                "https://api.ipify.org?format=json",
            )
                .then((res) => res.ip)
                .catch(() => undefined)

            // Same Google Ads click id as the demo form, so HubSpot can tie a
            // guide lead back to its ad click for offline conversions.
            const clickId = getStoredClickId()
            const fields = {
                ...Object.fromEntries(
                    FIELDS.map(({ name }) => [name, values[name]]).filter(
                        ([, value]) => value,
                    ),
                ),
                form_submission_identifier: props.submissionIdentifier,
                kuid,
                ...(clickId ? { hs_google_click_id: clickId.value } : {}),
            }
            await submitHubspotForm(props.hubspotFormId, {
                fields: Object.entries(fields).map(([name, value]) => ({
                    objectTypeId: "0-1",
                    name,
                    value,
                })),
                context: {
                    hutk: getHubspotTracking() || undefined,
                    ipAddress: ip,
                    pageUri: props.pageUri,
                    pageName: document.title,
                },
            })

            posthog.capture(props.event)
            hsq.push(["trackCustomBehavioralEvent", { name: props.event }])
            // Straight to the data layer: the vue-gtm plugin is created with
            // `enabled: false`, so its trackEvent never reaches GTM.
            ;(window.dataLayer = window.dataLayer || []).push({
                event: props.event,
                noninteraction: false,
            })
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

    /** Closes the dialog the form sits in, then jumps to the anchor. */
    function followUp(event: MouseEvent) {
        ;(event.currentTarget as HTMLElement).closest("dialog")?.close()
        if (props.followUpHref) window.location.hash = props.followUpHref
    }
</script>

<style scoped lang="scss">
    .guide-form {
        width: 100%;
    }

    .download-form,
    .thank-you {
        width: 100%;
        padding: 2rem;
        background: var(--ks-background-primary);
        border-radius: $border-radius-lg;
        border: 1px solid var(--ks-border-secondary);
        position: relative;
        z-index: 1;

        @include media-breakpoint-up(md) {
            padding: 2.5rem;
        }
    }

    .form-title {
        font-size: $font-size-xl;
        font-weight: 600;
        margin: 0 0 1.5rem;
        color: var(--ks-content-primary);
    }

    form {
        label {
            display: block;
            font-size: $font-size-sm;
            margin-bottom: 0.375rem;
            color: var(--ks-content-primary);
        }

        .alert-danger {
            color: var(--ks-content-alert-danger);
            font-weight: 700;
            font-size: $font-size-sm;
        }

        .form-control {
            border: 1px solid var(--ks-border-secondary);
            padding: 0.625rem 0.875rem;
            background: var(--ks-background-input);
            color: var(--ks-content-primary);
            font-size: $font-size-sm;
            border-radius: 4px;

            &:focus {
                border-color: var(--ks-border-active);
                box-shadow: 0 0 0 0.15rem var(--ks-shadows-light);
                outline: none;
            }
        }

        .btn-primary {
            font-weight: 500;

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }

        .privacy-text {
            color: var(--ks-content-secondary);
            font-size: $font-size-xs;
            margin: 0;
            text-align: center;

            a {
                color: var(--ks-content-color-highlight);
                text-decoration: none;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .thank-you {
        text-align: center;

        .title {
            font-size: $font-size-xl;
            font-weight: 600;
            margin: 0 0 0.75rem;
            color: var(--ks-content-primary);
        }

        .text {
            color: var(--ks-content-secondary);
            font-size: $font-size-sm;
            margin: 0 0 1.5rem;
        }
    }

    .follow-up {
        margin-top: 0.5rem;
    }
</style>
