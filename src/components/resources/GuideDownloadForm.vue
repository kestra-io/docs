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
                    <input
                        :id="`${uid}-${field.name}`"
                        :name="field.name"
                        :type="field.name === 'email' ? 'email' : 'text'"
                        class="form-control"
                        required
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
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, useId, useTemplateRef } from "vue"
    import posthog from "posthog-js"
    import { useGtm } from "@gtm-support/vue-gtm"
    import identify from "~/utils/identify"
    import { getHubspotTracking, submitHubspotForm } from "~/utils/hubspot"
    import { $fetch } from "~/utils/fetch"

    /** Defaults are the guide download; without `guideUrl` it is a plain
     *  request with no download link after submit. */
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
        }>(),
        {
            guideUrl: undefined,
            title: "Download the Free Guide",
            submitLabel: "Download the guide",
            thankYouTitle: "Thanks — your guide is ready.",
            thankYouText:
                "A copy is on its way to your inbox. You can also download it directly below.",
        },
    )

    const FIELDS = [
        { name: "firstname", label: "First name", half: true },
        { name: "lastname", label: "Last name", half: true },
        { name: "email", label: "Company email" },
        { name: "jobtitle", label: "Job title" },
    ]

    const gtm = useGtm()
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
            const { email, firstname, lastname, jobtitle } = Object.fromEntries(
                new FormData(form),
            ) as Record<string, string>
            const kuid = localStorage.getItem("KUID") || ""

            const hsq = (window._hsq ??= [])
            hsq.push([
                "identify",
                { email, firstname, lastname, jobtitle, kuid },
            ])

            // The IP only enriches the HubSpot context; a blocked lookup must
            // not stop the submission.
            const ip = await $fetch<{ ip: string }>(
                "https://api.ipify.org?format=json",
            )
                .then((res) => res.ip)
                .catch(() => undefined)

            const fields = {
                firstname,
                lastname,
                email,
                jobtitle,
                form_submission_identifier: props.submissionIdentifier,
                kuid,
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
            gtm?.trackEvent({
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
</style>
