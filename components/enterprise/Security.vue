<template>
    <div class="container">
        <Section
            title="Enterprise-Grade Reliability, Security and Team Productivity"
            subtitle="Full Control and Compliance"
        >   
                <div class="row mb-5">
                <div class="col-md-6 order-1 order-md-1" data-aos="fade-left">
                    <h3>Advanced Architecture Design</h3>
                    <p>
                        Elevate your system's resilience and efficiency with our Enterprise Edition's architectural design, built to support scalability and high availability.
                    </p>
                    <ul>
                        <li><b>High scalability and availability:</b> With managed <b>"Kafka-as-a-backend"</b> and <b>Elasticsearch</b> integrated into the Enterprise Edition, eliminate any single point of failure.</li>
                        <li><b>Worker groups:</b> Looking for targeted task execution and polling trigger evaluation on specialized compute instances? The Worker Groups is offering flexibility in system resources, operating system, backend access, and regional proximity.</li>
                    </ul>
                </div>
                <div class="col-md-6 order-0 order-md-0" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/enterprise/ee-4.svg" alt="High availability Schema">
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-md-6 order-1 order-md-0" data-aos="fade-right">
                    <h3>Advanced Security and Access Control</h3>
                    <p>
                        Ensure that your data workflows and resources remain protected and compliant with industry standards.
                    </p>
                    <ul>
                        <li><b>Secure Authentication:</b> Integrate with Single Sign-On (SSO) and enterprise-grade identity providers to manage user access and authenticate users efficiently and securely.</li>
                        <li><b>Role-Based Access Control:</b> Define custom roles and permissions for granular control over user access to workflows, tasks, and resources. Ensure that users only have access to the appropriate data and features.</li>
                        <li><b>Enterprise Secret Management:</b> Kestra's Enterprise Edition offers robust secret management, supporting integration with AWS Secret Manager, Azure Key Vault, Elasticsearch, Google Secret Manager, and Vault, ensuring secure, in-memory access to secrets at runtime.</li>
                        <li><b>Audit logs:</b> Gain full visibility into all user activities on Kestra resources with detailed audit logs, empowering systems administrators and security teams to monitor actions, investigate breaches, and maintain compliance.</li>
                    </ul>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/enterprise/security-3.svg" alt="A dashboard with success or fail task events">
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-md-6" data-aos="fade-right">
                    <img  class="img-fluid" src="/landing/enterprise/security-1.svg" alt="Stylized view of administrator settings with role-based view">
                </div>
                <div class="col-md-6">
                    <h3>Advanced Team Collaboration</h3>
                    <p>
                        Take workflow organization and collaboration to the next level with configurable namespaces, organization Blueprints and credential store.
                    </p>
                    <ul>
                        <li><b>Namespace Management:</b> Create separate namespaces for different teams or projects, making it easy to find and manage your workflows.</li>
                        <li><b>Control Access and Permissions:</b> Configure access and permissions at the namespace level, ensuring that users only have access to the workflows and resources relevant to their roles.</li>
                        <li><b>Share Workflows and Resources:</b> Easily share workflows, tasks, and other resources across namespaces, fostering efficient collaboration between teams.</li>
                        <li><b>Organization Blueprints:</b> Share custom, organization-specific Blueprints directly within your team, exclusively available for your organization's use.</li>
                    </ul>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '~/components/layout/Section.vue';
    export default {
        components: {Section}
    }
</script>
