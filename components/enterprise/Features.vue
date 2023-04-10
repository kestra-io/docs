<template>
    <div class="container">
        <Section
            title="Unlock exclusive feature with the Enterprise Edition"
            subtitle="Access Advanced Solutions"
        >

            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <Key />
                                </span>
                            <h5 class="card-title">
                                SSO/OIDC and RBAC
                            </h5>
                            <p class="card-text">Control users and group access with fine-grained ACL</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <ShieldAccount />
                                </span>
                            <h5 class="card-title">Service account</h5>
                            <p class="card-text">Create service account allowing to triggers workflows for external systems</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <FormTextboxPassword />
                                </span>
                            <h5 class="card-title">Secrets manager</h5>
                            <p class="card-text">Integrate your secret manager to ensure the security of your passwords and keys</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row card-group mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <ViewDashboardVariantOutline />
                                </span>
                            <h5 class="card-title">
                                Audit Log
                            </h5>
                            <p class="card-text">Audit all the resources created in one instance</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <Cog />
                                </span>
                            <h5 class="card-title">Configuration management</h5>
                            <p class="card-text">Automatically configure all flows from a namespace with task defaults variables & secrets</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <Security />
                                </span>
                            <h5 class="card-title">Best in class support</h5>
                            <p class="card-text">Custom SLA to ensure that you have the help you need, whenever you need it</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    import Key from "vue-material-design-icons/Key.vue";
    import ShieldAccount from "vue-material-design-icons/ShieldAccount.vue";
    import FormTextboxPassword from "vue-material-design-icons/FormTextboxPassword.vue";
    import ViewDashboardVariantOutline from "vue-material-design-icons/ViewDashboardVariantOutline.vue";
    import Cog from "vue-material-design-icons/Cog.vue";
    import Security from "vue-material-design-icons/Security.vue";
    export default {
        components: {Section, Key, ShieldAccount, FormTextboxPassword, ViewDashboardVariantOutline, Cog, Security}
    }
</script>
