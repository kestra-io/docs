<template>
    <div class="container">
        <Section class="about">
            <div class="content-section">
                <h2><span>Kestra</span> & VMware Aria Automation (vRealize)</h2>
                <p><strong>Kestra</strong> is an open-source workflow orchestrator and a compelling alternative to <strong>VMware’s orchestration suite</strong> (VMware Aria Automation, formerly vRealize Automation, now part of VMware Cloud Foundation). While VMware’s automation tools have become increasingly expensive and restrictive, Kestra offers a cost-effective, flexible solution with cutting-edge features. Aria Automation is only sold as part of the Cloud Foundation bundle – eliminating standalone or SaaS options – and many customers have seen <strong>drastic price increases</strong> as a result. In contrast, Kestra’s open-source model has <strong>no licensing fees</strong> and avoids vendor lock-in altogether.</p>
                <p>The Aria Automation SaaS is now discontinued, and little new functionality has been added beyond rebranding. These pain points are driving DevOps teams to explore Kestra as a modern, open alternative that delivers better automation benefits <em>without</em> the drawbacks.</p>
            </div>

            <div class="content-section">
                <h2>Why Teams Replace VMware with Kestra</h2>
                <p>Organizations facing these challenges are turning to Kestra, which addresses the core pain points through a fundamentally different approach. Here’s why many teams are replacing VMware’s automation stack with <strong>Kestra</strong>:</p>
                <ul>
                    <li><strong>Open-Source & Cost Savings:</strong> Kestra is Apache 2.0 licensed open source, meaning <strong>no licensing fees</strong> or per-CPU costs. This dramatically lowers TCO compared to VMware’s proprietary platform, which now only comes as an expensive bundle. (Some VMware customers have even been hit with <strong>10×–15× price quotes</strong>) By adopting Kestra, companies avoid these massive price hikes and costly renewals.</li>
                    
                    <li><strong>Declarative YAML Workflows:</strong> Kestra defines workflows in a pure <strong>declarative YAML</strong> format, treating automation as code. This makes it easy to version-control and reuse workflows (GitOps-friendly) and improves readability. VMware Aria, on the other hand, often requires a mix of YAML blueprints <em>plus</em> imperative scripts or manual configurations to accomplish tasks. Kestra’s code-first approach improves pipeline maintenance and is more developer-friendly than VMware’s script-heavy automation.</li>
                    <li><strong>Event-Driven Orchestration:</strong> Kestra is inherently <strong>event-driven</strong> – workflows can trigger on external events, API calls, message queues, or schedules for real-time automation. This enables responsive, asynchronous processing (e.g. reacting to CI/CD events or data streams). VMware Aria Automation’s usage is primarily request- or schedule-based with more limited external event support. Kestra’s native event triggers let you build reactive DevOps processes (such as auto-scaling, incident response, etc.) that VMware’s tools struggle to match out-of-the-box.</li>
                    <li><strong>Broad Integration & Vendor-Neutral:</strong> Kestra has a broad plugin ecosystem and an <strong>API-first</strong>, vendor-neutral design. It integrates with virtually any technology stack – Docker containers, Kubernetes clusters, CI/CD tools, configuration management (Ansible), IaC provisioning (Terraform), ITSM systems (ServiceNow), databases, cloud services, and more. Kestra doesn’t favor any particular cloud or vendor, avoiding lock-in. In contrast, VMware Aria is deeply tied to the VMware ecosystem (vSphere, NSX, vSAN) with relatively limited support for non-VMware tools. Extending VMware’s automation to work across diverse platforms often requires custom scripting or additional products, whereas Kestra connects to everything out-of-the-box.</li>
                    <li><strong>Faster Deployment & Easier Maintenance:</strong> Kestra can be up and running in minutes on your infrastructure of choice – deployable via Docker, Kubernetes, or Helm with a lightweight footprint. Its <strong>simple setup</strong> means lower operational overhead and faster time to value. VMware’s automation suite, by comparison, is known for high complexity and deployment overhead – installs and upgrades often span weeks and may require professional services assistance. Notably, Broadcom ended the vRealize/Aria SaaS service, forcing customers back to complex on-premises deployments. Kestra’s ease of installation and management (no special appliances or lengthy configuration needed) lets teams start automating quickly without the headaches.</li>
                    <li><strong>Scalability & Multi-Tenancy:</strong> Kestra is <strong>cloud-native</strong> and built to scale horizontally. Its distributed architecture (with technologies like Kafka under the hood) supports running thousands of workflows per hour across nodes, and it includes multi-tenant namespace isolation for different teams or customers. VMware Aria Automation is typically a single-tenant, monolithic deployment per environment – scaling to new teams or use cases often means standing up additional separate instances, since it lacks true multi-tenancy. In short, Kestra can handle large-scale enterprise workloads and serve multiple teams from one platform, whereas VMware’s solution can become unwieldy at scale.</li>
                </ul>
            </div>

            <div class="content-section">
                <h2>Feature Comparison Table</h2>
                <div class="table-responsive mb-5">
                    <table class="table table-bordered mb-0">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Kestra</th>
                                <th>VMware Aria Automation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Licensing</td>
                                <td>Open-source (Apache 2.0); <strong>no license fees</strong></td>
                                <td>Proprietary (Broadcom bundle-only licensing); high cost</td>
                            </tr>
                            <tr>
                                <td>Automation Model</td>
                                <td>General-purpose orchestration across tech stacks (data, apps, infra)</td>
                                <td>Infrastructure-centric (VMs, VM templates, IT services)</td>
                            </tr>
                            <tr>
                                <td>Workflow Definition</td>
                                <td>Fully <strong>declarative YAML</strong> pipelines (everything-as-code)</td>
                                <td>Imperative scripts + YAML blueprints (hybrid approach)</td>
                            </tr>
                            <tr>
                                <td>Event-Driven</td>
                                <td><strong>Event-driven</strong> orchestration (external webhooks, message queues, schedules)</td>
                                <td>Basic triggers (user requests, vCenter events; limited external)</td>
                            </tr>
                            <tr>
                                <td>Integrations</td>
                                <td><strong>Plugin-based</strong> integrations (Docker, K8s, Ansible, Terraform, ServiceNow, APIs)</td>
                                <td>Tightly couples with VMware stack; limited third-party plugins</td>
                            </tr>
                            <tr>
                                <td>Scalability</td>
                                <td>Lightweight, cloud-native microservice architecture; scales horizontally</td>
                                <td>Large, resource-intensive appliance footprint; scales vertically (add VMs)</td>
                            </tr>
                            <tr>
                                <td>Multi-Tenancy</td>
                                <td>Built-in multi-tenant support (isolate namespaces for teams/projects)</td>
                                <td>No true multi-tenancy (one instance per tenant or org)</td>
                            </tr>
                            <tr>
                                <td>Complexity</td>
                                <td>Lower complexity; <strong>fast deployment</strong> and easy onboarding for teams</td>
                                <td>High complexity in setup and upkeep (often requires expert services)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="content-section">
                <h2>Kestra for Modern IT Automation</h2>
                <p>Modern IT environments demand an orchestration platform that is <strong>agile, interoperable, and aligned with DevOps practices</strong>. Kestra checks these boxes by treating automation as code, being event-driven, and working across any environment. Platform teams can define everything from infrastructure provisioning to CI/CD pipelines or even data workflows in Kestra’s YAML format, and trigger these flows via events or schedules. This unified approach means a <strong>DevOps engineer</strong> can use one tool to automate cloud resources, Docker workloads, database ops, and more – all while leveraging familiar GitOps processes and version control for workflows. Kestra’s language-agnostic execution (support for scripts in Python, Bash, JavaScript, etc.) and rich plugin library allow it to orchestrate practically any task, across on-prem and multi-cloud, without custom coding or vendor-specific constraints.</p>
                <p>VMware’s orchestration tools, in contrast, stem from a virtualization-centric era. They excel at managing VMware-based infrastructure, but are less adaptable to the cloud-native and multi-toolchain reality of today’s IT. For example, VMware Aria is primarily used for provisioning VMs and related IT services within vSphere/VCF, whereas Kestra can orchestrate <strong>any</strong> workflow – from spinning up Kubernetes clusters to coordinating data pipelines – in a single platform. This makes <strong>Kestra</strong> especially attractive for teams that need to automate across diverse technologies and avoid being confined to one vendor’s ecosystem.</p>
                <p>By replacing expensive, complex VMware automation with Kestra, organizations gain agility and control. <strong>DevOps engineers</strong> benefit from a simpler, code-centric workflow engine that integrates with their entire toolchain. <strong>IT managers</strong> appreciate the significant cost savings and the elimination of license headaches and surprise price hikes. <strong>Platform architects</strong> can design automation solutions without vendor lock-in, leveraging Kestra’s open APIs and plugins to fit into any environment or cloud. In summary, Kestra delivers an <strong>event-driven, scalable, and cost-effective</strong> orchestration platform for modern IT – a compelling alternative for enterprises seeking to escape VMware’s high prices and complexity, and embrace a more flexible approach to automation.</p>
            </div>
        </Section>
    </div>
    <LayoutFooterContact
        title="Getting Started"
        subtitle="Start building with Kestra — Automate Everything Everywhere All at Once."
        darkButtonText="Read the docs"
        purpleButtonText="Get started!"
    />
</template>

<script setup>
    import Typewriter from "vue-material-design-icons/Typewriter.vue";
    import BugOutline from "vue-material-design-icons/BugOutline.vue";
    import Lan from "vue-material-design-icons/Lan.vue";
    import Read from "vue-material-design-icons/Read.vue";
    import Git from "vue-material-design-icons/Git.vue";
    import AlertCircleOutline from "vue-material-design-icons/AlertCircleOutline.vue";
</script>

<script>
    import Section from '../../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    table {
        margin-top: 5.625rem;
        border: 1px solid $black-9;

        thead {
            border-bottom: 1px solid $black-9;
        }

        th {
            background: $black-2;
            text-align: center;
        }

        td {
            background: $black-2;
            vertical-align: middle;

            &:first-of-type {
                text-align: center;
            }
        }
        th, td {
            padding: 1.375rem 2.938rem;
            color: $white;
            font-size: $font-size-md;
            font-weight: 300;
        }
    }

    .content-section {
        margin-bottom: 1rem; 

        p, ul > li {
            margin-bottom: 1rem;
        }
    }

    section.about {
        border-bottom: $block-border;

        h2, h3 {
            color: $white;
            font-weight: 300;
 

            span {
                background: linear-gradient(90deg, #E151F7 18.28%, #5C47F5 35.74%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        p, ul > li {
            color: $white;
            font-size: $h6-font-size;
            font-weight: 400;
        }

        :deep(.main) {
            display: flex;
            flex-direction: column;
            gap: 4rem;
            padding-top: 0;
        }
    }
</style>
