<template>
    <div class="download-form-container">
        <div v-if="!submitted" class="download-form">
            <h3 class="form-title">Download the Free Guide</h3>

            <form
                class="row"
                ref="download-form"
                @submit.prevent="onSubmit"
                novalidate
            >
                <div v-if="message" class="col-12 alert-danger mb-3">
                    {{ message }}
                </div>

                <div class="col-md-6 mb-2">
                    <label for="firstname">First name</label>
                    <input
                        name="firstname"
                        type="text"
                        class="form-control"
                        id="firstname"
                        required
                    />
                </div>

                <div class="col-md-6 mb-2">
                    <label for="lastname">Last name</label>
                    <input
                        name="lastname"
                        type="text"
                        class="form-control"
                        id="lastname"
                        required
                    />
                </div>

                <div class="col-12 mb-2">
                    <label for="email">Company email</label>
                    <input
                        name="email"
                        type="email"
                        class="form-control"
                        id="email"
                        required
                    />
                </div>

                <div class="col-12 mb-2">
                    <label for="jobtitle">Job title</label>
                    <input
                        name="jobtitle"
                        type="text"
                        class="form-control"
                        id="jobtitle"
                        required
                    />
                </div>

                <div class="col-12 mt-2">
                    <button
                        type="submit"
                        class="btn btn-primary w-100"
                        :disabled="submitting"
                    >
                        {{ submitting ? "Sending..." : "Download the guide" }}
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
            <h3 class="thank-you-title">Thanks — your guide is ready.</h3>
            <p class="thank-you-text">
                A copy is on its way to your inbox. You can also download it
                directly below.
            </p>
            <a
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
    import { ref, useTemplateRef } from "vue"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"
    import { getHubspotTracking } from "~/utils/hubspot"
    import { $fetch } from "~/utils/fetch"

    const gtm = useGtm()
    const formRef = useTemplateRef<HTMLFormElement>("download-form")

    const message = ref("")
    const submitted = ref(false)
    const submitting = ref(false)

    const HUBSPOT_URL =
        "https://api.hsforms.com/submissions/v3/integration/submit/27220195/e1706097-e681-441a-8306-7e715e9daa9a"

    const guideUrl = "/airflow-2-eol-whitepaper.pdf"

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
            const jobtitle = formDataObj.get("jobtitle") as string
            const kuid = localStorage.getItem("KUID") || ""

            const hsq = ((window as any)._hsq = (window as any)._hsq || [])
            hsq.push([
                "identify",
                { email, firstname, lastname, jobtitle, kuid },
            ])

            const { ip } = await $fetch<{ ip: string }>(
                "https://api.ipify.org?format=json",
            )

            const payload = {
                fields: [
                    { objectTypeId: "0-1", name: "firstname", value: firstname },
                    { objectTypeId: "0-1", name: "lastname", value: lastname },
                    { objectTypeId: "0-1", name: "email", value: email },
                    { objectTypeId: "0-1", name: "jobtitle", value: jobtitle },
                    {
                        objectTypeId: "0-1",
                        name: "form_submission_identifier",
                        value: "Airflow 2 EOL Whitepaper",
                    },
                    { objectTypeId: "0-1", name: "kuid", value: kuid },
                ],
                context: {
                    hutk: getHubspotTracking() || undefined,
                    ipAddress: ip,
                    pageUri: "resources/airflow-2-eol-whitepaper",
                    pageName: document.title,
                },
            }

            await $fetch(HUBSPOT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            posthog.capture("airflow_2_eol_whitepaper_download")
            hsq.push([
                "trackCustomBehavioralEvent",
                { name: "airflow_2_eol_whitepaper_download" },
            ])
            gtm?.trackEvent({
                event: "airflow_2_eol_whitepaper_download",
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
    .download-form-container {
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
            width: 100%;

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

        .thank-you-title {
            font-size: $font-size-xl;
            font-weight: 600;
            margin: 0 0 0.75rem;
            color: var(--ks-content-primary);
        }

        .thank-you-text {
            color: var(--ks-content-secondary);
            font-size: $font-size-sm;
            margin: 0 0 1.5rem;
        }
    }
</style>
