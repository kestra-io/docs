<template>
    <div class="container">
        <div class="header">
            <div class="heading mx-auto pb-1 mt-5 pt-3 pb-4">
                <h3 class="title lh-base text-white text-center"><span class="title-animated">Scale</span>
                    as you grow</h3>
                <h3 class="desc text-white text-center">Get started with the Open Source edition of Kestra
                    and scale with Enterprise Edition exclusive features</h3>
            </div>
        </div>
        <!-- cards  -->
        <Section class="pt-0">
            <div class="row card-group mb-4">
                <div class="col-12 col-md-6 z-3 d-md-flex justify-content-md-end">
                    <div class="card text-white col-lg-9 col-xl-8">
                        <div class="card-body">
                            <div class="pb-4">
                                <h4 class="card-title" data-aos="fade-right">Open-Source</h4>
                                <p class="pricing" data-aos="fade-left">Free under Apache 2.O License</p>
                                <NuxtLink
                                    href="https://github.com/kestra-io/kestra"
                                    class="btn btn-animated btn-dark-animated w-100"
                                    data-aos="zoom-in"
                                >
                                    Get started
                                </NuxtLink>
                            </div>
                            <ul>
                                <li data-aos="fade-right" class="w-100"><span>Powerful orchestration engine</span></li>
                                <li data-aos="fade-right" data-aos-delay="50"><span>Declarative workflows as code and from
                                        the UI</span>
                                </li>
                                <li data-aos="fade-right" data-aos-delay="100"><span>Event-driven automations</span></li>
                                <li data-aos="fade-right" data-aos-delay="150"><span>Embedded code editor</span></li>
                                <li data-aos="fade-right" data-aos-delay="200"><span>Embedded documentation</span></li>
                                <li data-aos="fade-right" data-aos-delay="250"><span>Live-updating topology view</span></li>
                                <li data-aos="fade-right" data-aos-delay="300"><span>Access to 400+ plugins</span></li>
                                <li data-aos="fade-right" data-aos-delay="350"><span>Git & CI/CD integrations</span></li>
                                <li data-aos="fade-right" data-aos-delay="400"><span>Basic authentication</span></li>
                                <li data-aos="fade-right" data-aos-delay="450"><span>Community support</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 z-3 rightcard">
                    <div class="card-Demo text-white col-lg-9 col-xl-8 mt-3 mt-md-0">
                        <div class="card-body">
                            <div class="mb-7 gap-3">
                                <h3 class="card-title mb-5" data-aos="fade-right">Enterprise Edition</h3>

                                <NuxtLink
                                    class="d-block w-100 d-sm-inline-block mb-1 mn-sm-0 btn btn-animated btn-purple-animated"
                                    href="/demo">
                                    Talk to Us
                                </NuxtLink>
                            </div>
                            <ul>
                                <li data-aos="fade-left">
                                    <span>
                                        <strong>
                                            All features from the Open-Source Edition and
                                            more
                                        </strong>
                                    </span>
                                </li>
                                <ul>
                                    <p class="category-title">Security</p>
                                    <li data-aos="fade-left" data-aos-delay="300"><span>Audit logs</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>RBAC</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>SSO</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>Secrets Manager</span></li>
                                </ul>
                                <ul>
                                    <p class="category-title">Governance</p>
                                    <li data-aos="fade-left" data-aos-delay="300"><span>Multi Tenancy</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>Namespace Management</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>Custom blueprints</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>Task Configuration</span></li>
                                </ul>
                                <ul>
                                    <p class="category-title">Scalability</p>
                                    <li data-aos="fade-left" data-aos-delay="300"><span>Dedicated Worker</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>High Throughput</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>High Availability</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>Fault Tolerant</span></li>
                                </ul>
                                <ul>
                                    <p class="category-title">Services</p>
                                    <li data-aos="fade-left" data-aos-delay="300"><span>Customer Success Program</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>Support & Enterprise SLA</span></li>
                                    <li data-aos="fade-left" data-aos-delay="400"><span>Training & Roadmap</span></li>
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
import Section from '../layout/Section.vue';
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.container {
    .card-Demo {
        background-color: $black-2 !important;
        box-shadow: none;
        background: var(--Kestra-io-Token-color-background-secondary, $black-2);

        position: relative;
        $border: 1px;
        background: #000;
        background-clip: padding-box;
        border: solid $border transparent;
        border-radius: 8px;

        &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            margin: -$border;
            border-radius: inherit;
            background: linear-gradient(to right, #E151F7, #5C47F5);
        }

    }

    .card {
        background-color: $black-2 !important;
        border: $block-border !important;
        box-shadow: none;

    }

    .card-title {
        font-size: $font-size-xl;
        font-weight: 600;
        margin-bottom: 0;
        line-height: 2rem;
    }

    .pricing {
        color: #B9B9BA;
        font-weight: 400;
        font-size: $font-size-md;
        line-height: 2rem;
    }

    .custom {
        color: $primary;
    }

    .card-body {
        padding: calc($spacer * 2);
        ul {
            padding-top: $spacer;
            padding-left: 0px;

            .category-title {
                text-transform: uppercase;
                margin: 0;
                font-weight: 700;
                font-size: $font-size-base;
                line-height: calc($spacer * 2);
                margin-bottom: calc($spacer / 4);
            }

            li {
                padding: 0 0.1rem;
                list-style-image: url("public/landing/check.svg");
                list-style-position: inside;
                line-height: calc($spacer * 2);

                span {
                    position: relative;
                    top: -0.1rem;

                    strong {
                        font-weight: 400;
                        line-height: calc($spacer * 2);
                        font-size: $font-size-lg;
                    }
                }
            }
        }
    }

    .heading {
        max-width: 700px;
    }

    .header {
        max-width: full;
        background-image: url('/public/mask1.svg');
    }

    .card-group {

        z-index: 10;
        position: relative;

        &::after {
            content: "";
            position: absolute;
            top: -5%;
            right: 34%;
            width: 694.541px;
            background: linear-gradient(145deg, rgba(98, 24, 255, 0.00) 37.5%, #7D17FF 79.5%);
            filter: blur(100px);
            height: 382.203px;
            z-index: 0;
        }

        &::before {
            content: "";
            position: absolute;
            align-items: center;
            width: 2024px;
            height: 800px;
            background: url('/public/mask2.svg');
            top: 300px;
            opacity: 0.4;
            z-index: 0;
            border-radius: 50px;

        }
    }

    .title {
        font-weight: 400;
        font-size: $font-size-4xl;
        line-height: 3.75rem;

        &-animated {
            background: linear-gradient(90deg, #E151F7 57.52%, #5C47F5 92.48%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    .desc {
        font-size: $font-size-xl;
        font-weight: 300;
    }
}</style>