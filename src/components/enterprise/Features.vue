<template>
    <div class="container">
        <Section
            title="Unlock exclusive features with the Enterprise Edition"
            subtitle="Advanced Solutions for Your Organization"
        >
            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card" data-usal="zoomin">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><Key /></span>
                                <h4 class="card-title">SSO/OIDC and RBAC</h4>
                            </div>
                            <p class="card-text">
                                Fine-grained Role-Based Access Control for users, user groups and
                                roles
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-usal="zoomin">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><ShieldAccount /></span>
                                <h4 class="card-title">Service Accounts</h4>
                            </div>
                            <p class="card-text">
                                Create custom service accounts with programmatic access allowing you
                                to trigger workflows from external systems
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-usal="zoomin">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><FormTextboxPassword /></span>
                                <h4 class="card-title">Secrets Management</h4>
                            </div>
                            <p class="card-text">
                                Store secrets or integrate your secret manager to ensure that your
                                passwords and keys remain secure
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card" data-usal="zoomin">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><ViewDashboardVariantOutline /></span>
                                <h4 class="card-title">Organization Blueprints</h4>
                            </div>
                            <p class="card-text">
                                Reuse custom code thanks to verified and documented workflow
                                templates built by your team for your team
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-usal="zoomin">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><Cog /></span>
                                <h4 class="card-title">Configuration Management</h4>
                            </div>
                            <p class="card-text">
                                Avoid boilerplate code thanks to namespace-level secrets, variables
                                and default configuration for specific tasks
                            </p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-usal="zoomin">
                        <div class="card-body">
                            <div class="cart-title-container">
                                <span class="card-icon"><Security /></span>
                                <h4 class="card-title">Audit Logs</h4>
                            </div>
                            <p class="card-text">
                                All events such as modifing or executing flows are automatically
                                tracked to provide a holistic audit trail
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from "~/components/layout/Section.vue"
    import Key from "vue-material-design-icons/Key.vue"
    import ShieldAccount from "vue-material-design-icons/ShieldAccount.vue"
    import FormTextboxPassword from "vue-material-design-icons/FormTextboxPassword.vue"
    import ViewDashboardVariantOutline from "vue-material-design-icons/ViewDashboardVariantOutline.vue"
    import Cog from "vue-material-design-icons/Cog.vue"
    import Security from "vue-material-design-icons/Security.vue"
    export default {
        components: {
            Section,
            Key,
            ShieldAccount,
            FormTextboxPassword,
            ViewDashboardVariantOutline,
            Cog,
            Security,
        },
    }
</script>