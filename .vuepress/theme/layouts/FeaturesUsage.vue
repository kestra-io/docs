<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main class="features-usage">
                <Breadcrumb :links="{'Features': undefined}" />

                <!-- Feature Start -->
                <section class="section bg-white overflow-hidden">
                    <div class="container">
                        <p class="text-center mb-5" data-aos="fade-left">
                            Kestra can be used for <strong>many use cases</strong> thanks to the <strong>plugin architecture</strong>.
                            <router-link to="/plugins/">Find a plugin</router-link> to handle your need and <router-link to="/docs/plugin-developer-guide/">build one easily</router-link>.<br />
                            Here is some examples that let you understand some of them, but fell free to imagine others one.
                        </p>
                        <div class="row">
                            <div class="col-md-4 col-12 mt-5 mt-md-0">
                                <div class="features" data-aos="fade-right">
                                    <div class="image position-relative d-inline-block">
                                        <SiteMap class="text-primary h1" title="" />
                                    </div>

                                    <div class="content mt-4">
                                        <a class="h5" href="#seamless-data-pipeline">Seamless Data pipeline</a>
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
                                        <a class="h5" href="#distributed-automation-schedule">Distributed automation & schedule</a>
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
                                        <a class="h5" href="#heavy-workload">Delegate heavy workload</a>
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
                                <img src="../assets/features/cloud.jpg" class="img-fluid shadow-lg rounded" alt="" data-aos="fade-right" data-aos-anchor-placement="top-bottom" />
                            </div>

                            <div class="col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div class="section-title ml-lg-5">
                                    <h4 class="title mb-4 mt-4 mt-md-0 text-white" data-aos="fade-left">
                                        Seamless Data pipeline
                                    </h4>
                                    <p class="text-white" data-aos="fade-right">
                                        Due to its wide range of plugins and the architecture that support any size of
                                        data, Kestra allow to create complex data pipeline with ease, some examples are :
                                    </p>
                                    <p class="text-secondary mb-0" data-aos="fade-left">Examples:</p>
                                    <ul class="list-unstyled text-secondary">
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="100">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Import data into your Data wharehouse from many built-in sources & connectors (database, sftp, bucket, ...)
                                        </li>
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="200">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Prepare, validate & aggregate your raw data to create a consolidated datamart.
                                        </li>
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="300">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Export from your Data wharehouse to yours applications, saas providers or partners.
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
                                        Distributed automation & schedule
                                    </h4>
                                    <p data-aos="fade-left">
                                        Kestra can be used as remplacement of crontab easily and remove your single
                                        point of failure to distributed crontab. With a plus, a central ui to have a
                                        full insight of all the jobs, logs and failures.
                                    </p>
                                    <p class="text-secondary mb-0" data-aos="fade-right">Examples:</p>
                                    <ul class="list-unstyled text-secondary">
                                        <li class="mb-0" data-aos="fade-right" data-aos-delay="100">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Admin task like backup, daily export, archive, ...
                                        </li>
                                        <li class="mb-0" data-aos="fade-right" data-aos-delay="200">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Maintenance without the pain to handle it manually
                                        </li>
                                        <li class="mb-0" data-aos="fade-right" data-aos-delay="300">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Business process that is triggered manually, create a flow and just launch execution
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-6 order-1 order-md-2">
                                <img src="../assets/features/data.jpg" class="img-fluid shadow-lg rounded" alt="" data-aos="fade-left" data-aos-anchor-placement="top-bottom" />
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
                                <img src="../assets/features/heavy.jpg" class="img-fluid shadow-lg rounded" alt="" data-aos="fade-right" data-aos-anchor-placement="top-bottom" />
                            </div>
                            <div class="col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
                                <div class="section-title ml-lg-5">
                                    <h4 class="title mb-4 mt-4 mt-md-0 text-white" data-aos="fade-left">
                                        Delegate heavy workload
                                    </h4>
                                    <p class="text-white" data-aos="fade-right">
                                        Thanks to rich Api, you can trigger any execution directly from your backend and follow the execution. <br />
                                        Imagine some really slow & compute intensive process on your application server, trigger a Kestra execution, follow it directly from your server in real time and give real time feedback to your end users.
                                        Don't scale your application server and let Kestra scale it for you.
                                    </p>
                                    <p class="text-secondary mb-0" data-aos="fade-left">Examples:</p>
                                    <ul class="list-unstyled text-secondary">
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="100">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Synchronization between lots of microservice needed to wait for others responses.
                                        </li>
                                        <li class="mb-0" data-aos="fade-left" data-aos-delay="200">
                                            <CheckCircleOutline class="text-success mr-2" title="" />
                                            Large compute intensive work like generation of many documents or archive creation.
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
                                        And many more use case
                                    </h4>
                                    <h5 class="text-muted para-desc mx-auto mb-0" data-aos="fade-right">
                                        Start building with <span class="text-primary font-weight-bold">Kestra</span> and
                                        enjoy yours pipelines, the only limit is your imagination.
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
        ServerNetwork
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
