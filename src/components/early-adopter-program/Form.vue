<template>
    <div class="form-wrapper">
        <div v-if="!submitted" class="access-form">
            <form
                class="row"
                ref="early-adopter-form"
                @submit.prevent="onSubmit"
                novalidate
            >
                <div v-if="message" class="col-12 alert-danger mb-4">
                    {{ message }}
                </div>

                <div class="col-md-6 mb-3">
                    <label for="firstname"
                        >First name <span class="required">*</span></label
                    >
                    <input
                        name="firstname"
                        type="text"
                        class="form-control"
                        id="firstname"
                        required
                    />
                </div>

                <div class="col-md-6 mb-3">
                    <label for="lastname"
                        >Last name <span class="required">*</span></label
                    >
                    <input
                        name="lastname"
                        type="text"
                        class="form-control"
                        id="lastname"
                        required
                    />
                </div>

                <div class="col-12 mb-3">
                    <label for="company">Company name</label>
                    <input
                        name="company"
                        type="text"
                        class="form-control"
                        id="company"
                    />
                </div>

                <div class="col-12 mb-3">
                    <label for="email"
                        >Company email <span class="required">*</span></label
                    >
                    <input
                        name="email"
                        type="email"
                        class="form-control"
                        id="email"
                        required
                    />
                </div>

                <div class="col-12 mb-3">
                    <label for="experience_with_kestra"
                        >Experience with Kestra
                        <span class="required">*</span></label
                    >
                    <select
                        name="experience_with_kestra"
                        class="form-select"
                        id="experience_with_kestra"
                        required
                    >
                        <option value="" selected disabled>
                            Select an option
                        </option>
                        <option value="beginner__new_to_kestra_exploring_or_evaluating">
                            Beginner - new to Kestra, exploring or evaluating
                        </option>
                        <option value="intermediate__comfortable_building_flows">
                            Intermediate - comfortable building flows
                        </option>
                        <option value="expert__run_kestra_regularly_and_know_it_well">
                            Expert - run Kestra regularly and know it well
                        </option>
                    </select>
                </div>

                <div class="col-12 mb-3">
                    <label for="currently_using_kestra_in_production"
                        >Does your company currently use Kestra in production?
                        <span class="required">*</span></label
                    >
                    <select
                        name="currently_using_kestra_in_production"
                        class="form-select"
                        id="currently_using_kestra_in_production"
                        required
                    >
                        <option value="" selected disabled>
                            Select an option
                        </option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                        <option value="planning_to_deploy">
                            Planning to deploy
                        </option>
                        <option value="Don't Know">Don't Know</option>
                    </select>
                </div>

                <div class="col-12 mb-2">
                    <p class="privacy-text">
                        By submitting this form, you agree to our
                        <a target="_blank" href="/privacy-policy"
                            >Privacy Policy</a
                        >.
                    </p>
                </div>

                <div class="col-12">
                    <button
                        type="submit"
                        class="btn btn-primary w-100"
                        :disabled="submitting"
                    >
                        {{ submitting ? "Sending..." : "Join the Program" }}
                    </button>
                </div>
            </form>
        </div>

        <div v-else class="access-form success" data-usal="zoomin">
            <div class="badge">
                <CheckBoldIcon />
            </div>
            <h3>You're on the list!</h3>
            <p class="subtitle">
                Thanks for your interest in <strong>Kestra 2.0</strong>. <br>
                We'll review your request and confirm within a few business days.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, useTemplateRef } from "vue"
    import { useGtm } from "@gtm-support/vue-gtm"
    import posthog from "posthog-js"

    import CheckBoldIcon from "vue-material-design-icons/CheckBold.vue"

    import { getHubspotTracking } from "~/utils/hubspot"
    import { $fetch } from "~/utils/fetch"
    import identify from "~/utils/identify"

    const HUBSPOT_URL =
        "https://api-eu1.hsforms.com/submissions/v3/integration/submit/27220195/a75dff2b-9d18-46fc-8d94-16815b4e3898"

    const gtm = useGtm()
    const formRef = useTemplateRef<HTMLFormElement>("early-adopter-form")

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
            const formDataObj = new FormData(form)
            const email = formDataObj.get("email") as string
            const firstname = formDataObj.get("firstname") as string
            const lastname = formDataObj.get("lastname") as string
            const company = formDataObj.get("company") as string
            const experience = formDataObj.get(
                "experience_with_kestra",
            ) as string
            const usage = formDataObj.get(
                "currently_using_kestra_in_production",
            ) as string
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
                    { name: "company", value: company },
                    { name: "email", value: email },
                    { name: "experience_with_kestra", value: experience },
                    {
                        name: "currently_using_kestra_in_production",
                        value: usage,
                    },
                    {
                        name: "form_submission_identifier",
                        value: "Kestra 2.0 Early Adopter Program",
                    },
                    { name: "kuid", value: kuid },
                ],
                context: {
                    hutk: getHubspotTracking() || undefined,
                    ipAddress: ip,
                    pageUri: "early-adopter-program",
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

            posthog.capture("early_adopter_form")
            hsq.push([
                "trackCustomBehavioralEvent",
                { name: "early_adopter_form" },
            ])
            gtm?.trackEvent({
                event: "early_adopter_form",
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
    .form-wrapper {
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

        .access-form {
            width: 100%;
            padding: 2rem;
            @include media-breakpoint-up(lg) {
                max-width: 633px;
                max-height: fit-content;
                padding: 2.5rem $rem-3;
            }
            background: var(--ks-background-primary);
            border-radius: $border-radius-lg;
            border: 1px solid var(--ks-border-secondary);
            position: relative;
            z-index: 1;

            &.success {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: $rem-1;
                padding-top: $rem-3;
                padding-bottom: $rem-3;
                text-align: center;

                .badge {
                    display: grid;
                    place-items: center;
                    width: $rem-4;
                    height: $rem-4;
                    font-size: 1.75rem;
                    color: $white;
                    border-radius: 50%;
                    background: linear-gradient(
                        180deg,
                        #8465ff 0%,
                        #631bff 100%
                        );
                    box-shadow: 0 0.5rem 2rem rgba(132, 101, 255, 0.5);

                    :deep(.material-design-icon),
                    :deep(svg) {
                        display: block;
                    }
                }

                h3,
                .subtitle {
                    margin: 0;
                }

                .subtitle {
                    color: var(--ks-content-secondary);
                }
            }

            .alert-danger {
                color: var(--ks-content-alert-danger);
                font-weight: 700;
            }

            label {
                display: block;
                font-size: $font-size-md;
                margin-bottom: 0.5rem;

                .required {
                    color: #E36065;
                }
            }

            .form-control,
            .form-select {
                border: 1px solid var(--ks-border-secondary);
                padding: 0.75rem $rem-1;
                background: var(--ks-background-input);
                color: var(--ks-content-primary);
                font-size: $font-size-sm;
                border-radius: 4px;

                &:focus {
                    border-color: var(--ks-border-active);
                    box-shadow: 0 0 0 0.15rem var(--ks-shadows-light);
                    outline: none;
                }

                &::placeholder {
                    color: var(--ks-content-tertiary);
                }
            }

            .form-select:invalid {
                color: var(--ks-content-tertiary);
            }

            .privacy-text {
                color: var(--ks-content-primary);
                font-size: $font-size-sm;

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
    }
</style>