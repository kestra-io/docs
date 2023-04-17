<template>
    <div class="container">
        <Section>
            <div class="row card-group mb-4">
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <div class="card-body p-5">
                            <div class="text-center mb-5">
                                <h4 class="card-title">Open Source Edition</h4>
                                <p class="pricing">Free</p>
                                <NuxtLink href="/docs/getting-started" class="btn btn-secondary btn-lg">
                                    Get started
                                </NuxtLink>
                            </div>
                            <ul>
                                <li>Free, forever</li>
                                <li>Self-hosted</li>
                                <li>Open-Source under Apache 2 license</li>
                                <li>Powerful Workflow Creation & Execution</li>
                                <li>Scalable Workflow Orchestration & Scheduling</li>
                                <li>Rich User Interface</li>
                                <li>Rich Plugin Ecosystem</li>
                                <li>Infinite Customization Capabilities</li>
                                <li>Unlimited Usage (tasks, flows…)</li>
                                <li>Community Support</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <div class="card-body p-5">
                            <div class="text-center mb-5">
                                <h3 class="card-title">Enterprise Edition</h3>
                                <p class="pricing custom">Custom</p>
                                <NuxtLink href="/contact-us" class="btn btn-primary btn-lg">
                                    Contact us
                                </NuxtLink>
                            </div>
                            <ul>
                                <li><b>All features included in the Open Source Edition</b></li>
                                <li>Self-hosted</li>
                                <li>Audit Logs</li>
                                <li>RBAC</li>
                                <li>SSO</li>
                                <li>Secure Namespace Configuration</li>
                                <li>Secret Managers Integration</li>
                                <li>Worker Security Isolation</li>
                                <li>High Availability with No Single Point of Failure</li>
                                <li>Enterprise Support with SLAs</li>
                                <li>Onboarding & Training</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-5">
                    <button class="btn btn-lg btn-primary button-collapse mb-4" type="button" data-bs-toggle="collapse" data-bs-target="#compare" aria-expanded="true" aria-controls="compare">
                        Compare all features <ChevronUp />
                    </button>
                    <div id="compare" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div class="accordion-body feature-comparison">
                            <table>
                                <tr>
                                    <th class="text-center">Features</th>
                                    <th>Open source</th>
                                    <th>Enterprise</th>
                                </tr>
                                <tr class="table-section">
                                    <td>Workflow Creation and Execution</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Low Code (YAML-based)</td>
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

<script>
    import Section from '../layout/Section.vue';
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import Check from "vue-material-design-icons/Check.vue"

    export default {
        components: {Section, ChevronUp, Check},
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
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
            color: $purple-13;
        }

        .card-body {
            ul {
                padding-top: $spacer;
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