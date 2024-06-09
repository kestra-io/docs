<template>
    <div class="container-fluid hide-overflow">
        <div class="container pt-5 pb-5">
            <div class="row">
                <div class="col-md-6 d-flex flex-column justify-content-center">
                    <h2 data-aos="fade-left">Simple Yet <span>Powerful</span></h2>
                    <p data-aos="fade-right">
                        The declarative syntax in a YAML format significantly reduces the barrier to entry.
                        You can onboard new team members quickly, and maintain your workflows with minimal effort.
                        <br><br>
                        In just a few lines of YAML configuration, anyone in your team can build their first scheduled workflow.
                        With that first success, your team members can start automating more advanced use cases with confidence.
                    </p>
                </div>
                <div class="col-md-6">
                    <div class="code">
                        <div class="code-header">
                            <img src="/landing/3dot.svg" alt="code">
                        </div>
                        <div class="code-content">
                            <span>id:</span> hello_world<br />
                            <span>namespace:</span> dev<br />
                            <span>tasks:</span><br />
                            <div style="margin-left: 20px;">
                                <span>- id:</span> greeting<br />
                                <div style="margin-left: 20px;">
                                    <span>type:</span> io.kestra.plugin.core.log.Log<br />
                                    <span>message:</span> Hello from a declarative workflow!<br />
                                </div>
                            </div>
                            <span>triggers:</span><br />
                            <div style="margin-left: 20px;">
                                <span>- id:</span> schedule<br />
                                <div style="margin-left: 20px;">
                                    <span>type:</span> io.kestra.plugin.core.trigger.Schedule<br />
                                    <span>cron:</span> "@hourly"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col-12">
                    <div class="row card-group no-shadow mb-2">
                        <div class="col-md-4 mb-4">
                            <Card
                                :icon="CalculatorVariantOutline"
                                title="Faster Development Cycles"
                                description="Easily adapt workflows by updating your declarative configuration. No need for complex CI/CD pipelines."
                            />
                        </div>
                        <div class="col-md-4 mb-4">
                            <Card
                                :icon="Lan"
                                title="Reduced Complexity"
                                description="Simplifies your codebase by eliminating boilerplate code. No need to write code to deploy code — each Kestra flow includes everything it needs to run."
                            />
                        </div>
                        <div class="col-md-4 mb-4">
                            <Card
                                :icon="GoogleCirclesExtended"
                                title="Enhanced Collaboration"
                                description="Build workflows that are easy to read and understand for both technical and non-technical team members."
                            />
                        </div>
                    </div>

                    <div class="text-center">
                        <a href="https://demo.kestra.io/ui/login?auto" target="_blank" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">Live demo</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
    import Lan from "vue-material-design-icons/Lan.vue"
    import GoogleCirclesExtended from "vue-material-design-icons/GoogleCirclesExtended.vue"
    import CalculatorVariantOutline from "vue-material-design-icons/CalculatorVariantOutline.vue";
</script>

<script>
    import Section from '../../layout/Section.vue';
    import Card from '../../components/card/Card.vue';


    export default {
        components: {Section, Card}
    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container-fluid {
        position: relative;
        background: $black-1;

        h2 {
            color: $white;
            font-size: $h2-font-size;
            font-weight: 300;
            margin-bottom: 1.576rem;

            span {
                background: linear-gradient(90deg, #E151F7 2.16%, #5C47F5 65.09%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        p {
            color: $white;
            font-size: 1.125rem;
            font-weight: 300;
        }

        &:before {
            content: "";
            width: 100%;
            height: 100%;
            opacity: 1;
            position: absolute;
            top: 0;
            background: url("/landing/shadow3.svg") no-repeat center;

            @include media-breakpoint-down(md) {
                & {
                    display: none;
                }
            }
        }
    }


    .code {
        position: relative;
        overflow: hidden;
        border-radius: 0.5rem;

        .code-content {
            padding: 3rem 2rem 2rem 2rem;
            font-family: var(--bs-font-monospace);
            color: #E8A979;
            white-space: pre;

            span {
                color: #7FBC85;
            }

            @include media-breakpoint-down(xl) {
                font-size: $font-size-sm;
            }

            @include media-breakpoint-down(lg) {
                font-size: calc($font-size-base * 0.625);
            }

            @include media-breakpoint-down(md) {
                font-size: $font-size-sm;
            }

            @include media-breakpoint-down(sm) {
                font-size: calc($font-size-base * 0.563);
                padding: 2rem 1rem;
            }
        }

        .code-content, .code-header {
            --border-size: 1px;
            position: relative;
            z-index: 0;
            overflow: hidden;
            border: 0;

            &::before {
                content: '';
                position: absolute;
                z-index: -2;
                left: -50%;
                top: -300%;
                width: 200%;
                height: 700%;
                animation: rotate 6s linear infinite;
            }

            &::after {
                content: '';
                position: absolute;
                z-index: -1;
                left: 1px;
                top: 1px;
                width: calc(100% - 2px);
                height: calc(100% - 2px);
                background: #0A0113;
                border-radius: 0 0 0.5rem 0.5rem;
                transition: background-color 0.2s ease;
            }

            &::before {
                background: conic-gradient(#B010FB,
                    #DE97FF 10%,
                    #A227DB,
                    transparent 50%,
                    #A610EC);
            }
        }

        .code-header {
            padding: 0.75rem 1rem;
            background-color: #1B0F29;

            &::after {
                content: '';
                position: absolute;
                z-index: -1;
                left: 1px;
                top: 1px;
                width: calc(100% - 2px);
                height: calc(100% - 2px);
                background: #0A0113;
                border-radius: 0.5rem 0.5rem 0 0;
                transition: background-color 0.2s ease;
            }
        }

        .text-success {
            color: #2C3F3A !important;
        }
    }
</style>