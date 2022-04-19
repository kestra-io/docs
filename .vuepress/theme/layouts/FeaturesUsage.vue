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
                        <p class="text-center mb-5" data-aos="fade-left">
                            Thanks to its robust and flexible <strong>plugin architecture</strong>, Kestra can be used for a <strong>variety of use cases</strong>;
                            <router-link to="/plugins/">find a plugin</router-link> that suits your needs or <router-link to="/docs/plugin-developer-guide/">build one easily</router-link>.<br />
                            Here are examples to give you some ideas but feel free to use your imagination and create your own.
                        </p>
                        <div class="row">
                            <div class="col-md-4 col-12 mt-5 mt-md-0">
                                <div class="features" data-aos="fade-right">
                                    <div class="image position-relative d-inline-block">
                                        <SiteMap class="text-primary h1" title="" />
                                    </div>

                                    <div class="content mt-4">
                                        <a class="h5" href="#seamless-data-pipeline">Seamless data pipeline</a>
                                        <p class="text-secondary mb-0"></p>
                                    </div>
                                </div>
                            </div><!--end col-->

                            <div class="col-md-4 col-12 mt-5 mt-md-0">
                                <div class="features" data-aos="fade-up">
                                    <div class="image position-relative d-inline-block">
                                        <CalendarClockOutline class="text-primary h1" title="" />
                                    </div>

                                    <div class="content mt-4">
                                        <a class="h5" href="#distributed-automation-schedule">Distributed automation and scheduling</a>
                                        <p class="text-secondary mb-0"></p>
                                    </div>
                                </div>
                            </div><!--end col-->

                            <div class="col-md-4 col-12 mt-5 mt-md-0">
                                <div class="features" data-aos="fade-left">
                                    <div class="image position-relative d-inline-block">
                                        <ServerNetwork class="text-primary h1" title="" />
                                    </div>

                                    <div class="content mt-4">
                                        <a class="h5" href="#heavy-workload">Delegate heavy workloads</a>
                                        <p class="text-secondary mb-0"></p>
                                    </div>
                                </div>
                            </div><!--end col-->
                        </div>
                        <!--end row-->
                    </div>
                    <Shape class="text-dark" />
                </section>

                <a id="seamless-data-pipeline" />
                <section class="section bg-dark pt-1 overflow-hidden">
                    <div class="container mt-5">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <img src="../assets/features/dashboard.png" class="img-fluid shadow-lg rounded" alt="" data-aos="fade-right" data-aos-anchor-placement="top-bottom" />
                            </div>

                            <div class="col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div class="section-title ml-lg-5">
                                    <h4 class="title mb-4 mt-4 mt-md-0 text-white" data-aos="fade-left">
                                        Seamless Data pipeline
                                    </h4>
                                    <p class="text-white" data-aos="fade-right">
                                        Due to its wide range of plugins and the architecture that supports any size of data, Kestra allows you to create complex data pipelines with ease.
                                        Some examples of what you can expect from Kestra are:
                                    </p>
                                    <p class="text-secondary mb-0" data-aos="fade-left">Examples:</p>
                                    <ul class="list-unstyled text-secondary">
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="100">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Importing data into your data warehouse from many built-in sources and connectors (database, sftp, bucket, ...)
                                        </li>
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="200">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Preparing, validating, and aggregating your raw data to create a consolidated data mart.
                                        </li>
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="300">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Exporting from your data warehouse to your applications, SaaS providers or partners.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-bg" />
                </section>

                <a id="distributed-automation-schedule" />
                <section class="section pt-1 overflow-hidden">
                    <div class="container mt-5">
                        <div class="row align-items-center">
                            <div
                                class="col-md-6 order-2 order-md-1 mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div class="section-title mr-lg-5">
                                    <h4 class="title mb-4 mt-4 mt-md-0" data-aos="fade-right">
                                        Distributed automation and scheduling
                                    </h4>
                                    <p data-aos="fade-left">
                                        Kestra can be used as a crontab alternative and removes your single point of failure to a distributed crontab in addition to a central UI to give a full insight of all jobs, logs, and failed attempts.
                                    </p>
                                    <p class="text-secondary mb-0" data-aos="fade-right">Examples:</p>
                                    <ul class="list-unstyled text-secondary">
                                        <li class="mb-0" data-aos="fade-right" data-aos-delay="100">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Admin tasks such as backup, daily export, archive, and more
                                        </li>
                                        <li class="mb-0" data-aos="fade-right" data-aos-delay="200">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Maintenance without the stress of having to do it manually
                                        </li>
                                        <li class="mb-0" data-aos="fade-right" data-aos-delay="300">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Business processes that are triggered manually, create a flow, and just launch an execution
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-6 order-1 order-md-2">
                                <img src="../assets/features/executions-logs.png" class="img-fluid shadow-lg rounded" alt="" data-aos="fade-left" data-aos-anchor-placement="top-bottom" />
                            </div>
                        </div>
                    </div>
                    <Shape class="text-dark" />
                </section>

                <a id="heavy-workload" />
                <section class="section bg-white pt-1 bg-dark overflow-hidden">
                    <div class="container mt-5">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <img src="../assets/features/logs.png" class="img-fluid shadow-lg rounded" alt="" data-aos="fade-right" data-aos-anchor-placement="top-bottom" />
                            </div>
                            <div class="col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div class="section-title ml-lg-5">
                                    <h4 class="title mb-4 mt-4 mt-md-0 text-white" data-aos="fade-left">
                                        Delegate heavy workload
                                    </h4>
                                    <p class="text-white" data-aos="fade-right">
                                        Thanks to the rich API, you can trigger any execution directly from your backend and follow the execution.<br />
                                        Imagine a really slow and compute-intensive process on your application server. Trigger a Kestra execution, follow it directly from your server in real time, and give real-time feedback to your end users.
                                        Don't scale your application server; let Kestra scale it for you.
                                    </p>
                                    <p class="text-secondary mb-0" data-aos="fade-left">Examples:</p>
                                    <ul class="list-unstyled text-secondary">
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="100">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Synchronization of multiple microservices that function together through a single tool.
                                        </li>
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="200">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Large compute-intensive work such as the generation of many documents or archive creation.
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-bg" />
                </section>

                <section class="section pt-1 overflow-hidden">
                    <div class="container pb-lg-4 mb-md-5 mb-4 mt-5">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title">
                                    <h4 class="title mb-4" data-aos="fade-left">
                                        And many more use cases
                                    </h4>
                                    <h5 class="text-muted para-desc mx-auto mb-0" data-aos="fade-right">
                                        Start building with <span class="text-primary font-weight-bold">Kestra</span> and enjoy your pipelines — the only limit is your imagination.
                                    </h5>

                                    <div class="mt-4">
                                        <router-link to="/docs/getting-started" class="btn btn-primary mt-2 mr-2" data-aos="zoom-in">
                                            <PlayCircle title="" /> Get Started <ArrowRight title="" />
                                        </router-link>
                                        <router-link to="/docs" class="btn btn-outline-primary mt-2" data-aos="zoom-in" >
                                            <FileDocumentOutline title="" /> Read the docs <ArrowRight title="" />
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
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline";
import PlayCircle from "vue-material-design-icons/PlayCircle";
import SiteMap from "vue-material-design-icons/Sitemap";
import CalendarClockOutline from "vue-material-design-icons/CalendarClockOutline";
import ServerNetwork from "vue-material-design-icons/ServerNetwork";
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
        FileDocumentOutline,
        PlayCircle,
        SiteMap,
        CalendarClockOutline,
        ServerNetwork,
        Chat
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
</style>
