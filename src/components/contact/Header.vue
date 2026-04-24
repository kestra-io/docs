<template>
    <div class="square container-fluid">
        <Squared>
            <div class="get-in-touch">
                <h1 data-usal="fade-r">Contact Us</h1>
                <p class="baseline" data-usal="fade-l">
                    If you have questions, inquiries, or feedback about Kestra,
                    we're looking to hear from you.
                </p>
            </div>
            <div class="row justify-content-center">
                <div class="form-container">
                    <div v-if="valid" v-html="validMessage" class="success" />
                    <form
                        v-else
                        ref="contact-form"
                        novalidate
                        @submit.prevent="onSubmit"
                    >
                        <div v-if="message" class="alert alert-danger">
                            {{ message }}
                        </div>

                        <div class="form-row">
                            <div
                                v-for="f in fields.slice(0, 2)"
                                :key="f.id"
                                class="form-group"
                            >
                                <label :for="f.id"
                                    >{{ f.label }}
                                    <span class="required-field">*</span></label
                                >
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
                            v-for="f in fields.slice(2)"
                            :key="f.id"
                            class="form-group"
                        >
                            <label :for="f.id">
                                {{ f.label }}
                                <span class="required-field">*</span>
                            </label>
                            <textarea
                                v-if="f.type === 'textarea'"
                                :id="f.id"
                                class="form-control"
                                :name="f.id"
                                rows="4"
                                required
                            />
                            <input
                                v-else
                                :id="f.id"
                                :type="f.type"
                                class="form-control"
                                :name="f.id"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            class="btn btn-primary mt-3 float-end px-6"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </Squared>
    </div>
</template>

<script setup lang="ts">
    import { ref, useTemplateRef } from "vue"
    import { getHubspotTracking } from "~/utils/hubspot"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"
    import { $fetch } from "~/utils/fetch"
    import Squared from "~/components/layout/Squared.vue"

    const props = defineProps<{ routePath: string }>()

    const HUBSPOT_URL =
        "https://api.hsforms.com/submissions/v3/integration/submit/27220195/77f32ae3-0f49-404a-a28d-6dfe92c8bc78"

    const gtm = useGtm()
    const formRef = useTemplateRef("contact-form")
    const valid = ref(false)
    const validMessage = ref("")
    const message = ref("")

    const fields = [
        {
            id: "firstname",
            label: "First Name",
            type: "text",
        },
        {
            id: "lastname",
            label: "Last Name",
            type: "text",
        },
        {
            id: "company",
            label: "Company",
            type: "text",
        },
        {
            id: "email",
            label: "Email",
            type: "email",
        },
        {
            id: "message",
            label: "Message",
            type: "textarea",
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
            string
        >
        const kuid = localStorage.getItem("KUID")

        const hsq = ((window as any)._hsq ??= [])
        hsq.push([
            "identify",
            {
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                company: data.company,
                kuid,
            },
        ])
        hsq.push([
            "trackCustomBehavioralEvent",
            { name: "contact_form_submission" },
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
                    name: "kuid",
                    value: kuid,
                },
                {
                    objectTypeId: "0-1",
                    name: "form_submission_identifier",
                    value: "Contact Us Form",
                },
            ],
            context: {
                hutk: getHubspotTracking(),
                ipAddress: ipData.ip,
                pageUri: props.routePath || window.location.pathname,
                pageName: document.title,
            },
        }

        posthog.capture("contact_form_submission")
        gtm?.trackEvent({
            event: "contact_form_submission",
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
                "Thanks for reaching out! We will get back to you as soon as possible! \ud83d\udc4d"
            window.scrollTo({ top: 0, behavior: "smooth" })
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
    @import "../partners/style/form.scss";

    .square :deep(section.squared) {
        padding-bottom: 90px !important;
    }

    .get-in-touch {
        text-align: center;
        color: var(--ks-content-primary);
        margin-bottom: 3rem;

        .baseline {
            font-size: $font-size-lg;
            color: var(--ks-content-secondary);
        }
    }

    .form-container {
        width: 100%;
        max-width: 633px;
        padding: 2rem;
        background: var(--ks-background-primary);
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;

        @include media-breakpoint-down(sm) {
            padding: 1rem;
        }
    }

    .checkbox-option {
        margin-top: 1.5rem;
    }

    .privacy-note,
    .consent-note {
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);
        margin-top: 1rem;
        line-height: 1.5;

        a {
            color: var(--ks-content-link);
            text-decoration: underline;
        }
    }
</style>
