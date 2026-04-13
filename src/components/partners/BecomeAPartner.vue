<template>
    <section id="form">
        <div class="container">
            <div class="header text-center mb-4">
                <div class="col-md-10 col-lg-7 mx-auto">
                    <h2 data-usal="fade-l">Become a Partner</h2>
                    <p>
                        If you are interested in becoming a Kestra partner,
                        please contact us with any questions.
                    </p>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-12 col-xl-8">
                    <div class="card">
                        <div class="card-body">
                            <div
                                v-if="valid"
                                v-html="validMessage"
                                class="success"
                            />
                            <form
                                v-else
                                ref="partner-form"
                                novalidate
                                @submit.prevent="onSubmit"
                            >
                                <div v-if="message" class="alert alert-danger">
                                    {{ message }}
                                </div>

                                <div class="form-group">
                                    <label :for="fields[0].id">
                                        {{ fields[0].label }}
                                        <span class="required-field">*</span>
                                    </label>
                                    <input
                                        :id="fields[0].id"
                                        type="text"
                                        class="form-control"
                                        :name="fields[0].id"
                                        required
                                    />
                                </div>

                                <div class="form-row">
                                    <div
                                        v-for="f in fields.slice(1, 3)"
                                        :key="f.id"
                                        class="form-group"
                                    >
                                        <label :for="f.id">
                                            {{ f.label }}
                                            <span class="required-field"
                                                >*</span
                                            >
                                        </label>
                                        <input
                                            :id="f.id"
                                            type="text"
                                            class="form-control"
                                            :name="f.id"
                                            required
                                        />
                                    </div>
                                </div>

                                <div
                                    v-for="f in fields.slice(3)"
                                    :key="f.id"
                                    class="form-group"
                                >
                                    <label :for="f.id">
                                        {{ f.label }}
                                        <span
                                            v-if="f.required"
                                            class="required-field"
                                            >*</span
                                        >
                                    </label>
                                    <textarea
                                        :id="f.id"
                                        class="form-control"
                                        :name="f.id"
                                        rows="4"
                                        :required="f.required"
                                    />
                                    <input
                                        v-else
                                        :id="f.id"
                                        :type="f.type"
                                        class="form-control"
                                        :name="f.id"
                                        :required="f.required"
                                    />
                                </div>

                                <div class="form-group">
                                    <label>
                                        Use Case
                                        <span class="required-field">*</span>
                                    </label>
                                    <div class="checkbox-options">
                                        <div
                                            v-for="opt in useCases"
                                            :key="opt.id"
                                            class="checkbox-option"
                                        >
                                            <input
                                                :id="opt.id"
                                                type="checkbox"
                                                :value="opt.label"
                                                name="use_case"
                                            />
                                            <label :for="opt.id">{{
                                                opt.label
                                            }}</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="privacy-policy mb-4">
                                    <p>
                                        Kestra is committed to protecting and
                                        respecting your privacy, and we’ll only
                                        use your personal information to
                                        administer your account and to provide
                                        the products and services you requested
                                        from us. From time to time, we would
                                        like to contact you about our products
                                        and services, as well as other content
                                        that may be of interest to you. If you
                                        consent to us contacting you for this
                                        purpose, please tick below to say how
                                        you would like us to contact you:
                                    </p>
                                    <div class="checkbox-option">
                                        <input
                                            id="consent"
                                            type="checkbox"
                                            name="consent"
                                            required
                                        />
                                        <label for="consent"
                                            >I agree to receive other
                                            communications from Kestra.</label
                                        >
                                    </div>
                                    <p class="mt-3">
                                        By clicking submit below, you consent to
                                        allow Kestra to store and process the
                                        personal information submitted above to
                                        provide you the content requested.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    class="btn btn-primary float-end px-5"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { ref, useTemplateRef } from "vue"
    import { getHubspotTracking } from "~/utils/hubspot"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"
    import { $fetch } from "~/utils/fetch"

    const props = defineProps<{ routePath: string }>()

    const useCases = [
        { id: "data-orchestration", label: "Data Orchestration" },
        { id: "it-orchestration", label: "IT & Infrastructure Orchestration" },
        { id: "bpo", label: "Business Process Orchestration" },
        { id: "event-driven", label: "Event Driven Orchestration" },
        { id: "ai-orchestration", label: "AI Orchestration" },
    ]

    const HUBSPOT_URL =
        "https://api.hsforms.com/submissions/v3/integration/submit/27220195/e044de55-bda2-4bb8-9e50-ed8c78b94922"

    const gtm = useGtm()
    const formRef = useTemplateRef("partner-form")
    const valid = ref(false)
    const validMessage = ref("")
    const message = ref("")

    const fields = [
        {
            id: "company",
            label: "Company name",
            type: "text",
            required: true,
        },
        {
            id: "firstname",
            label: "First name",
            type: "text",
            required: true,
        },
        {
            id: "lastname",
            label: "Last name",
            type: "text",
            required: true,
        },
        {
            id: "email",
            label: "Company Email",
            type: "email",
            required: true,
        },
        {
            id: "jobtitle",
            label: "Job title",
            type: "text",
            required: true,
        },
        {
            id: "orchestration_needs",
            label: "We're eager to know you better! Leave us a word about yourself :)",
            type: "textarea",
            required: false,
        },
    ]

    async function onSubmit() {
        const form = formRef.value as HTMLFormElement
        message.value = ""

        if (!form.checkValidity()) {
            form.reportValidity()
            message.value = "Invalid form: Please review the fields."
            return
        }

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries()) as Record<
            string,
            any
        >
        const kuid = localStorage.getItem("KUID")

        const checkedUseCases = Array.from(
            form.querySelectorAll('input[name="use_case"]:checked'),
        )
            .map((input: any) => input.value)
            .join("; ")

        const hsq = ((window as any)._hsq ??= [])
        hsq.push([
            "identify",
            {
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                company: data.company,
                jobtitle: data.jobtitle,
                kuid,
            },
        ])
        hsq.push([
            "trackCustomBehavioralEvent",
            { name: "partner_form_submission" },
        ])

        const ipData = await $fetch<{ ip: string }>(
            "https://api.ipify.org?format=json",
        )

        const hubspotData = {
            fields: [
                ...fields.map((f) => ({
                    objectTypeId: "0-1",
                    name: f.id,
                    value: data[f.id],
                })),
                {
                    objectTypeId: "0-1",
                    name: "use_case",
                    value: checkedUseCases,
                },
                {
                    objectTypeId: "0-1",
                    name: "kuid",
                    value: kuid,
                },
                {
                    objectTypeId: "0-1",
                    name: "form_submission_identifier",
                    value: "Become a Partner Form",
                },
            ],
            context: {
                hutk: getHubspotTracking(),
                ipAddress: ipData.ip,
                pageUri: props.routePath,
                pageName: document.title,
            },
        }

        posthog.capture("partner_form_submission")
        gtm?.trackEvent({
            event: "partner_form_submission",
            noninteraction: false,
        })
        identify(data.email)

        try {
            await $fetch(HUBSPOT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(hubspotData),
            })
            valid.value = true
            validMessage.value =
                "Thanks for your interest in becoming a Kestra Partner! We will get back to you soon! \ud83d\ude80"
            window.scrollTo({
                top: document.getElementById("form")?.offsetTop ?? 0,
                behavior: "smooth",
            })
        } catch (error: any) {
            const isBlocked = error.response?.data?.errors?.some(
                (e: any) => e.errorType === "BLOCKED_EMAIL",
            )
            message.value = isBlocked
                ? "Please use a professional email address"
                : (error.response?.data?.message ?? "Form submission error")
        }
    }
</script>
<style lang="scss" scoped>
    @import "./style/form.scss";

    section {
        background: var(--ks-background-body);
        padding: 4rem 1rem;
        color: var(--ks-content-primary);

        .card {
            background: var(--ks-background-body);
            padding: $rem-1;
            @include media-breakpoint-up(xl) {
                padding: $rem-2;
            }
            box-shadow: 2px 3px 16px 0px var(--ks-shadows-light);
            border: 1px solid var(--ks-border-secondary);
        }

        .privacy-policy {
            font-size: $font-size-sm;
            color: var(--ks-content-secondary);

            p {
                margin-bottom: 12px;
            }
        }
    }
</style>
e>
