<template>
    <div class="container">
        <Section
        title="Unlock exclusive features with the Enterprise Edition"
            subtitle="Advanced Functionality for Your Organization">

            <div class="row card-group mb-4">
                <div class="col-12 col-md-6 d-md-flex justify-content-md-end">
                    <div class="card col-lg-9 col-xl-7">
                        <div class="card-body p-5">
                            <div class="text-center">
                                <h4 class="card-title" data-aos="fade-right">Open-Source Edition</h4>
                                <p class="pricing" data-aos="fade-left">Free</p>
                                <NuxtLink href="/docs/getting-started" class="btn btn-secondary" data-aos="zoom-in">
                                    Get started
                                </NuxtLink>
                            </div>
                            <ul>
                                <li data-aos="fade-right"><span>Apache 2.0 license</span></li>
                                <li data-aos="fade-right" data-aos-delay="100"><span>Powerful orchestration engine</span></li>
                                <li data-aos="fade-right" data-aos-delay="150"><span>Declarative workflows as code and from the UI</span></li>
                                <li data-aos="fade-right" data-aos-delay="200"><span>Event-driven automations</span></li>
                                <li data-aos="fade-right" data-aos-delay="250"><span>Embedded Visual Studio code editor</span></li>
                                <li data-aos="fade-right" data-aos-delay="300"><span>Embedded documentation</span></li>
                                <li data-aos="fade-right" data-aos-delay="350"><span>Live-updating topology view</span></li>
                                <li data-aos="fade-right" data-aos-delay="400"><span>Access to 400+ plugins</span></li>
                                <li data-aos="fade-right" data-aos-delay="450"><span>Git & CI/CD integrations</span></li>
                                <li data-aos="fade-right" data-aos-delay="500"><span>Basic authentification</span></li>
                                <li data-aos="fade-right" data-aos-delay="550"><span>Community support</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6">
                    <div class="card col-lg-9 col-xl-7 mt-3 mt-md-0">
                        <div class="card-body p-5">
                            <div class="text-center mb-7">
                                <h3 class="card-title" data-aos="fade-right">Enterprise Edition</h3>
                                <p class="pricing custom" data-aos="fade-left">Custom</p>
                                <NuxtLink href="/demo" class="btn btn-primary" data-aos="zoom-in">
                                    Talk to Us
                                </NuxtLink>
                            </div>
                            <ul>
                                <li data-aos="fade-left"><span><strong>All features from the Open-Source Edition and more</strong></span></li>
                                <li data-aos="fade-left" data-aos-delay="100"><span>Scalable architecture with High-Availability</span></li>
                                <li data-aos="fade-left" data-aos-delay="150"><span>Multi-tenancy</span></li>
                                <li data-aos="fade-left" data-aos-delay="200"><span>Worker groups supporting distributed workers</span></li>
                                <li data-aos="fade-left" data-aos-delay="250"><span>Custom secrets backend (AWS Secret Manager, Azure Key Vault, Elasticsearch, Google Secret Manager, Hashicorp Vault)</span></li>
                                <li data-aos="fade-left" data-aos-delay="300"><span>Audit logs</span></li>
                                <li data-aos="fade-left" data-aos-delay="350"><span>Single Sign-On (SSO)</span></li>
                                <li data-aos="fade-left" data-aos-delay="400"><span>Role-Based Access Control (RBAC)</span></li>
                                <li data-aos="fade-left" data-aos-delay="450"><span>Custom blueprints</span></li>
                                <li data-aos="fade-left" data-aos-delay="500"><span>Namespace-level management</span></li>
                                <li data-aos="fade-left" data-aos-delay="550"><span>Secure credential store</span></li>
                                <li data-aos="fade-left" data-aos-delay="600"><span>Built-in variable store</span></li>
                                <li data-aos="fade-left" data-aos-delay="650"><span>Centralized governance over task configuration</span></li>
                                <li data-aos="fade-left" data-aos-delay="700"><span>Enterprise support with guaranteed SLAs</span></li>
                                <li data-aos="fade-left" data-aos-delay="750"><span>Onboarding & training</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row card-group mb-4">
                <div class="text-center mt-5">
                    <button class="btn btn-primary button-collapse mb-4" @click="isOpen = !isOpen" type="button" data-bs-toggle="collapse" data-bs-target="#compare" aria-expanded="true" aria-controls="compare" data-aos="zoom-in">
                        Compare all features <ChevronUp v-if="!isOpen" /><ChevronDown v-if="isOpen" />
                    </button>
                    <div id="compare" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div class="accordion-body feature-comparison">
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
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Open-source plugins</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Custom plugins</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Code versioning & Git integration</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Autocompletion and syntax validation</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Live-updating topology view</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Dependency management between tasks, subflows and flow event triggers</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Workflow Orchestration and Scheduling</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Advanced orchestration engine (sequential and parallel task processing, ditributed mapping)</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Concurrency limits</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Human-in-the-loop orchestration with pauses for manual approval</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Flexible scheduling system (Cron, interval-based and custom conditions)</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Event-driven data processing</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Event-driven data processing at scale (high throughput)</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Custom error handling and on-failure behavior</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Automated retries and restarts</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Automated notifications on success or failure</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Custom internal storage backend</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Workflow monitoring, observability & performance optimization</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>User Interface</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Fine-grained visibility into workflow execution states</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Dashboard about the status of your workflow executions across the instance</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Embedded code editor enabling fast feedback loops without deployment overhead</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Input validation on manual workflow executions from the UI</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Embedded task and trigger documentation</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Embedded blueprints with example usage</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Custom blueprints showing company-wide usage patterns</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Full-text search across task runs</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Centralized user & permission management from the UI</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Governance over code revision history (who updated the workflow and when)</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Namespace-level management for secrets, variables and task confiiguration</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Support to seamlessly switch between environments from the same UI via tenants</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Connectivity and Integration</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>API-first design: everything can be automated via an API call</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Webhook triggers</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Webhook triggers at scale capable of handling millions of events</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Official Terraform provider for provisioning flows and namespace files</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Official Terraform provider to provision all resources incl. users and secrets management</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Official support for Github Actions, GitLab, Azure DevOps and more CI/CD providers</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Community blueprints</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Custom blueprints representing company-wide usage patterns</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Security and authentication</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>OIDC/SSO authentication</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Role-Based Access Control</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Audit logs</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Custom secrets backends (AWS Secret Manager, Azure Key Vault, Elasticsearch, Google Secret Manager, Hashicorp Vault)</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Namespace-level credential store</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Namespace-level variable store</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Namespace-level task configuration</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Namespace-level permissions</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Worker security isolation</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Deployment and hosting</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Self-hosted deployment</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>High-Availability with No Single Point of Failure</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Worker groups supporting distributed workers</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Support & custom development services</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Community support</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Enterprise support with SLAs</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Onboarding</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Training</td>
                                    <td></td>
                                    <td><Check /></td>
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
            border: 1px solid var(--bs-border-color);
        }
        .card-title {
            font-size: $font-size-xl;
            font-weight: normal;
            margin-bottom: 0;
        }

        .pricing {
            font-size: $h3-font-size;
            font-weight: bold;
        }

        .custom {
            color: $primary;
        }

        .card-body {
            ul {
                padding-top: $spacer;

                li {
                    padding: 0 0.5rem;
                    list-style-image: url("data:image/svg+xml,%3Csvg%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2034%2033%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M12.7838%2021.8605L7.09347%2016.1702L5.15576%2018.0943L12.7838%2025.7223L29.1588%209.34728L27.2347%207.42322L12.7838%2021.8605Z%22%20fill%3D%22%239022FA%22%2F%3E%0A%3C%2Fsvg%3E%0A");
                    span {
                        position: relative;
                        top: -0.75rem;
                    }
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
            }

            th {
                background-color: #EEEDFF;
                padding: 10px 20px;

                &:first-child {
                    text-align: left;
                }
            }

            td {
                background-color: #F9F9FF;
                padding: 10px 20px;
                text-align: center;

                &:first-child {
                    text-align: left;
                }
            }

            tr.table-section {
                font-weight: bold;
                td {
                    background-color: #E8E7FD;
                }
            }

            .material-design-icon {
                color: $secondary;
                font-weight: bold;
                font-size: $font-size-xl;
            }
        }
    }
</style>
