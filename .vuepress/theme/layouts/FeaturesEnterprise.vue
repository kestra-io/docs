<template>
    <div id="wrapper">
        <Chat />
        <Header />
        <div id="container">
            <main class="features-usage">
                <Breadcrumb :links="{'Features': undefined}" />

                <!-- Feature Start -->
                <section class="section bg-white overflow-hidden">
                    <div class="container">
                        <p class="mb-5" data-aos="fade-left">
                            Kestra can be used <strong>for free with no limitations</strong> on our Open Source Edition.
                            Companies need not more security & productivity so we create <strong>Enterprise
                            Edition</strong>.
                            This one is available on your own cloud or on premise like the Open Source Edition, as
                            simple to deploy,
                            <router-link to="/company/contact">contact us</router-link>
                            if you want more information. <br />
                            We are working hard to provide also you as software as service cloud. If you interested
                            <router-link to="">contact us</router-link>
                            to join our early access program.
                        </p>

                        <div class="row">
                            <div class="col-lg-4 col-md-6 col-12 mt-4 pt-2">
                                <div
                                    class="card pricing-rates business-rate shadow bg-light border-0 rounded">
                                    <div class="card-body">
                                        <h6 class="title font-weight-bold text-uppercase text-primary mb-4">
                                            Open Source
                                        </h6>
                                        <div class="price h1 text-muted">
                                            Always free
                                        </div>
                                        <ul class="list-unstyled mb-0 pl-0">
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Scalable orchestrator
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Scalable scheduler
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Rich <router-link to="/docs/user-interface-guide/">user interface</router-link>
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                <router-link to="/plugins/">Plugin</router-link> ecosystem
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Extended API
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                <router-link to="/docs/terraform/">Terraform</router-link> integration
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                No limitation on usage
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Community support
                                            </li>
                                        </ul>
                                        <div class="text-center">
                                            <router-link to="/docs/getting-started" class="btn btn-primary mt-4">Getting started</router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 col-12 mt-4 pt-2">
                                <div
                                    class="card pricing-rates business-rate shadow bg-light border-0 rounded">
                                    <div class="card-body">
                                        <h6 class="title font-weight-bold text-uppercase text-primary mb-4">Enterprise Edition</h6>
                                        <div class="price h1 text-muted">
                                            Custom pricing
                                        </div>
                                        <ul class="list-unstyled mb-0 pl-0">
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Open Source Edition
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Authentification with <router-link to="/docs/administrator-guide/configuration/enterprise-edition/authentifications/auths/oidc">OIDC/SSO</router-link>
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Fine-grained, Role-based access control
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Namespace configuration and security
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Integration with <router-link to="/docs/administrator-guide/configuration/enterprise-edition/secrets/">secret manager</router-link>
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Audits logs
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Editor autocompletion
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Executions dashboard
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                <router-link to="/docs/administrator-guide/configuration/enterprise-edition/workers/">Worker security</router-link> isolation
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Best-in-class support
                                            </li>
                                        </ul>
                                        <div class="text-center">
                                            <router-link to="/company/contact" class="btn btn-primary mt-4">Contact us</router-link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-6 col-12 mt-4 pt-2">
                                <div
                                    class="card pricing-rates business-rate shadow bg-light border-0 rounded">
                                    <div class="ribbon ribbon-right ribbon-warning overflow-hidden">
                                        <span class="text-center d-block shadow small h6">Soon</span>
                                    </div>
                                    <div class="card-body">
                                        <h6 class="title font-weight-bold text-uppercase text-primary mb-4">Kestra Cloud</h6>
                                        <div class="price h1 text-muted">
                                            Coming soon
                                        </div>
                                        <ul class="list-unstyled mb-0 pl-0">
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Enterprise Edition
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Fully managed by Kestra Expert
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Transparent upgrade
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Available on multiple cloud providers and regions
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Bring your own cloud
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                No infrastructure to manage
                                            </li>
                                            <li class="h6 text-muted mb-0">
                                                <CheckCircleOutline class="text-success mr-2" title="" />
                                                Best-in-class support
                                            </li>
                                        </ul>
                                        <div class="text-center">
                                            <a href="https://form.typeform.com/to/iAnFetZr" target="_blank" class="btn btn-primary mt-4">Request early access</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-bg" />
                </section>


                <section class="section pt-1 overflow-hidden">
                    <div class="container mb-md-5 mb-4 mt-5">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title">
                                    <h4 class="title mb-4" data-aos="fade-left">
                                        Want more information?
                                    </h4>
                                    <h5 class="text-muted para-desc mx-auto mb-0" data-aos="fade-right">
                                        Get in touch with our team and we will assist you in meeting your business’s needs.
                                    </h5>

                                    <div class="mt-4">
                                        <router-link to="/company/contact" class="btn btn-primary mt-2 mr-2" data-aos="zoom-in">
                                            <Mail title="" />
                                            Let's chat
                                            <ArrowRight title="" />
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
        <Footer />
    </div>
</template>

<script>

import Header from "../components/Header";
import Footer from "../components/Footer";
import Shape from "../components/layout/Shape";
import Breadcrumb from "../components/layout/Breadcrumb"
import ChevronRight from 'vue-material-design-icons/ChevronRight'
import CheckCircleOutline from 'vue-material-design-icons/CheckCircleOutline'
import ArrowRight from "vue-material-design-icons/ArrowRight";
import Mail from "vue-material-design-icons/Mail";
import AOS from "aos";
import Chat from "../components/layout/Chat";

export default {
    components: {
        Header,
        Footer,
        Breadcrumb,
        Shape,
        ChevronRight,
        CheckCircleOutline,
        ArrowRight,
        Mail,
        Chat,
    },
    mounted() {
        AOS.init({startEvent: "load"});
        AOS.refresh();
    }
}
</script>

<style lang="scss">
@import '../styles/index';

.features-usage {
    .features {
        background-color: transparent;
    }

    a.content {
        display: inline-block;

        h5 {
            color: $primary;
        }
    }
}

.pricing-rates {
    position: relative;
    z-index: 1;
    border-bottom: 3px solid $tertiary !important;
    -webkit-transition: all 0.5s ease;
    transition: all 0.5s ease;

    &:hover {
        transform: scale(1.03);
        z-index: 2;
        border-color: $secondary !important;
        box-shadow: 0 5px 13px rgba(60, 72, 88, 0.2) !important;
    }

    .price {
        font-weight: 400;
    }

    ul li {
        padding-left: 30px;

        .material-design-icon {
            position: relative;
            margin-left: -30px;
        }
    }
}
</style>
