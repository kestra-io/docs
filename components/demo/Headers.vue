<template>
  <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="col-12 col-lg-6 d-flex">
                    <div class="schedule-demo">
                        <h1>Lets Talk About <br><span>Orchestration</span></h1>
                        <p class="description">Connect with our product specialists and evaluate Kestra Enterprise</p>
                        <div class="cards">
                            <div class="card-item">
                                <div class="title-block">
                                    <img src="/demo/chart-areaspline.svg" alt="Work">
                                    <p class="title">Scale Your Work</p>
                                </div>
                                <p class="description">
                                    Accelerate workflow creation and deployment with Kestra Enterprise's automation and seamless integration.
                                </p>
                            </div>
                            <div class="card-item">
                                <div class="title-block">
                                    <img src="/demo/security.svg" alt="Work">
                                    <p class="title">Ensure Security and Compliance</p>
                                </div>
                                <p class="description">
                                    Guarantee the safety and integrity of your data with high-security standards, precise access control, and centralized secret management.
                                </p>
                            </div>
                            <div class="card-item">
                                <div class="title-block">
                                    <img src="/demo/handshake.svg" alt="Work">
                                    <p class="title">Empower Your Team</p>
                                </div>
                                <p class="description">
                                    Enable better collaboration and efficient workflow management, ensuring your team can operate smoothly and effectively across all business critical projects.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-6 mt-5 mt-lg-0 align-items-center d-flex meeting-container">
                    <div v-if="valid === false" class="meeting-form">
                        <img src="/demo/header-background.png" alt="" data-aos="fade-right" />
                        <form class="row needs-validation" ref="demo-form" @submit="onSubmit" novalidate data-aos="fade-left">
                            <div v-if="message" class="alert alert-danger mt-3 mb-0">{{ message }}</div>
                            <div class="col-md-6 col-12">
                                <label for="demo-first-name" class="form-label">First name</label>
                                <input name="first-name" type="text" class="form-control" id="demo-first-name" placeholder="First name" required>
                            </div>

                            <div class="col-md-6 col-12">
                                <label for="demo-last-name" class="form-label">Last name</label>
                                <input name="last-name" type="text" class="form-control" id="demo-last-name" placeholder="Last name" required>
                            </div>

                            <div class="col-12">
                                <label for="demo-email">Company Email</label>
                                <input name="email" type="email" class="form-control" id="demo-email" placeholder="Company Email" required>
                            </div>

                            <div class="col-12 mt-3 d-flex justify-content-center">
                                <button type="submit" class="btn btn-primary">Schedule a demo with David</button>
                            </div>
                        </form>
                    </div>

                    <div v-else class="custom-meetings-iframe-container" data-src="https://hs.kestra.io/meetings/david76/website?embed=true"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import posthog from "posthog-js";
    import axios from "axios";
    import {getHubspotTracking} from "~/utils/hubspot.js";

    const route = useRoute();
    const gtm = useGtm();
    const formRef = useTemplateRef('demo-form');

    const valid = ref(false)
    const message = ref("")

    const hubSpotUrl = "https://api.hsforms.com/submissions/v3/integration/submit/27220195/d8175470-14ee-454d-afc4-ce8065dee9f2";


    const onSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const script = document.createElement("script");
        script.src = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
        script.setAttribute('defer','');
        document.body.appendChild(script);
        script.addEventListener("load", async () => {
            if (!window?.hbspt?.meetings) {
                message.value = "Failed to load the calendar, please send an email to hello@kestra.io please!"
                return;
            }

            const form = formRef.value;
            const hsq = (window._hsq = window._hsq || []);

            if (!form.checkValidity()) {
                valid.value = false;
                message.value = "Invalid form, please review the fields."
            } else {
                hsq.push(["identify", {
                    email: form['email'].value,
                    firstname: form['first-name'].value,
                    lastname: form['last-name'].value,
                    kuid: localStorage.getItem("KUID"),
                }]);

                let ip = await axios.get("https://api.ipify.org?format=json");
                const formData = {
                    fields: [
                        {
                            objectTypeId: "0-1",
                            name: "email",
                            value: form['email'].value
                        },
                        {
                            objectTypeId: "0-1",
                            name: "firstname",
                            value: form['first-name'].value
                        },
                        {
                            objectTypeId: "0-1",
                            name: "lastname",
                            value: form['last-name'].value
                        },
                        {
                            objectTypeId: "0-1",
                            name: "kuid",
                            value: localStorage.getItem("KUID")
                        }
                    ],
                    context: {
                        hutk: getHubspotTracking(),
                        ipAddress: ip.data.ip,
                        pageUri: route.path,
                        pageName: document.title
                    }
                }

                posthog.capture("bookdemo_form");
                hsq.push(['trackCustomBehavioralEvent', {name: 'bookdemo_form'}]);

                gtm?.trackEvent({
                    event: "bookdemo_form",
                    noninteraction: false,
                })

                identify(form['email'].value);

                axios.post(hubSpotUrl, formData, {})
                    .then(() => {
                        valid.value = true;

                        // we have some delay "it seems" between the form submission or maybe since we not reloading the page
                        hsq.push(['refreshPageHandlers'])
                        hsq.push(['trackPageView']);

                        window.setTimeout(() => {
                            window.hbspt.meetings.create(".custom-meetings-iframe-container")
                        }, 250);
                    })
                    .catch((error) => {
                        valid.value = false;
                        if (error.response.data.errors.filter(e => e.errorType === "BLOCKED_EMAIL").length > 0) {
                            message.value = "Please use a professional email address";
                        } else {
                            message.value = error.response.data.message
                        }
                    })
            }
        });


    }

</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.container-fluid {
    color: var(--bs-white);
    overflow: hidden;
    background: url('/landing/features/declarative/header-bg.svg') no-repeat;
    background-size: cover;
    color: var(--bs-white);
    margin-top: -80px;
    padding-top: 80px;

    .hero {
        padding-top: 4rem !important;
        padding-bottom: 0;
        .schedule-demo {
            color: $white;

            @include media-breakpoint-up(lg) {
                padding: 0 calc($spacer * 6.25) calc($spacer * 1.25) 0;
            }

            h1 {
                margin-bottom: $spacer;
                font-size: $font-size-4xl;
                font-weight: 300;

                span {
                    background: var(--Text_gradient, linear-gradient(90deg, #E151F7 2.16%, #5C47F5 65.09%));
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }
            p.description {
                font-size: $font-size-xl;
                font-weight: 300;
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
                        }
                    }

                    p.description {
                        font-size: $font-size-sm;
                        font-weight: 400;
                        line-height: 1.375rem;
                        color: $white-1;
                        margin: 0;
                    }
                }
            }
        }

        .meeting-form {
            display: flex;
            align-items: center;
            justify-content: center;

            img {
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
                background: white;
            }
        }

        .meeting-container {
            position: relative;

            @include media-breakpoint-up(lg) {
                padding: calc($spacer * 1.25) calc($spacer * 0.5);
            }

            &::after, &::before {
                position: absolute;
                content: "";
                z-index: -2;
                width: 30.6rem;
                height: 15.6rem;
                background: linear-gradient(180deg, #6218FF 0%, #6117FF 100%);
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


            @include media-breakpoint-down(xxl) {
                &::after, &::before {
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
                &::after {
                    right: 24rem;
                }

                &::before {
                    left: 24rem;
                }
            }

            .custom-meetings-iframe-container {
                width: 100%;
                position: relative;

                &::after, &::before {
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
