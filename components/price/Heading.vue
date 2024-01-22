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
                        <div class="card-body p-5">
                            <div class="pb-4">
                                <h4 class="card-title" data-aos="fade-right">Open-Source</h4>
                                <p class="pricing" data-aos="fade-left">Free under Apache 2.O License</p>
                                <NuxtLink href="https://github.com/kestra-io/kestra"
                                    class="btn btn-secondary w-100 btnstart text-white" data-aos="zoom-in">
                                    Get started
                                </NuxtLink>
                            </div>
                            <ul>
                                <li data-aos="fade-right" class="w-100"><span>Powerful orchestration engine</span></li>
                                <li data-aos="fade-right" data-aos-delay="50"><span>Declarative workflows as code and from
                                        the UI</span>
                                </li>
                                <li data-aos="fade-right" data-aos-delay="100"><span>Event-driven automations</span></li>
                                <li data-aos="fade-right" data-aos-delay="150"><span>Embedded Visual Studio code
                                        editor</span></li>
                                <li data-aos="fade-right" data-aos-delay="200"><span>Embedded documentation</span></li>
                                <li data-aos="fade-right" data-aos-delay="250"><span>Live-updating topology view</span></li>
                                <li data-aos="fade-right" data-aos-delay="300"><span>Acess to 400+ plugins</span></li>
                                <li data-aos="fade-right" data-aos-delay="350"><span>Git & CI/CD integrations</span></li>
                                <li data-aos="fade-right" data-aos-delay="400"><span>Basic authentication</span></li>
                                <li data-aos="fade-right" data-aos-delay="450"><span>Community support</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 z-3 rightcard">
                    <div class="card-Demo text-white col-lg-9 col-xl-8 mt-3 mt-md-0">
                        <div class="card-body p-5">
                            <div class="mb-7 gap-3">
                                <h3 class="card-title mb-5" data-aos="fade-right">Enterprise Edition</h3>

                                <NuxtLink
                                    class="d-block w-100 d-sm-inline-block mb-1 mn-sm-0 btn btn-animated btn-purple-animated"
                                    href="https://kestra.io/demo">
                                    Talk to Us
                                </NuxtLink>
                            </div>
                            <ul>
                                <li data-aos="fade-left"><span><strong>All features from the Open-Source Edition and
                                            more</strong></span></li>
                                <li data-aos="fade-left" data-aos-delay="100"><span>Scalable architecture with
                                        High-Availability</span></li>
                                <li data-aos="fade-left" data-aos-delay="150"><span>Muti-tenancy</span></li>
                                <li data-aos="fade-left" data-aos-delay="200"><span>Worker groups supporting distributed
                                        workers</span></li>
                                <li data-aos="fade-left" data-aos-delay="250"><span>Custom secrets backend (AWS Secret
                                        Manager, Azure Key Vault, Elasticsearch, Google Secret Manager, Hashicorp
                                        Vault)</span>
                                </li>
                                <li data-aos="fade-left" data-aos-delay="300"><span>Audit logs</span></li>
                                <li data-aos="fade-left" data-aos-delay="350"><span>Single Sign-On (SSO)</span>
                                </li>
                                <li data-aos="fade-left" data-aos-delay="400"><span>Role-Based Access Control (RBAC)</span>
                                </li>
                                <li data-aos="fade-left" data-aos-delay="450"><span>Custom blueprints</span></li>
                                <li data-aos="fade-left" data-aos-delay="500"><span>Namespace-level management</span></li>
                                <li data-aos="fade-left" data-aos-delay="550"><span>Secure credential store</span></li>
                                <li data-aos="fade-left" data-aos-delay="550"><span>Built-in variable store</span></li>
                                <li data-aos="fade-left" data-aos-delay="550"><span>Centralized governance over task
                                        configuration</span></li>
                                <li data-aos="fade-left" data-aos-delay="550"><span>Enterprise support with guaranteed
                                        SLAs</span></li>
                                <li data-aos="fade-left" data-aos-delay="550"><span>Onboarding & training</span></li>
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

    .btnstart {
        background-color: $black-4;
        border: 1px solid $black-6;
    }

    .card-Demo {
        background-color: $black-2 !important;
        box-shadow: none;
        background: var(--Kestra-io-Token-color-background-secondary, #161617);

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
        border: 1px solid $black-3 !important;
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
        font-size: $font-size-mdsm;
        line-height: 2rem;
    }

    .custom {
        color: $primary;
    }

    .card-body {
        ul {
            padding-top: $spacer;
            padding-left: 0px;

            li {
                padding: 0.6rem 0.1rem;
                list-style-image: url("public/landing/check.svg");
                list-style-position: inside;


                span {
                    position: relative;
                    top: -0.1rem;
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
        font-weight: 600;
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