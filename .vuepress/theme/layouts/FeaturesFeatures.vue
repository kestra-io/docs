<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main class="features-usage">
                <Breadcrumb :links="{'Features': undefined}" />

                <section class="section overflow-hidden">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">Ship faster</h4>
                                    <p data-aos="fade-right">Save time, complexity, and development costs.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 col-12 mt-5 mt-md-0">
                                <div class="features" data-aos="fade-right">
                                    <div class="image position-relative d-inline-block">
                                        <MonitorMultiple class="text-primary h1" title="" />
                                    </div>

                                    <div class="content mt-4">
                                        <h5>Full platform for end to end workflows</h5>
                                        <p class="text-secondary mb-0">Use all the tools to be able to delivered entreprise grade workflow in autonomy.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4 col-12 mt-5 mt-md-0">
                                <div class="features" data-aos="fade-top">
                                    <div class="image position-relative d-inline-block">
                                        <Web class="text-primary h1" title="" />
                                    </div>

                                    <div class="content mt-4">
                                        <h5>Live edit in the browser</h5>
                                        <p class="text-secondary mb-0">No desktop application installation needed, a <router-link to="/docs/user-interface-guide/">simple browser to edit & monitor</router-link> all your flows.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4 col-12 mt-5 mt-md-0">
                                <div class="features" data-aos="fade-left">
                                    <div class="image position-relative d-inline-block">
                                        <Terraform class="text-primary h1" title="" />
                                    </div>

                                    <div class="content mt-4">
                                        <h5>Create your flow with Terraform</h5>
                                        <p class="text-secondary mb-0"><router-link to="/docs/terraform/">Deploy Kestra</router-link> flows as your cloud dependencies for atomic release process.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-dark" />
                </section>

                <section class="section bg-dark text-white overflow-hidden">
                    <div class="container mt-100 mt-60">
                        <div class="row align-items-center">
                            <div class="col-lg-5 order-2 order-lg-1 mt-4 pt-2 mt-lg-0 pt-lg-0">
                                <div class="section-title mr-lg-4">
                                    <h1 class="title mb-3" data-aos="fade-right">An orchestrator platform</h1>
                                    <p class="para-desc text-muted" data-aos="fade-left">
                                        Build complex pipeline in couple of minutes.
                                    </p>

                                    <div class="row">
                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <DotsHexagon title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>Any kind of flows !</h5>
                                                    <p class="text-muted mb-0">
                                                        Kestra understand the logic of your flow and handle <router-link to="/docs/developer-guide/flowable/">any workflow</router-link> with parallel, loop, depending flows, ...
                                                        System have failures, and let Kestra handle the <router-link to="/docs/developer-guide/retries/">retry</router-link>, timeout, ... that could happen.

                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <GoogleCirclesExtended title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>Any plugins !</h5>
                                                    <p class="text-muted mb-0">
                                                        Plugins offers deep integration with systems allowing to make complex workflows without relying command line.
                                                        <router-link to="/plugins/">Use official one</router-link> or <router-link to="/docs/plugin-developer-guide/">build your own</router-link> easily!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <OpenInNew title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>Cloud native & scalable !</h5>
                                                    <p class="text-muted mb-0">
                                                        Kestra is build with around top cloud native technologies and a <router-link to="/docs/architecture/">strong architecture</router-link>! Scale to million of executions without the pain.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-7 order-1 order-lg-2">
                                <div class="saas-feature-shape-right position-relative">
                                    <img
                                        src="../assets/features/world.jpg"
                                        class="img-fluid mx-auto d-block rounded shadow"
                                        alt=""
                                        data-aos="fade-left"
                                        data-aos-anchor-placement="top-bottom"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-bg" />
                </section>

                <section class="section overflow-hidden">
                    <div class="container mt-100 mt-60">
                        <div class="row align-items-center">
                            <div class="col-lg-7">
                                <div class="saas-feature-shape-left position-relative">
                                    <img
                                        src="../assets/features/clock.jpg"
                                        class="img-fluid mx-auto d-block rounded shadow"
                                        alt=""
                                        data-aos="fade-right"
                                        data-aos-anchor-placement="top-bottom"
                                    />
                                </div>
                            </div>

                            <div class="col-lg-5 mt-4 pt-2 mt-lg-0 pt-lg-0">
                                <h1 class="title mb-3">An scheduler platform</h1>
                                <p class="para-desc text-muted">
                                    Launch your flows whatever is your need!
                                </p>

                                <div class="row">
                                    <div class="col-12">
                                        <div class="d-flex pt-4" data-aos="fade-left">
                                            <h2>
                                                <Abacus title="" />
                                            </h2>
                                            <div class="ml-3">
                                                <h5>Event based!</h5>
                                                <p class="text-muted mb-0">
                                                    Kestra can execute flows based on events coming from core or plugins like :

                                                </p>
                                                <ul class="text-muted mb-0">
                                                    <li><router-link to="/docs/developer-guide/triggers/flow.html">result of others flows</router-link> in real time</li>
                                                    <li>detection of file <router-link to="/plugins/plugin-fs/triggers/sftp/io.kestra.plugin.fs.sftp.Trigger.html">from an SFTP</router-link> or <router-link to="/plugins/plugin-gcp/triggers/gcs/io.kestra.plugin.gcp.gcs.Trigger.html">Google Cloud Storage</router-link></li>
                                                    <li>result of a <router-link to="/plugins/plugin-gcp/triggers/bigquery/io.kestra.plugin.gcp.bigquery.Trigger.html">sql query</router-link></li>
                                                    <li>...</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <div class="d-flex pt-4" data-aos="fade-left">
                                            <h2>
                                                <CalendarClockOutline title="" />
                                            </h2>
                                            <div class="ml-3">
                                                <h5>Time based scheduling!</h5>
                                                <p class="text-muted mb-0">
                                                    Or execute <router-link to="/docs/developer-guide/triggers/schedule.html">at regular interval</router-link> your flows based on cron expression.
                                                    You have more complex need, rely on <router-link to="/docs/developer-guide/triggers/schedule.html#schedule-conditions">conditions</router-link> to limit the scheduling of your flows like <router-link to="/plugins/core/conditions/io.kestra.core.models.conditions.types.DayWeekInMonthCondition.html">first month of the month</router-link>, <router-link to="/plugins/core/conditions/io.kestra.core.models.conditions.types.WeekendCondition.html">weekend only</router-link>, ...
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <div class="d-flex pt-4" data-aos="fade-left">
                                            <h2>
                                                <Api title="" />
                                            </h2>
                                            <div class="ml-3">
                                                <h5>Api or UI based !</h5>
                                                <p class="text-muted mb-0">
                                                    Don't find your needs, you can still rely on <router-link to="/docs/developer-guide/inputs/#send-inputs-programmatically">Kestra API</router-link> (a simple curl can do the job), <router-link to="/docs/developer-guide/triggers/webhook.html">webhook</router-link> to trigger a flow from any application or simply start it directly from the Web UI !
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-dark" />
                </section>

                <section class="section overflow-hidden bg-dark text-white overflow-hidden">
                    <div class="container mt-100 mt-60">
                        <div class="row align-items-center">
                            <div class="col-lg-7 order-2 order-lg-1 mt-4 pt-2 mt-lg-0 pt-lg-0">
                                <div class="section-title mr-lg-4">
                                    <h1 class="title mb-3">A extensible data orchestrator</h1>
                                    <p class="para-desc text-muted">
                                        Kestra is build with <strong>data at heart</strong> and integrate <strong>directly</strong> with your source & destination, no need to choose <strong>between ETL or ELT</strong>, both are possible.
                                    </p>

                                    <div class="row">
                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <DotsHexagon title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>ETL or ELT!</h5>
                                                    <p class="text-muted mb-0">
                                                        Never choose again between ELT or ETL! Kestra handle both at scale.
                                                        Choose the method you need : convert from
                                                        <router-link to="/plugins/plugin-serdes/tasks/csv/io.kestra.plugin.serdes.csv.CsvReader.html">standard</router-link> <router-link to="/plugins/plugin-serdes/tasks/avro/io.kestra.plugin.serdes.avro.AvroWriter.html">format</router-link>,
                                                        use task to <router-link to="/plugins/plugin-script-nashorn/tasks/io.kestra.plugin.scripts.nashorn.FileTransform.html">transform data directly</router-link> or
                                                        load <router-link to="/plugins/plugin-jdbc-postgres/tasks/l/io.kestra.plugin.jdbc.postgresql.CopyIn.html">raw data</router-link> and let the database do the hard work.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <GoogleCirclesExtended title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>Directly connected to systems!</h5>
                                                    <p class="text-muted mb-0">
                                                        Plugins offers rich integrations with all the underlying systems, get rich outputs, gather metrics for all tasks executed
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <OpenInNew title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>Cloud native & scalable !</h5>
                                                    <p class="text-muted mb-0">
                                                        Kestra is build with around top cloud native technologies and a <router-link to="/docs/architecture/">strong architecture</router-link>! Scale to million of executions without the pain.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-5 order-1 order-lg-2">
                                <div class="saas-feature-shape-right position-relative">
                                    <img
                                        src="../assets/features/world-connected.jpg"
                                        class="img-fluid mx-auto d-block rounded shadow"
                                        alt=""
                                        data-aos="fade-left"
                                        data-aos-anchor-placement="top-bottom"
                                    />
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
                                        And many more use developing plugins !
                                    </h4>
                                    <h5 class="text-muted para-desc mx-auto mb-0" data-aos="fade-right" >
                                        Start building with <span class="text-primary font-weight-bold">Kestra</span> and
                                        enjoy yours pipelines, the only limit is your imagination.
                                    </h5>

                                    <div class="mt-4">
                                        <router-link to="/docs/getting-started" class="btn btn-primary mt-2 mr-2" data-aos="zoom-in">
                                            <PlayCircle title="" /> Get Started <ArrowRight title="" />
                                        </router-link>
                                        <router-link to="/docs" class="btn btn-outline-primary mt-2" data-aos="zoom-in">
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
import { ArrowUpIcon, ShieldIcon, CpuIcon, VideoIcon } from "vue-feather-icons";
import MonitorMultiple from "vue-material-design-icons/MonitorMultiple";
import Web from "vue-material-design-icons/Web";
import Terraform from "vue-material-design-icons/Terraform";

import CalendarClockOutline from "vue-material-design-icons/CalendarClockOutline"
import Api from "vue-material-design-icons/Api"
import Abacus from "vue-material-design-icons/Abacus"
import DotsHexagon from "vue-material-design-icons/DotsHexagon";
import GoogleCirclesExtended from "vue-material-design-icons/GoogleCirclesExtended";
import OpenInNew from "vue-material-design-icons/OpenInNew";
import ArrowRight from "vue-material-design-icons/ArrowRight";
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline";
import PlayCircle from "vue-material-design-icons/PlayCircle";
import AOS from "aos";

export default {
    components: {
        Header,
        Footer,
        Breadcrumb,
        Shape,
        ArrowUpIcon,
        ShieldIcon,
        CpuIcon,
        VideoIcon,
        MonitorMultiple,
        Web,
        Terraform,
        CalendarClockOutline,
        Api,
        Abacus,
        DotsHexagon,
        GoogleCirclesExtended,
        OpenInNew,
        ArrowRight,
        FileDocumentOutline,
        PlayCircle,
    },
    mounted() {
        AOS.init()
    }
}
</script>

<style lang="scss">
@import '../styles/index';

.features-usage {
    .features {
        background-color: transparent;
    }

    img {
        position: relative;
        z-index: 1;
    }

    .saas-feature-shape-left {
        &::after {
            z-index: 0;
            background: rgba($secondary, 0.1);
        }
    }

    a.content {
        display: inline-block;

        h5 {
            color: $primary;
        }
    }
}
</style>
