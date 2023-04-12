<template>
    <div class="container">
        <Section>
            <div class="row card-group mb-4">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <h5 class="card-title">
                                Open Source Edition
                            </h5>
                            <h5 class="pricing">Free</h5>
                            <div class="text-center ">
                                <NuxtLink href="/docs/getting-started" class="btn btn-secondary me-2">
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
                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <h5 class="card-title">
                                Enterprise Edition
                            </h5>
                            <h5 class="pricing custom">Custom</h5>
                            <div class="text-center ">
                                <NuxtLink href="/company/contact" class="btn btn-primary">
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
                <div class="text-center">
                    <button class="btn btn-lg btn-primary me-2 button-collapse" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Compare all features <span class="caret"></span>
                    </button>
                    <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
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
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Extensibility (Custom Plugins)</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Connectivity to Popular Data Sources</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Versioning</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Data Validation</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Debugging</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Workflow Orchestration and Scheduling</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Orchestration Engine (Sequential, Parallel)</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Flexible Scheduling System (Time-based, Event-based)</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Large Data Processing</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Error Handling and Retry Mechanisms</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Notifications</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Performance Monitoring and Optimization</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Connectivity and Integration</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>API and Webhook Support</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Integration with Terraform and CI/CD Pipelines</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Kafka Integration</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Elasticsearch Integration</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Security and Authentication</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Audit Logs</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>OIDC/SSO Authentication</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Role-Based Access Control</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Secure Namespace Configuration</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Secret Managers Integration</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Worker Security Isolation</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Deployment and Scaling</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Self Hosted Deployment</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>High Availability with No Single Point of Failure</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr class="table-section">
                                    <td>User Interface and Experience</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Rich User Interface</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Built-in Plugin Ecosystem</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Extended API</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr class="table-section">
                                    <td>Support & Services</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Community Support</td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
                                </tr>
                                <tr>
                                    <td>Enterprise Support with SLAs</td>
                                    <td></td>
                                    <td><img src="/landing/enterprise/tick.svg"></td>
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
    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        h5 {
            text-align: center;
        }
        .pricing {
            font-size: $h4-font-size;
        }
        .custom {
            color: $purple-13;
        }
        .card-body {
            ul {
                padding-top: $spacer;
                list-style: none;
                list-style-image: url("/landing/enterprise/tick.svg");
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
            }

            td {
                text-align: left;
                background-color: #F9F9FF;
                padding: 10px 20px;
            }

            tr.table-section {
                font-weight: bold;
                td {
                    background-color: #E8E7FD;
                }
            }
        }
    }
</style>