<template>
    <section class="apply" id="form">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-xl-8">
                    <div class="card">
                        <div v-if="done" class="received" role="status">
                            <CheckCircleOutline class="icon" />
                            <h2>Application received</h2>
                            <p>Thanks {{ form.firstname }}. We will reach out to you within five business days.</p>
                            <a :href="trackHref" class="btn btn-secondary">Back to {{ trackLabel }}</a>
                        </div>

                        <form v-else novalidate @submit.prevent="next">
                            <ol class="steps" aria-label="Application steps">
                                <li
                                    v-for="(label, i) in STEPS"
                                    :key="label"
                                    :class="{ active: step === i, done: step > i }"
                                    :aria-current="step === i ? 'step' : undefined"
                                >
                                    <span class="num">{{ i + 1 }}</span>
                                    <span class="label">{{ label }}</span>
                                </li>
                            </ol>

                            <div v-if="message" class="alert alert-danger">
                                {{ message }}
                            </div>

                            <fieldset v-show="step === 0" class="step-body">
                                <legend>What kind of partner are you?</legend>
                                <div class="choice-grid">
                                    <label
                                        v-for="t in TRACKS"
                                        :key="t.id"
                                        class="choice"
                                        :class="{ selected: form.track === t.id }"
                                    >
                                        <input
                                            type="radio"
                                            name="track"
                                            :value="t.id"
                                            v-model="form.track"
                                        />
                                        <strong>{{ t.title }}</strong>
                                        <span>{{ t.text }}</span>
                                    </label>
                                </div>

                                <div v-if="form.track" class="form-group">
                                    <span class="label">
                                        {{ form.track === "consulting" ? "Which describe you? Pick all that apply." : "What do you build? Pick all that apply." }}
                                        <span class="required-field">*</span>
                                    </span>
                                    <div class="checks">
                                        <label v-for="k in kinds" :key="k" class="check">
                                            <input type="checkbox" :value="k" v-model="form.kind" />
                                            {{ k }}
                                        </label>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset v-show="step === 1" class="step-body">
                                <legend>About your company</legend>
                                <div class="form-group">
                                    <label for="apply-company">Company name <span class="required-field">*</span></label>
                                    <input id="apply-company" v-model.trim="form.company" type="text" class="form-control" required />
                                </div>
                                <div class="form-group">
                                    <label for="apply-website">Website <span class="required-field">*</span></label>
                                    <input id="apply-website" v-model.trim="form.website" type="url" class="form-control" placeholder="https://" required />
                                </div>
                                <div class="form-group">
                                    <span class="label">
                                        {{ form.track === "consulting" ? "Regions you serve" : "Regions where your customers are" }}
                                        <span class="required-field">*</span>
                                    </span>
                                    <div class="checks">
                                        <label v-for="r in REGIONS" :key="r" class="check">
                                            <input type="checkbox" :value="r" v-model="form.regions" />
                                            {{ r }}
                                        </label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="apply-experience">
                                        {{ form.track === "consulting" ? "Your experience with Kestra" : "Where is the integration today?" }}
                                        <span class="required-field">*</span>
                                    </label>
                                    <select id="apply-experience" v-model="form.experience" class="form-control" required>
                                        <option value="" disabled>Select one</option>
                                        <option v-for="e in experiences" :key="e" :value="e">{{ e }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="apply-plan">
                                        {{ form.track === "consulting" ? "What do you want to do with Kestra?" : "What would the integration do?" }}
                                        <span class="required-field">*</span>
                                    </label>
                                    <textarea id="apply-plan" v-model.trim="form.plan" class="form-control" rows="4" :placeholder="form.track === 'consulting' ? 'Customers you have in mind, services you want to offer, migrations you run (VMware, Airflow, Control-M...)' : 'Which of your products, which Kestra tasks or triggers, who asked for it'" />
                                </div>
                            </fieldset>

                            <fieldset v-show="step === 2" class="step-body">
                                <legend>About you</legend>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="apply-firstname">First name <span class="required-field">*</span></label>
                                        <input id="apply-firstname" v-model.trim="form.firstname" type="text" class="form-control" required />
                                    </div>
                                    <div class="form-group">
                                        <label for="apply-lastname">Last name <span class="required-field">*</span></label>
                                        <input id="apply-lastname" v-model.trim="form.lastname" type="text" class="form-control" required />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="apply-email">Work email <span class="required-field">*</span></label>
                                    <input id="apply-email" v-model.trim="form.email" type="email" class="form-control" required />
                                </div>
                                <div class="form-group">
                                    <label for="apply-jobtitle">Job title <span class="required-field">*</span></label>
                                    <input id="apply-jobtitle" v-model.trim="form.jobtitle" type="text" class="form-control" required />
                                </div>
                                <div class="privacy-policy">
                                    <label class="check">
                                        <input id="apply-consent" type="checkbox" v-model="form.consent" />
                                        I agree to receive communications from Kestra about the partner program.
                                    </label>
                                    <p>
                                        By submitting, you consent to Kestra storing and processing this information to review your application. See the
                                        <a href="/privacy-policy" target="_blank">Privacy Policy</a>.
                                    </p>
                                </div>
                            </fieldset>

                            <div class="nav">
                                <button v-if="step > 0" type="button" class="btn btn-secondary" @click="back">Back</button>
                                <button type="submit" class="btn btn-primary" :disabled="submitting">
                                    {{ step < 2 ? "Continue" : submitting ? "Sending..." : "Submit application" }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, onMounted, reactive, ref, watch } from "vue"
    import CheckCircleOutline from "vue-material-design-icons/CheckCircleOutline.vue"
    import posthog from "posthog-js"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"
    import { getHubspotTracking, submitHubspotForm } from "~/utils/hubspot"
    import { $fetch } from "~/utils/fetch"

    type Track = "consulting" | "technology"

    const props = defineProps<{ routePath: string; initialTrack?: Track }>()

    const HUBSPOT_FORM_ID = "e044de55-bda2-4bb8-9e50-ed8c78b94922"
    const STEPS = ["Partner type", "Your company", "You"]
    const TRACKS = [
        {
            id: "consulting" as Track,
            title: "Consulting partner",
            text: "Consulting firm or systems integrator. You sell, implement and support Kestra for your customers.",
        },
        {
            id: "technology" as Track,
            title: "Technology partner",
            text: "Cloud, data or infrastructure platform. You ship an integration with Kestra and we list and launch it together.",
        },
    ]
    const KINDS: Record<Track, string[]> = {
        consulting: ["Consulting firm", "Systems integrator"],
        technology: ["Cloud provider", "Data platform", "Data integration", "Infrastructure or DevOps tool", "AI or model provider", "Other ISV"],
    }
    const EXPERIENCES: Record<Track, string[]> = {
        consulting: ["No Kestra project yet", "Evaluating Kestra for a customer", "Delivered at least one Kestra project", "Several customers running Kestra"],
        technology: ["Not started", "Prototype in progress", "Working plugin, not published", "Published and in use by customers"],
    }
    const REGIONS = ["Europe", "North America", "Latin America", "Asia-Pacific", "Middle East and Africa"]
    const HUBSPOT_VALUES: Record<string, string> = {
        "Consulting firm": "consulting",
        "Systems integrator": "integrator",
        "Cloud provider": "cloud",
        "Data platform": "data_platform",
        "Data integration": "data_integration",
        "Infrastructure or DevOps tool": "infrastructure",
        "AI or model provider": "ai",
        "Other ISV": "isv",
        "No Kestra project yet": "none",
        "Evaluating Kestra for a customer": "evaluating",
        "Delivered at least one Kestra project": "one_project",
        "Several customers running Kestra": "several_customers",
        "Not started": "not_started",
        "Prototype in progress": "prototype",
        "Working plugin, not published": "plugin_unpublished",
        "Published and in use by customers": "plugin_published",
        Europe: "europe",
        "North America": "north_america",
        "Latin America": "latam",
        "Asia-Pacific": "apac",
        "Middle East and Africa": "mea",
    }

    const gtm = useGtm()
    const step = ref(0)
    const message = ref("")
    const submitting = ref(false)
    const done = ref(false)

    const form = reactive({
        track: "" as Track | "",
        kind: [] as string[],
        company: "",
        website: "",
        regions: [] as string[],
        experience: "",
        plan: "",
        firstname: "",
        lastname: "",
        email: "",
        jobtitle: "",
        consent: false,
    })

    const kinds = computed(() => (form.track ? KINDS[form.track] : []))
    watch(() => form.track, () => { form.kind = [] })
    const experiences = computed(() => (form.track ? EXPERIENCES[form.track] : []))
    const trackLabel = computed(() => (form.track === "technology" ? "technology partners" : "consulting partners"))
    const trackHref = computed(() => (form.track === "technology" ? "/partners/technology" : "/partners/consulting"))

    onMounted(() => {
        const fromUrl = new URLSearchParams(window.location.search).get("track")
        const initial = props.initialTrack ?? (fromUrl === "consulting" || fromUrl === "technology" ? fromUrl : "")
        if (initial) form.track = initial
    })

    const validateStep = (): string => {
        if (step.value === 0) {
            if (!form.track) return "Choose the partner track that matches you."
            if (form.kind.length === 0) return "Pick at least one partner type."
        }
        if (step.value === 1) {
            if (!form.company || !form.website) return "Company name and website are required."
            if (!/^https?:\/\/\S+\.\S+/.test(form.website)) return "Enter the website as a full URL, starting with https://."
            if (form.regions.length === 0) return "Pick at least one region."
            if (!form.experience) return "Tell us where you are with Kestra."
            if (!form.plan) return "Tell us what you want to do with Kestra."
        }
        if (step.value === 2) {
            if (!form.firstname || !form.lastname || !form.jobtitle) return "Name and job title are required."
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Enter a valid work email."
        }
        return ""
    }

    const back = () => {
        message.value = ""
        step.value = Math.max(0, step.value - 1)
    }

    const next = async () => {
        message.value = validateStep()
        if (message.value) return
        if (step.value < 2) {
            step.value += 1
            return
        }
        await submit()
    }

    const submit = async () => {
        submitting.value = true
        try {
            const kuid = localStorage.getItem("KUID") ?? ""
            const hsq = ((window as any)._hsq ??= [])
            hsq.push(["identify", { email: form.email, firstname: form.firstname, lastname: form.lastname, company: form.company, jobtitle: form.jobtitle, kuid }])
            hsq.push(["trackCustomBehavioralEvent", { name: "partner_form_submission" }])

            const { ip } = await $fetch<{ ip: string }>("https://api.ipify.org?format=json")
            const contact = (name: string, value: string) => ({ objectTypeId: "0-1", name, value })
            const company = (name: string, value: string) => ({ objectTypeId: "0-2", name, value })
            await submitHubspotForm(HUBSPOT_FORM_ID, {
                fields: [
                    contact("company", form.company),
                    contact("firstname", form.firstname),
                    contact("lastname", form.lastname),
                    contact("email", form.email),
                    contact("jobtitle", form.jobtitle),
                    company("name", form.company),
                    company("website", form.website),
                    company("partner_track", form.track),
                    company("partner_type", form.kind.map((k) => HUBSPOT_VALUES[k]).join(";")),
                    company("partner_regions", form.regions.map((r) => HUBSPOT_VALUES[r]).join(";")),
                    company("partner_experience", HUBSPOT_VALUES[form.experience]),
                    company("partner_plan", form.plan),
                    company("partner_status", "Applied"),
                ],
                context: {
                    hutk: getHubspotTracking() || undefined,
                    ipAddress: ip,
                    pageUri: props.routePath,
                    pageName: document.title,
                },
            })

            posthog.capture("partner_form_submission", { track: form.track, kind: form.kind.join(", ") })
            gtm?.trackEvent({ event: "partner_form_submission", noninteraction: false })
            identify(form.email)
            done.value = true
        } catch (error: any) {
            const blocked = error?.response?.data?.errors?.some((e: any) => e.errorType === "BLOCKED_EMAIL")
            message.value = blocked
                ? "Please use a work email address."
                : error?.response?.data?.message || "Something went wrong. Please check your connection and try again."
        } finally {
            submitting.value = false
        }
    }
</script>

<style lang="scss" scoped>
    @import "./style/form.scss";

    .apply {
        background: var(--ks-background-body);
        padding: 2rem 1rem 5rem;
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
    }

    .steps {
        list-style: none;
        display: flex;
        gap: 0.5rem;
        padding: 0;
        margin: 0 0 1.5rem;

        li {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid var(--ks-border-secondary);
            color: var(--ks-content-tertiary);
            font-size: $font-size-sm;

            &.active {
                border-color: var(--ks-border-active);
                color: var(--ks-content-primary);
                font-weight: 600;
            }

            &.done {
                border-color: var(--ks-border-active);
                color: var(--ks-content-secondary);
            }
        }

        .num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            border: 1px solid currentColor;
            font-size: $font-size-xs;
            font-weight: 600;
        }

        @include media-breakpoint-down(md) {
            .label {
                display: none;
            }
        }
    }

    .step-body {
        border: 0;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        legend {
            font-size: $font-size-xl;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--ks-content-primary);
        }
    }

    .choice-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
    }

    .choice {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.25rem;
        border-radius: 8px;
        border: 1px solid var(--ks-border-secondary);
        background: var(--ks-background-primary);
        cursor: pointer;

        input {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }

        strong {
            font-size: $font-size-md;
            color: var(--ks-content-primary);
        }

        span {
            font-size: $font-size-sm;
            color: var(--ks-content-secondary);
        }

        &.selected {
            border-color: var(--ks-border-active);
            box-shadow: 0 0 0 0.15rem var(--ks-shadows-light);
        }

        &:focus-within {
            outline: 2px solid var(--ks-border-active);
            outline-offset: 2px;
        }
    }

    .label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--ks-content-primary);
    }

    .checks {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1.25rem;
    }

    .check {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: $font-size-sm;
        cursor: pointer;

        input {
            accent-color: var(--ks-border-active);
        }
    }

    .privacy-policy {
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        p {
            margin: 0;
        }

        a {
            color: var(--ks-content-link);
            text-decoration: underline;
        }
    }

    .nav {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        margin-top: 1.5rem;

        .btn-primary {
            margin-left: auto;
        }
    }

    .received {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.75rem;
        padding: 2rem 0;

        .icon {
            color: var(--ks-content-tag-success);
            font-size: 2.5rem;
        }

        h2 {
            margin: 0;
            color: var(--ks-content-primary);
        }

        p {
            margin: 0;
            max-width: 40ch;
            color: var(--ks-content-secondary);
        }

        .btn {
            margin-top: 0.75rem;
        }
    }
</style>
