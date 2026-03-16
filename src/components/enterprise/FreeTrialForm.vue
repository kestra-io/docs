<template>
    <section class="free-trial container-fluid">
        <div class="row">
            <div class="col-lg-6 column left-column">
                <div class="form-container">
                    <h2 class="form-title mb-6">
                        Request Access for a Free Trial of Kestra Enterprise Team Edition
                    </h2>

                    <div v-if="valid" v-html="validMessage" class="success" />
                    <form v-else ref="enterprise-form" novalidate @submit.prevent="onSubmit">
                        <div v-if="message" class="alert alert-danger">{{ message }}</div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstname">First Name <span class="required-field">*</span></label>
                                <input id="firstname" type="text" class="form-control" name="firstname" required />
                            </div>
                            <div class="form-group">
                                <label for="lastname">Last Name <span class="required-field">*</span></label>
                                <input id="lastname" type="text" class="form-control" name="lastname" required />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email">Company Mail <span class="required-field">*</span></label>
                            <input id="email" type="email" class="form-control" name="email" required />
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="company">Company <span class="required-field">*</span></label>
                                <input id="company" type="text" class="form-control" name="company" required />
                            </div>
                            <div class="form-group">
                                <label for="jobtitle">Job Title <span class="required-field">*</span></label>
                                <input id="jobtitle" type="text" class="form-control" name="jobtitle" required />
                            </div>
                        </div>

                        <div class="form-group">
                            <label>What's Your Use Case <span class="required-field">*</span></label>
                            <div class="radio-options">
                                <div v-for="(opt, i) in useCases" :key="opt.id" class="radio-option">
                                    <input
                                        :id="opt.id"
                                        type="radio"
                                        :value="opt.label"
                                        name="use_case"
                                        :checked="i === 0"
                                        required
                                    />
                                    <label :for="opt.id">{{ opt.label }}</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="country">Country <span class="required-field">*</span></label>
                            <select id="country" class="form-control" name="country" required>
                                <option
                                    v-for="c in countryList"
                                    :key="c.code"
                                    :value="c.name"
                                    :selected="c.name === 'France'"
                                >
                                    {{ c.name }}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="orchestration_needs">What are you automating ? (one sentence)</label>
                            <textarea
                                id="orchestration_needs"
                                class="form-control"
                                name="orchestration_needs"
                                rows="2"
                            />
                        </div>

                        <button
                            type="submit"
                            class="btn btn-primary w-100 mt-3"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <div class="col-lg-6 column right-column">
                <div class="right-content">
                    <p class="quote">
                        “We switched from Airflow because we want engineers solving problems, not coding orchestration. Kestra delivers end-to-end automation with the robustness we need at our scale. Few companies operate at this level, especially in AI/ML.”
                    </p>
                    <span class="attribution">Senior Engineering Manager @Apple</span>
                    <img :src="appleLogo.src" alt="Apple" class="company-logo" />
                </div>
                <img :src="freeTrialUi.src" alt="" class="img-fluid" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref, computed, useTemplateRef } from "vue"
    import axios from "axios"
    import { countries } from "countries-list"
    import { getHubspotTracking } from "~/utils/hubspot"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"
    import appleLogo from "~/assets/teams/apple.svg"
    import freeTrialUi from "~/components/enterprise/assets/free-trial-ui.webp"

    const props = defineProps<{ routePath: string }>()

    const useCases = [
        { id: "data-orchestration", label: "Data Orchestration" },
        { id: "it-orchestration", label: "IT/Infrastructure Orchestration" },
        { id: "bpo", label: "Business Process Orchestration" },
        { id: "ai-automation", label: "Automation with AI" },
    ]

    const countryList = computed(() =>
        Object.entries(countries)
            .map(([code, c]) => ({ code, name: c.name }))
            .sort((a, b) => a.name.localeCompare(b.name)),
    )

    const HUBSPOT_URL =
        "https://api.hsforms.com/submissions/v3/integration/submit/27220195/079db577-4a24-449d-bab1-a1034fc5b527"

    const gtm = useGtm()
    const formRef = useTemplateRef("enterprise-form")
    const valid = ref(false)
    const validMessage = ref("")
    const message = ref("")

    function field(objectTypeId: string, name: string, value: string | null) {
        return { objectTypeId, name, value }
    }

    async function onSubmit() {
        const form = formRef.value as HTMLFormElement
        const hsq = ((window as any)._hsq ??= [])

        if (!form.checkValidity()) {
            message.value = "Invalid form: Please review the fields."
            return
        }

        const { firstname, lastname, email, company, jobtitle, country, orchestration_needs } = form
        const kuid = localStorage.getItem("KUID")
        const useCaseRadio = form.querySelector('input[name="use_case"]:checked') as HTMLInputElement | null

        hsq.push(["identify", {
            email: email.value,
            firstname: firstname.value,
            lastname: lastname.value,
            company: company.value,
            jobtitle: jobtitle.value,
            country: country.value,
            kuid,
        }])

        const { data: ipData } = await axios.get("https://api.ipify.org?format=json")

        const formData = {
            fields: [
                field("0-1", "firstname", firstname.value),
                field("0-1", "lastname", lastname.value),
                field("0-1", "email", email.value),
                field("0-2", "name", company.value),
                field("0-1", "jobtitle", jobtitle.value),
                field("0-2", "vertical_selector", useCaseRadio?.value ?? ""),
                field("0-2", "countriesall", country.value),
                field("0-1", "orchestration_needs", orchestration_needs.value),
                field("0-1", "kuid", kuid),
                field("0-1", "form_submission_identifier", "Enterprise Free Trial Form"),
            ],
            context: {
                hutk: getHubspotTracking(),
                ipAddress: ipData.ip,
                pageUri: props.routePath,
                pageName: document.title,
            },
        }

        posthog.capture("enterprise_trial_form")
        hsq.push(["trackCustomBehavioralEvent", { name: "enterprise_trial_form" }])
        gtm?.trackEvent({ event: "enterprise_trial_form", noninteraction: false })
        identify(email.value)

        try {
            await axios.post(HUBSPOT_URL, formData)
            valid.value = true
            validMessage.value =
                "Thanks for your interest in Kestra Enterprise! We will get back to you as soon as possible! \ud83d\udc4d"
            window.scrollTo({ top: 0, behavior: "smooth" })
        } catch (error: any) {
            const isBlocked = error.response?.data?.errors?.some(
                (e: any) => e.errorType === "BLOCKED_EMAIL",
            )
            message.value = isBlocked
                ? "Please use a professional email address"
                : error.response?.data?.message ?? "Form submission error"
        }
    }
</script>

<style lang="scss" scoped>


    .free-trial {
        overflow-x: hidden;

        .column {
            background: var(--ks-background-body);
        }

        .left-column {
            display: flex;
            justify-content: center;
            padding: 4rem 2rem;

            .form-container {
                width: 100%;

                @include media-breakpoint-up(lg) {
                    max-width: 550px;
                }
            }
        }

        .right-column {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 5rem 0 5rem 32px;
            background: url('./assets/free-trial-bg.svg') center / cover no-repeat;

            @include media-breakpoint-up(xl) {
                padding-left: 80px;
            }

            .right-content {
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 622px;
                margin-left: 0.5rem;
                padding-left: 16px;
                border-left: 1px solid $white;

                .quote {
                    margin: 0;
                    font-size: $font-size-lg;
                    line-height: 1.5;
                    color: $white;
                }

                .attribution {
                    font-size: $font-size-sm;
                    color: #e1e1e1;
                }

                .company-logo {
                    width: 40px;
                    height: auto;
                    filter: brightness(0) invert(1);
                }
            }

            .img-fluid {
                width: 100%;
                height: auto;
                margin-top: $rem-4;
                align-self: flex-end;
            }
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;

            @media (max-width: 576px) {
                grid-template-columns: 1fr;
                gap: 0;
            }
        }

        .form-group {
            margin-bottom: 20px;

            label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                font-size: $font-size-sm;
                color: var(--ks-content-primary);
            }

            .required-field {
                color: var(--ks-content-alert-danger);
            }
        }

        .form-control {
            width: 100%;
            padding: 8px 12px;
            font-size: $font-size-sm;
            color: var(--ks-content-primary);
            background-color: var(--ks-background-input);
            border: 1px solid var(--ks-border-secondary);
            border-radius: 4px;
        }

        select.form-control {
            appearance: none;
            padding-right: 32px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M1.41 0L6 4.58 10.59 0 12 1.41l-6 6-6-6z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
        }

        .radio-options {
            display: flex;
            flex-direction: column;
            margin-top: 16px;
        }

        .radio-option {
            display: flex;
            align-items: center;
            margin-bottom: 8px;

            input[type="radio"] {
                appearance: none;
                width: 20px;
                height: 20px;
                margin-right: 12px;
                border: 2px solid var(--ks-border-secondary);
                border-radius: 50%;
                position: relative;
                cursor: pointer;
                flex-shrink: 0;

                &:checked {
                    border-color: var(--ks-content-link);

                    &::after {
                        content: "";
                        position: absolute;
                        inset: 3px;
                        border-radius: 50%;
                        background: var(--ks-content-link);
                    }
                }
            }

            label {
                cursor: pointer;
                font-size: $font-size-sm;
                line-height: 22px;
                margin-bottom: 0;
            }
        }

        .success {
            margin: 20px 0;
            padding: 20px;
            font-weight: 600;
            color: var(--ks-content-alert-success);
            background: var(--ks-background-alert-success);
            border: 1px solid var(--ks-border-alert-success);
            border-radius: $border-radius-lg;
            animation:
                successAppear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
                glowEffect 2s ease-in-out infinite;
        }

        .alert-danger {
            margin-bottom: 20px;
            padding: 10px 20px;
            font-weight: 600;
            color: var(--ks-content-alert-danger);
            background: var(--ks-background-alert-danger);
            border: 1px solid var(--ks-border-alert-danger);
            border-radius: $border-radius;
        }

        @keyframes successAppear {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes glowEffect {
            0%, 100% {
                box-shadow: 0 0 15px rgba(76, 175, 80, 0.1);
            }
            50% {
                box-shadow: 0 0 25px rgba(76, 175, 80, 0.2);
            }
        }
    }
</style>
