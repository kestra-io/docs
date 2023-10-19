<template>
    <div class="container">
        <Section
            title="Enterprise-Grade Reliability, Security and Team Productivity"
            subtitle="Full Control and Compliance"
            baseline="Collaborate with your team and manage your workflows directly from your browser"
        >   
                <div class="row mb-5">
                <div class="col-md-6 order-1 order-md-0" data-aos="fade-right">
                    <h3>Advanced Architecture Design</h3>
                    <p>
                        Ensure scalability and high availability with managed <b>Kafka</b> and <b>Elasticsearch</b> integrated into the Enterprise Edition to eliminate single point of failure.
                    </p>
                    <ul>
                        <li><b>Secure Authentication:</b> Integrate with Single Sign-On (SSO) and enterprise-grade identity providers to manage user access and authenticate users efficiently and securely</li>
                        <li><b>Role-Based Access Control:</b> Define custom roles and permissions for granular control over user access to workflows, tasks, and resources. Ensure that users only have access to the appropriate data and features</li>
                    </ul>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/enterprise/security-2.svg" alt="A dashboard with success or fail task events">
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-md-6" data-aos="fade-left">
                    <img  class="img-fluid" src="/landing/enterprise/security-1.svg" alt="Stylized view of administrator settings with role-based view">
                </div>
                <div class="col-md-6">
                    <h3>Advanced Workflow Collaboration</h3>
                    <p>
                        Take workflow organization and collaboration to the next level with configurable namespaces, organization Blueprints and credential store.
                    </p>
                    <ul>
                        <li><b>Organize Workflows with Namespaces:</b> Create separate namespaces for different teams or projects, making it easy to find and manage your workflows</li>
                        <li><b>Control Access and Permissions:</b> Configure access and permissions at the namespace level, ensuring that users only have access to the workflows and resources relevant to their roles</li>
                        <li><b>Share Workflows and Resources:</b> Easily share workflows, tasks, and other resources across namespaces, fostering efficient collaboration between teams</li>
                    </ul>
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-md-6 order-1 order-md-0" data-aos="fade-right">
                    <h3>Advanced Security and Access Control</h3>
                    <p>
                        Ensure that your data workflows and resources remain protected and compliant with industry standards.
                    </p>
                    <ul>
                        <li><b>Secure Authentication:</b> Integrate with Single Sign-On (SSO) and enterprise-grade identity providers to manage user access and authenticate users efficiently and securely</li>
                        <li><b>Role-Based Access Control:</b> Define custom roles and permissions for granular control over user access to workflows, tasks, and resources. Ensure that users only have access to the appropriate data and features</li>
                    </ul>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-aos="fade-left">
                    <img class="img-fluid" src="/landing/enterprise/security-2.svg" alt="A dashboard with success or fail task events">
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
