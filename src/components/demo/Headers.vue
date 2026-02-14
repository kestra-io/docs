<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-12 col-lg-6 d-flex">
                    <div class="schedule-demo">
                        <h1>
                            Let's Talk About <br />
                            <span>Orchestration</span>
                        </h1>
                        <p class="description">
                            Connect with our product specialists to explore Kestra Enterprise
                        </p>
                        <div class="cards d-none d-md-block">
                            <div v-for="card in cards" :key="card.title" class="card-item">
                                <div class="title-block">
                                    <img :src="card.img" :alt="card.alt" />
                                    <p class="title">
                                        {{ card.title }}
                                    </p>
                                </div>
                                <p class="description">
                                    {{ card.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-lg-6 align-items-center d-flex meeting-container">
                    <div v-if="valid === false" class="meeting-form">
                        <img
                            class="background d-none d-md-block"
                            :src="headerBackground.src"
                            aria-hidden="true"
                            data-usal="fade-r"
                        />
                        <form
                            class="row needs-validation"
                            ref="demo-form"
                            novalidate
                            data-usal="fade-l"
                            @submit="onSubmit"
                        >
                            <div v-if="message" class="alert alert-danger mt-3 mb-0">
                                {{ message }}
                            </div>

                            <div class="col-md-6 col-12">
                                <label for="demo-first-name" class="form-label mb-0">
                                    First name
                                </label>
                                <input
                                    id="demo-first-name"
                                    name="first-name"
                                    type="text"
                                    class="form-control"
                                    placeholder="First name"
                                    required
                                />
                            </div>

                            <div class="col-md-6 col-12">
                                <label for="demo-last-name" class="form-label mb-0">
                                    Last name
                                </label>
                                <input
                                    id="demo-last-name"
                                    name="last-name"
                                    type="text"
                                    class="form-control"
                                    placeholder="Last name"
                                    required
                                />
                            </div>

                            <div class="col-12">
                                <label for="demo-email" class="form-label mb-0">
                                    Company email
                                </label>
                                <input
                                    id="demo-email"
                                    name="email"
                                    type="email"
                                    class="form-control"
                                    placeholder="Company email"
                                    required
                                />
                            </div>

                            <div class="col-12 mt-3">
                                <small class="agree">
                                    By submitting this form, you agree to our
                                    <a target="_blank" href="/privacy-policy"> Privacy Policy. </a>
                                </small>
                            </div>

                            <div class="col-12 mt-4 d-flex justify-content-center">
                                <button type="submit" class="btn btn-primary w-100">
                                    Let's Talk
                                </button>
                            </div>
                        </form>
                    </div>

                    <div v-else class="custom-meetings-iframe-container embed-responsive">
                        <div class="iframe-wrapper">
                            <iframe
                                v-if="meetingUrl"
                                :src="meetingUrl"
                                class="embed-responsive-item"
                                style="
                                    min-height: 750px;
                                    min-width: 350px;
                                    border: none;
                                    width: 100%;
                                "
                                allowtransparency="true"
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="cards-below d-md-none mt-4">
                <div v-for="card in cards" :key="card.title" class="item">
                    <div class="title-block">
                        <img :src="card.img" :alt="card.alt" width="24" height="24" />
                        <p class="title">
                            {{ card.title }}
                        </p>
                    </div>
                    <span class="desc">
                        {{ card.description }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import posthog from "posthog-js"
    import axios from "axios"
    import { getHubspotTracking } from "~/utils/hubspot.js"
    import { getMeetingUrl } from "~/composables/useMeeting.js"
    import { useMediaQuery } from "@vueuse/core"
    import { ref, watch, useTemplateRef, onMounted, onUnmounted } from "vue"
    import identify from "~/utils/identify"
    import { useGtm } from "@gtm-support/vue-gtm"
    import scaleImg from "./assets/chart-areaspline.svg"
    import securityImg from "./assets/security.svg"
    import handshakeImg from "./assets/handshake.svg"
    import headerBackground from "../demo/assets/header-background.png"

    const gtm = useGtm()
    const formRef = useTemplateRef("demo-form")

    const props = defineProps<{
        routePath: string
    }>()

    const valid = ref(false)
    const message = ref("")
    const meetingUrl = ref<string>()
    const isMobile = useMediaQuery("(max-width: 767px)")

    const cards = ref([
        {
            img: scaleImg.src,
            alt: "Workflow scaling",
            title: "Scale Your Work",
            description:
                "Accelerate workflow creation and deployment with a platform designed for scale.",
        },
        {
            img: securityImg.src,
            alt: "Security and compliance",
            title: "Ensure Security and Compliance",
            description:
                "Protect your data with strong access controls and centralized secret management.",
        },
        {
            img: handshakeImg.src,
            alt: "Team collaboration",
            title: "Empower Your Team",
            description:
                "Make it easier for teams to collaborate and manage workflows across business-critical projects.",
        },
    ])

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
            if (firstname) url.searchParams.set("firstname", String(firstname).trim())
            if (lastname) url.searchParams.set("lastname", String(lastname).trim())
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

    watch(isMobile, (newValue) => {
        if (newValue) {
            document.body.classList.add("headers-body-bg")
        } else {
            document.body.classList.remove("headers-body-bg")
        }
    })

    onMounted(() => {
        if (isMobile.value) {
            document.body.classList.add("headers-body-bg")
        }

        if (getHubspotTracking() === null) {
            const base = getMeetingUrl()
            const current = new URLSearchParams(window.location.search)
            meetingUrl.value = withContactParams(base, {
                firstname: current.get("firstname"),
                lastname: current.get("lastname"),
                email: current.get("email"),
            })
            valid.value = true
        }
    })

    onUnmounted(() => {
        document.body.classList.remove("headers-body-bg")
    })

    const hubSpotUrl =
        "https://api.hsforms.com/submissions/v3/integration/submit/27220195/d8175470-14ee-454d-afc4-ce8065dee9f2"

    const onSubmit = async (e: Event) => {
        e.preventDefault()
        e.stopPropagation()

        const script = document.createElement("script")
        script.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
        script.defer = true
        document.body.appendChild(script)

        script.addEventListener(
            "load",
            async () => {
                const form = formRef.value
                const hsq = (window._hsq = window._hsq || [])

                if (!form?.checkValidity()) {
                    valid.value = false
                    message.value = "Please check the form fields and try again."
                    return
                }

                const fn = form["first-name"].value
                const ln = form["last-name"].value
                const em = form["email"].value

                hsq.push([
                    "identify",
                    {
                        email: em,
                        firstname: fn,
                        lastname: ln,
                        kuid: localStorage.getItem("KUID") || "",
                    },
                ])

                const ip = await axios.get("https://api.ipify.org?format=json")
                const formData = {
                    fields: [
                        { objectTypeId: "0-1", name: "email", value: em },
                        { objectTypeId: "0-1", name: "firstname", value: fn },
                        { objectTypeId: "0-1", name: "lastname", value: ln },
                        {
                            objectTypeId: "0-1",
                            name: "kuid",
                            value: localStorage.getItem("KUID") || "",
                        },
                    ],
                    context: {
                        hutk: getHubspotTracking() || undefined,
                        ipAddress: ip.data.ip,
                        pageUri: props.routePath,
                        pageName: document.title,
                    },
                }

                posthog.capture("bookdemo_form")
                hsq.push(["trackCustomBehavioralEvent", { name: "bookdemo_form" }])
                gtm?.trackEvent({
                    event: "bookdemo_form",
                    noninteraction: false,
                })
                // Guarded in case identify() isn't globally defined
                // eslint-disable-next-line no-undef
                if (typeof identify === "function") identify(em)

                axios
                    .post(hubSpotUrl, formData, {})
                    .then(async () => {
                        valid.value = true
                        hsq.push(["refreshPageHandlers"])
                        hsq.push(["trackPageView"])

                        meetingUrl.value = withContactParams(getMeetingUrl(), {
                            firstname: fn,
                            lastname: ln,
                            email: em,
                        })
                    })
                    .catch((error) => {
                        valid.value = false
                        if (
                            error?.response?.data?.errors?.some?.(
                                (e: any) => e.errorType === "BLOCKED_EMAIL",
                            )
                        ) {
                            message.value = "Please use a professional email address"
                        } else {
                            message.value =
                                error?.response?.data?.message ||
                                "It looks like we've hit a snag. Please ensure cookies are enabled and that any ad-blockers are disabled for this site, then try again."
                        }
                    })
            },
            { once: true },
        )
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container-fluid {
        color: var(--ks-content-primary);
        overflow: hidden;
        background: url("/landing/features/declarative/header-bg.svg") no-repeat;
        background-size: cover;
        margin-top: -80px;
        padding-top: 80px;
        .hero {
            padding: 1.5rem 20px;
            padding-bottom: 0;
            @include media-breakpoint-up(md) {
                padding-top: 4rem !important;
            }
            .schedule-demo {
                @include media-breakpoint-down(md) {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 12px;
                }
                @include media-breakpoint-up(lg) {
                    padding: 0 calc($spacer * 6.25) calc($spacer * 1.25) 0;
                }
                h1 {
                    margin-bottom: $spacer;
                    font-size: $font-size-4xl;
                    color: var(--ks-content-primary);
                }
                p.description {
                    font-size: 18.4px;
                    font-weight: 600;
                    color: var(--ks-content-secondary);
                }
                .cards {
                    margin-top: calc($spacer * 1.3);
                    display: flex;
                    flex-direction: column;
                    gap: calc($spacer * 2);
                    .card-item {
                        display: flex;
                        flex-direction: column;
                        gap: calc($spacer / 2);
                        margin-bottom: 2rem;
                        .title-block {
                            display: flex;
                            gap: calc($spacer / 2);
                            align-items: center;
                            img {
                                width: 42px;
                                height: 42px;
                            }
                            p.title {
                                margin: 0;
                                font-size: $font-size-xl;
                                font-weight: 600;
                                line-height: 2rem;
                                color: var(--ks-content-primary);
                            }
                        }
                        p.description {
                            font-size: $font-size-sm;
                            font-weight: 400;
                            line-height: 1.375rem;
                            color: var(--ks-content-secondary);
                            margin: 0;
                        }
                    }
                }
            }
            .cards-below {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                .item {
                    display: flex;
                    flex-direction: column;
                    gap: $spacer;
                    span {
                        font-size: 14px;
                        line-height: 22px;
                        font-weight: 400;
                        color: var(--ks-background-secondary);
                    }
                    .title-block {
                        display: inline-flex;
                        align-items: start;
                        gap: 8px;
                        img {
                            margin-top: 3px;
                        }
                        p.title {
                            margin: 0;
                            font-size: 18.4px;
                            line-height: 28px;
                            font-weight: 600;
                        }
                    }
                }
            }
            .meeting-form {
                display: flex;
                align-items: center;
                justify-content: center;
                img.background {
                    width: 644px;
                    max-width: 100%;
                    z-index: 0;
                    opacity: 0.2;
                }
                form {
                    border-radius: 0.25rem;
                    padding: 0rem 1rem 2rem 1rem;
                    position: absolute;
                    z-index: 1;
                    top: 25%;
                    width: 85%;
                    background: white;
                    @include media-breakpoint-up(lg) {
                        width: 75%;
                    }
                    @include media-breakpoint-down(md) {
                        position: relative;
                        top: auto;
                        width: 100%;
                        border-radius: 0.5rem;
                    }
                    .form-label {
                        opacity: 0;
                    }
                }
                @include media-breakpoint-down(md) {
                    margin: 2rem 0;
                    width: 100%;
                    .col-12 {
                        margin-bottom: -12px;
                    }
                }
            }
            .meeting-container {
                position: relative;
                @include media-breakpoint-up(md) {
                    padding: 0;
                    &::after,
                    &::before {
                        position: absolute;
                        content: "";
                        z-index: -2;
                        width: 30.6rem;
                        height: 15.6rem;
                        background: linear-gradient(180deg, #6218ff 0%, #6117ff 100%);
                        filter: blur(95px);
                    }
                    &::after {
                        right: 10rem;
                        bottom: 7.375rem;
                    }
                    &::before {
                        left: 16.3rem;
                        top: 4rem;
                    }
                }
                @include media-breakpoint-down(xxl) {
                    &::after,
                    &::before {
                        width: 10rem;
                        height: 10rem;
                    }
                    &::after {
                        right: 21rem;
                        bottom: 12.375rem;
                    }
                    &::before {
                        left: 21rem;
                    }
                }
                @include media-breakpoint-down(lg) {
                    &::after {
                        right: 12rem;
                    }
                    &::before {
                        left: 12rem;
                    }
                }
                @include media-breakpoint-down(md) {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .custom-meetings-iframe-container {
                    width: 100%;
                    position: relative;
                    @include media-breakpoint-down(md) {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    &::after,
                    &::before {
                        position: absolute;
                        content: "";
                        z-index: -2;
                        width: 15.6rem;
                        height: 24.6rem;
                        background: linear-gradient(180deg, #7021ff 0%, #6305bf 100%);
                        filter: blur(50px);
                    }
                    &::after {
                        left: 25.6rem;
                        bottom: 3.87rem;
                    }
                    &::before {
                        right: 22.875rem;
                        top: 1.625rem;
                    }
                    @include media-breakpoint-down(xxl) {
                        &::after {
                            left: 13.6rem;
                            bottom: 8.87rem;
                        }
                        &::before {
                            right: 12.875rem;
                        }
                    }
                    @include media-breakpoint-down(lg) {
                        &::after {
                            left: 7.6rem;
                        }
                        &::before {
                            right: 6.8rem;
                        }
                    }
                    @include media-breakpoint-down(md) {
                        .iframe-wrapper {
                            margin-bottom: -3.5rem;
                        }
                        &::after {
                            left: 6rem;
                        }
                        &::before {
                            right: 14rem;
                        }
                    }
                }
            }
        }
    }
</style>