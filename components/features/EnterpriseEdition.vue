<template>
    <div class="main">
        <div class="container">
            <Section subtitle="Security and high availability" title="Take Kestra to the next level with the Enterprise Edition 🚀">
                <div class="row mb-5">
                    <div class="col-md-6">
                        <div class="accordion" id="ee-collapse">
                            <div class="accordion-item" data-aos="fade-right">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        Scale with no point of failure with Kafka and ElasticSearch
                                    </button>
                                </h2>
                                <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#ee-collapse">
                                    <div class="accordion-body">
                                        Ensure scalability and high availability with Kafka and ElasticSearch Features available on the Enterprise Edition to eliminate all points of failure. Kestra's architecture is designed to handle high volumes of data and to ensure that workflows are processed reliably by default.
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item" data-aos="fade-right">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        SSO/OIDC and RBAC
                                    </button>
                                </h2>
                                <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#ee-collapse">
                                    <div class="accordion-body">
                                        Secure your Kestra cluster with a single sign-on using your Open ID provider and control user and group access with fine-grained ACL.
                                    </div>
                                </div>
                            </div>
                            <div class="accordion-item" data-aos="fade-right">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        Configuration management for the company
                                    </button>
                                </h2>
                                <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#ee-collapse">
                                    <div class="accordion-body">
                                        Configure a namespace with task defaults, variables, and secrets to automatically configure all flows.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <img src="/landing/features/ee.svg" data-aos="fade-left" alt="A design of the features of Kestra's enterprise edition with SSO connection, Role Based Access Control, Kafka and Elasticsearch integration" class="img-fluid" />
                    </div>
                </div>
                <div class="row card-group mb-2">
                    <div class="col-md-4 mb-4">
                        <div class="card" data-aos="zoom-in">
                            <div class="card-body">
                                <span class="card-icon"><KeyOutline /></span>
                                <h4 class="card-title">Service account</h4>
                                <p class="card-text">Create service accounts allowing to trigger workflows for external systems.</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card" data-aos="zoom-in">
                            <div class="card-body">
                                <span class="card-icon"><MathLog /></span>
                                <h4 class="card-title">Secrets</h4>
                                <p class="card-text">Integrate your secret manager to ensure the security of your passwords and keys.</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card" data-aos="zoom-in">
                            <div class="card-body">
                                <span class="card-icon"><FormTextboxPassword /></span>
                                <h4 class="card-title">Audit Log</h4>
                                <p class="card-text">Audit all the resources created in one instance.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <NuxtLink class="btn btn-lg btn-primary me-2" href="/enterprise" data-aos="zoom-in">Learn more</NuxtLink>
                    <NuxtLink class="btn btn-lg btn-dark " href="/contact-us" data-aos="zoom-in">Contact us</NuxtLink>
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
            #{--bs-accordion-btn-icon}: url("data:image/svg+xml,%3Csvg%20width%3D%2234%22%20height%3D%2235%22%20viewBox%3D%220%200%2034%2035%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20x%3D%220.36084%22%20y%3D%220.59375%22%20width%3D%2233.4883%22%20height%3D%2233.4883%22%20rx%3D%224%22%20fill%3D%22%23753DF3%22%2F%3E%0A%3Cpath%20d%3D%22M23.105%2018.3379H18.105V23.3379C18.105%2023.8879%2017.655%2024.3379%2017.105%2024.3379C16.555%2024.3379%2016.105%2023.8879%2016.105%2023.3379V18.3379H11.105C10.555%2018.3379%2010.105%2017.8879%2010.105%2017.3379C10.105%2016.7879%2010.555%2016.3379%2011.105%2016.3379H16.105V11.3379C16.105%2010.7879%2016.555%2010.3379%2017.105%2010.3379C17.655%2010.3379%2018.105%2010.7879%2018.105%2011.3379V16.3379H23.105C23.655%2016.3379%2024.105%2016.7879%2024.105%2017.3379C24.105%2017.8879%2023.655%2018.3379%2023.105%2018.3379Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A");
            #{--bs-accordion-btn-active-icon}: url("data:image/svg+xml,%3Csvg%20width%3D%2234%22%20height%3D%2235%22%20viewBox%3D%220%200%2034%2035%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Crect%20x%3D%220.36084%22%20y%3D%220.873047%22%20width%3D%2233.4883%22%20height%3D%2233.4883%22%20rx%3D%224%22%20fill%3D%22%23753DF3%22%2F%3E%0A%3Cpath%20d%3D%22M11.105%2016.6172H23.105V18.6172H11.105V16.6172Z%22%20fill%3D%22white%22%2F%3E%0A%3C%2Fsvg%3E%0A");
        }

        .accordion-item {
            margin-bottom: $spacer;

            .accordion-header .accordion-button {
                font-weight: 800;
                font-size: $font-size-lg;

                &:focus {
                    box-shadow: none;
                }
            }


            .accordion-body {
                position: relative;
                &:before {
                    position: absolute;
                    content: '';
                    height: 1px;
                    width: calc(100% - (var(--bs-accordion-body-padding-y) * 2));
                    border-top: 1px solid $purple-11;
                    margin-top: -1rem;
                }
            }
        }
    }
</style>