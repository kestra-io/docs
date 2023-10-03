<template>
    <div class="container">
        <Section>
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
                                <li data-aos="fade-right"><span>Free usage under Apache 2.0 license</span></li>
                                <li data-aos="fade-right" data-aos-delay="50"><span>Self-hosted</span></li>
                                <li data-aos="fade-right" data-aos-delay="100"><span>Community Blueprints</span></li>
                                <li data-aos="fade-right" data-aos-delay="150"><span>Community Plugins</span></li>
                                <li data-aos="fade-right" data-aos-delay="200"><span>Basic Auth for a Single User</span></li>
                                <li data-aos="fade-right" data-aos-delay="250"><span>Basic Namespace Configuration</span></li>
                                <li data-aos="fade-right" data-aos-delay="300"><span>Basic Workflow Management</span></li>
                                <li data-aos="fade-right" data-aos-delay="350"><span>Basic Secrets Management via Environment Variables</span></li>
                                <li data-aos="fade-right" data-aos-delay="400"><span>Onboarding via Online Documentation</span></li>
                                <li data-aos="fade-right" data-aos-delay="450"><span>Community Support</span></li>
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
                                <NuxtLink href="/contact-us" class="btn btn-primary" data-aos="zoom-in">
                                    Free trial
                                </NuxtLink>
                            </div>
                            <ul>
                                <li data-aos="fade-left"><span><strong>All features from the Open-Source Edition and More</strong></span></li>
                                <li data-aos="fade-left" data-aos-delay="50"><span>Self-hosted</span></li>
                                <li data-aos="fade-left" data-aos-delay="100"><span>Community and Organization Blueprints</span></li>
                                <li data-aos="fade-left" data-aos-delay="150"><span>Community and Custom Plugins</span></li>
                                <li data-aos="fade-left" data-aos-delay="200"><span>Enterprise-Grade Auth with SSO and RBAC</span></li>
                                <li data-aos="fade-left" data-aos-delay="250"><span>Secure Namespace Configuration</span></li>
                                <li data-aos="fade-left" data-aos-delay="300"><span>Workflow Management with Audit Logs for Every Action</span></li>
                                <li data-aos="fade-left" data-aos-delay="350"><span>Encrypted Namespace-level Secrets and Secrets Manager Integration</span></li>
                                <li data-aos="fade-left" data-aos-delay="400"><span>Personalized Onboarding & Training</span></li>
                                <li data-aos="fade-left" data-aos-delay="450"><span>Enterprise Support with SLAs</span></li>
                                <li data-aos="fade-left" data-aos-delay="500"><span>Worker Security Isolation</span></li>
                                <li data-aos="fade-left" data-aos-delay="550"><span>High Availability and Fault Tolerance</span></li>
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
                                    <th>Open source</th>
                                    <th>Enterprise</th>
                                </tr>
                                <tr class="table-section">
                                    <td>Workflow Creation and Execution</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td><NuxtLink href="/features/declarative-data-orchestration">Low Code (YAML-based)</NuxtLink></td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Extensibility (Custom Plugins)</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Connectivity to Popular Data Sources</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Versioning</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Data Validation</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Debugging</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Workflow Orchestration and Scheduling</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Orchestration Engine (Sequential, Parallel)</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Flexible Scheduling System (Time-based, Event-based)</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Large Data Processing</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Error Handling and Retry Mechanisms</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Notifications</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Performance Monitoring and Optimization</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Connectivity and Integration</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>API and Webhook Support</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Integration with Terraform and CI/CD Pipelines</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Kafka Integration</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Elasticsearch Integration</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Security and Authentication</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Audit Logs</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>OIDC/SSO Authentication</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Role-Based Access Control</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Secure Namespace Configuration</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Secret Managers Integration</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Worker Security Isolation</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Deployment and Scaling</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Self Hosted Deployment</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>High Availability with No Single Point of Failure</td>
                                    <td></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>User Interface and Experience</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Rich User Interface</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Built-in Plugin Ecosystem</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Extended API</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Support & Services</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Community Support</td>
                                    <td><Check /></td>
                                    <td><Check /></td>
                                </tr>
                                <tr>
                                    <td>Enterprise Support with SLAs</td>
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
    import Section from '~/components/layout/Section.vue';

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
