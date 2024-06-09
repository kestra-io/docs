<template>
    <div class="container">
        <Section
            subtitle="for Your Organization"
            subtitle-before="Advanced Functionality"
        >

            <div class="row card-group mb-4">
                <div class="col-12 col-md-6 d-md-flex justify-content-md-end">
                    <div class="card bg-dark-2 col-lg-9 col-xl-7">
                        <div class="card-body p-3 p-sm-5">
                            <h4 class="card-title" data-aos="fade-right">Open-Source Edition</h4>
                            <p class="type" data-aos="fade-left">Free</p>
                            <NuxtLink href="/pricing" class="btn btn-animated btn-dark-animated w-100" data-aos="zoom-in">
                                Get started
                            </NuxtLink>
                            <ul>
                                <li data-aos="fade-right">Apache 2.0 license</li>
                                <li data-aos="fade-right" data-aos-delay="100">Powerful orchestration engine</li>
                                <li data-aos="fade-right" data-aos-delay="150">Declarative workflows as code and from the UI</li>
                                <li data-aos="fade-right" data-aos-delay="200">Event-driven automations</li>
                                <li data-aos="fade-right" data-aos-delay="250">Embedded code editor</li>
                                <li data-aos="fade-right" data-aos-delay="300">Embedded documentation</li>
                                <li data-aos="fade-right" data-aos-delay="350">Live-updating topology view</li>
                                <li data-aos="fade-right" data-aos-delay="400">Access to 400+ plugins</li>
                                <li data-aos="fade-right" data-aos-delay="450">Git & CI/CD integrations</li>
                                <li data-aos="fade-right" data-aos-delay="500">Basic authentication</li>
                                <li data-aos="fade-right" data-aos-delay="550">Community support</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="card bg-dark-2 col-lg-9 col-xl-7 mt-3 mt-md-0">
                        <div class="card-body p-3 p-sm-5">
                            <h3 class="card-title" data-aos="fade-right">Enterprise Edition</h3>
                            <p class="type" data-aos="fade-left">Custom</p>
                            <NuxtLink href="/demo" class="btn btn-animated btn-purple-animated w-100" data-aos="zoom-in">
                                Talk to Us
                            </NuxtLink>
                            <ul>
                                <li data-aos="fade-left">All features from the Open-Source Edition and more</li>
                                <li data-aos="fade-left" data-aos-delay="100">Scalable architecture with High-Availability</li>
                                <li data-aos="fade-left" data-aos-delay="150">Multi-tenancy</li>
                                <li data-aos="fade-left" data-aos-delay="200">Worker groups supporting distributed workers</li>
                                <li data-aos="fade-left" data-aos-delay="250">Custom secrets backend (AWS Secret Manager, Azure Key Vault, Elasticsearch, Google Secret Manager, Hashicorp Vault)</li>
                                <li data-aos="fade-left" data-aos-delay="300">Audit logs</li>
                                <li data-aos="fade-left" data-aos-delay="350">Single Sign-On (SSO)</li>
                                <li data-aos="fade-left" data-aos-delay="400">Role-Based Access Control (RBAC)</li>
                                <li data-aos="fade-left" data-aos-delay="450">Custom blueprints</li>
                                <li data-aos="fade-left" data-aos-delay="500">Namespace-level management</li>
                                <li data-aos="fade-left" data-aos-delay="550">Secure credential store</li>
                                <li data-aos="fade-left" data-aos-delay="600">Built-in variable store</li>
                                <li data-aos="fade-left" data-aos-delay="650">Centralized governance over task configuration</li>
                                <li data-aos="fade-left" data-aos-delay="700">Enterprise support with guaranteed SLAs</li>
                                <li data-aos="fade-left" data-aos-delay="750">Onboarding & training</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row card-group mb-4">
                <div class="text-center mt-5">
                    <button class="btn btn-dark bg-dark-4 button-collapse mb-4" @click="isOpen = !isOpen" type="button" data-bs-toggle="collapse" data-bs-target="#compare" aria-expanded="true" aria-controls="compare" data-aos="zoom-in">
                        Compare all features <ChevronUp v-if="!isOpen" /><ChevronDown v-if="isOpen" />
                    </button>
                    <div id="compare" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div class="accordion-body feature-comparison table-responsive">
                            <table>
                                <tr>
                                    <th>Features</th>
                                    <th>Open-source</th>
                                    <th>Enterprise</th>
                                </tr>
                                <tr class="table-section">
                                    <td>Workflow Creation and Execution</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><NuxtLink href="/features/declarative-data-orchestration">Embedded code editor</NuxtLink></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Open-source plugins</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Custom plugins</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Code versioning & Git integration</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Autocompletion and syntax validation</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Live-updating topology view</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Dependency management between tasks, subflows and flow event triggers</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr class="table-section">
                                    <td>Workflow Orchestration and Scheduling</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Advanced orchestration engine (sequential and parallel task processing, ditributed mapping)</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Concurrency limits</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Human-in-the-loop orchestration with pauses for manual approval</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Flexible scheduling system (Cron, interval-based and custom conditions)</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Event-driven data processing</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Event-driven data processing at scale (high throughput)</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Custom error handling and on-failure behavior</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Automated retries and restarts</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Automated notifications on success or failure</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Custom internal storage backend</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Workflow monitoring, observability & performance optimization</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr class="table-section">
                                    <td>User Interface</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Fine-grained visibility into workflow execution states</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Dashboard about the status of your workflow executions across the instance</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Embedded code editor enabling fast feedback loops without deployment overhead</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Input validation on manual workflow executions from the UI</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Embedded task and trigger documentation</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Embedded blueprints with example usage</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Custom blueprints showing company-wide usage patterns</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Full-text search across task runs</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Centralized user & permission management from the UI</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Governance over code revision history (who updated the workflow and when)</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Namespace-level management for secrets, variables and task configuration</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Support to seamlessly switch between environments from the same UI via tenants</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr class="table-section">
                                    <td>Connectivity and Integration</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>API-first design: everything can be automated via an API call</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Webhook triggers</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Webhook triggers at scale capable of handling millions of events</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Official Terraform provider for provisioning flows and namespace files</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Official Terraform provider to provision all resources incl. users and secrets management</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Official support for GitHub Actions, GitLab, Azure DevOps and more CI/CD providers</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Community blueprints</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Custom blueprints representing company-wide usage patterns</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr class="table-section">
                                    <td>Security and authentication</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>OIDC/SSO authentication</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Role-Based Access Control</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Audit logs</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Custom secrets backends (AWS Secret Manager, Azure Key Vault, Elasticsearch, Google Secret Manager, Hashicorp Vault)</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Namespace-level credential store</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Namespace-level variable store</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Namespace-level task configuration</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Namespace-level permissions</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Worker security isolation</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr class="table-section">
                                    <td>Deployment and hosting</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Self-hosted deployment</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>High-Availability with No Single Point of Failure</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Worker groups supporting distributed workers</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr class="table-section">
                                    <td>Support & custom development services</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Community support</td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Enterprise support with SLAs</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Onboarding</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Training</td>
                                    <td></td>
                                    <td>
                                        <img src="/landing/enterprise/check.svg" alt="Check"/>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import Check from "vue-material-design-icons/Check.vue"
</script>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        data() {
            return {
                isOpen: false
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        .card {
            border: $block-border;
        }
        .card-title {
            color: $white;
            font-size: 1.625rem;
            font-weight: 600;
            line-height: 2rem;
            margin-bottom: 0;
        }

        .type {
            color: $white-3;
            font-size: $font-size-md;
            font-weight: 400;
        }

        .btn-dark {
            border: $btn-dark-border;
        }

        .card-body {
            ul {
                padding-top: $spacer;

                li {
                    color: $white;
                    font-size: $font-size-md;
                    font-weight: 400;
                    list-style-image: url("/landing/enterprise/check.svg");

                }
            }
        }

        .accordion-body {
            padding-top: $spacer;
            padding-left: calc($spacer * 4);
            padding-right: calc($spacer * 4);
        }

        .feature-comparison {
            table {
                width: 100%;
                color: $white;
                border-collapse: collapse;
                border-radius: 8px;
                border-style: hidden;
                box-shadow: 0 0 0 1px $black-3;
                overflow: hidden;
            }

            th {
                background-color: $black-2;
                padding: 22px 47px;
                white-space: nowrap;

                &:first-child {
                    text-align: left;
                }
            }

            td {
                background-color: $black-2;
                padding: 22px 47px;
                text-align: center;

                &:first-child {
                    text-align: left;
                }

                a {
                    color: $purple-35;
                }
            }

            tr {
                th, td {
                    border: $block-border;
                }
            }

            tr.table-section {
                font-weight: bold;
                td {
                    background-color: $black-9;
                }
            }
        }
    }
</style>
