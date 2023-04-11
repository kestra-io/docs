<template>
    <div class="main">
        <div class="container">
            <Section subtitle="Security and high availability" title="Take Kestra to the next level with the Enterprise Edition 🚀">
                <div class="row mb-5">
                    <div class="col-md-6">
                        <div class="accordion" id="accordionExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        Scale with no point of failure with Kafka and ElasticSearch
                                    </button>
                                </h2>
                                <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        Ensure scalability and high availability with Kafka and ElasticSearch Features availables on the Enterprise Edition to eliminate all points of failure. Kestra's architecture is designed to handle high volumes of data and to ensure that workflows are processed reliably by default.
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        SSO/OIDC and RBAC
                                    </button>
                                </h2>
                                <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        TODO
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Configuration management for the company
                                    </button>
                                </h2>
                                <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        TODO
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <img src="/landing/features/ee.svg" alt="" class="img-fluid" />
                    </div>
                </div>
                <div class="row card-group mb-2">
                    <div class="col-md-4 mb-4">
                        <div class="card shadow-lg">
                            <div class="card-body">
                                <span class="card-icon"><KeyOutline /></span>
                                <h5 class="card-title">Service account</h5>
                                <p class="card-text">Create service account allowing to triggers workflows for external systems</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card shadow-lg">
                            <div class="card-body">
                                <span class="card-icon"><MathLog /></span>
                                <h5 class="card-title">Secrets</h5>
                                <p class="card-text">Integrate your secret manager to ensure the security of your passwords and keys</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card shadow-lg">
                            <div class="card-body">
                                <span class="card-icon"><FormTextboxPassword /></span>
                                <h5 class="card-title">Audit Log</h5>
                                <p class="card-text">Audit all the resources created in one instance.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <a class="btn btn-lg btn-primary me-2" href="/enterprise-edition">Learn more</a>
                    <a class="btn btn-lg btn-dark " href="/company/contact">Contact us</a>
                </div>
            </Section>
        </div>
    </div>

</template>

<script setup>
    import KeyOutline from "vue-material-design-icons/KeyOutline.vue"
    import MathLog from "vue-material-design-icons/MathLog.vue"
    import FormTextboxPassword from "vue-material-design-icons/FormTextboxPassword.vue"
</script>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main {
        background: $purple-7;
        color: var(--bs-white);

        .container {
            background: url("/landing/circle.png") no-repeat right center;
        }
        .card {
            background: $purple-10;
            box-shadow: $purple-9 !important;
            color: var(--bs-white);
            border: 1px solid $purple-11;

            .card-title {
                color: var(--bs-white);
            }
        }

        .accordion {
            #{--bs-accordion-bg}: $purple-10;
            #{--bs-accordion-color}: var(--bs-white);
            #{--bs-accordion-active-bg}: $purple-10;
            #{--bs-accordion-active-color}: var(--bs-white);
            #{--bs-accordion-border-color}: transparent;
            #{--bs-accordion-btn-color}: var(--bs-white);
        }

        .accordion-item {
            margin-bottom: $spacer;

            .accordion-header .accordion-button {
                font-weight: 800;
                font-size: $font-size-lg;

                &:after {
                    //background: $primary;
                    //color: var(--bs-white);
                }
            }
        }
    }
</style>