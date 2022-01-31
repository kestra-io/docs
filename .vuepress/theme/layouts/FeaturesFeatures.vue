<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main class="features-usage">
                <Breadcrumb :links="{'Features': undefined}" />


                <section class="section overflow-hidden">
                    <div class="container mt-100 mt-60">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">An orchestration platform</h4>
                                    <p data-aos="fade-right">
                                        Build a complex pipeline within a couple of minutes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="row align-items-center">
                            <div class="col-lg-5 order-2 order-lg-1 mt-4 pt-2 mt-lg-0 pt-lg-0">
                                <div class="section-title mr-lg-4">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <DotsHexagon title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>All kinds of flows!</h5>
                                                    <p class="text-muted mb-0">
                                                        Kestra understands the construction of your flow and handles <router-link to="/docs/developer-guide/flowable/">any workflow</router-link> with parallel, loop dependent flows.
                                                        Systems can fail; let Kestra handle <router-link to="/docs/developer-guide/retries/">the retry process.</router-link>
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
                                                    <h5>All plugins!</h5>
                                                    <p class="text-muted mb-0">
                                                        Plugins offer deep integration with systems enabling users to make complex workflows without relying on the command line.
                                                        <router-link to="/plugins/">Use an official one</router-link> or <router-link to="/docs/plugin-developer-guide/">simply build your own!</router-link>
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
                                                    <h5>Cloud native and scalable!</h5>
                                                    <p class="text-muted mb-0">
                                                        Kestra has been built with leading cloud-native technologies and a <router-link to="/docs/architecture/">strong architecture</router-link>! Scale to millions of executions without hassle.
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
                                        src="../assets/features/topology.png"
                                        class="img-fluid mx-auto d-block"
                                        alt=""
                                        data-aos="fade-left"
                                        data-aos-anchor-placement="top-bottom"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-dark" />
                </section>

                <section class="section bg-dark text-white overflow-hidden">
                    <div class="container mt-100 mt-60">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">A scheduling platform</h4>
                                    <p data-aos="fade-right">
                                        Launch your flows whatever the need
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="row align-items-center">
                            <div class="col-lg-7">
                                <div class="saas-feature-shape-left position-relative">
                                    <img
                                        src="../assets/features/flows.png"
                                        class="img-fluid mx-auto d-block rounded shadow"
                                        alt=""
                                        data-aos="fade-right"
                                        data-aos-anchor-placement="top-bottom"
                                    />
                                </div>
                            </div>

                            <div class="col-lg-5 mt-4 pt-2 mt-lg-0 pt-lg-0">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="d-flex pt-4" data-aos="fade-left">
                                            <h2>
                                                <Abacus title="" />
                                            </h2>
                                            <div class="ml-3">
                                                <h5>Event based</h5>
                                                <p class="text-muted mb-0">
                                                    Kestra can execute flows based on events coming from core or plugins such as:

                                                </p>
                                                <ul class="text-muted mb-0">
                                                    <li><router-link to="/docs/developer-guide/triggers/flow.html">result of others flows</router-link> in real time</li>
                                                    <li>detection of files <router-link to="/plugins/plugin-fs/triggers/sftp/io.kestra.plugin.fs.sftp.Trigger.html">from an SFTP</router-link> or <router-link to="/plugins/plugin-gcp/triggers/gcs/io.kestra.plugin.gcp.gcs.Trigger.html">Google Cloud Storage</router-link></li>
                                                    <li>results of a <router-link to="/plugins/plugin-gcp/triggers/bigquery/io.kestra.plugin.gcp.bigquery.Trigger.html">SQL query</router-link></li>
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
                                                <h5>Time-based scheduling!</h5>
                                                <p class="text-muted mb-0">
                                                    Or execute your flows <router-link to="/docs/developer-guide/triggers/schedule.html">at regular intervals</router-link> based on a cron expression, if you
                                                    have more complex needs and rely on <router-link to="/docs/developer-guide/triggers/schedule.html#schedule-conditions">conditions</router-link> to limit the scheduling of your flows <router-link to="/plugins/core/conditions/io.kestra.core.models.conditions.types.DayWeekInMonthCondition.html">(e.g., first day of the month, weekend only, etc.).</router-link>, <router-link to="/plugins/core/conditions/io.kestra.core.models.conditions.types.WeekendCondition.html">weekend only</router-link>, ...
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
                                                <h5>API or UI based!</h5>
                                                <p class="text-muted mb-0">
                                                    f you haven’t found a suitable option, you can still rely on <router-link to="/docs/developer-guide/inputs/#send-inputs-programmatically">Kestra API</router-link> (a simple cURL can do the job), <router-link to="/docs/developer-guide/triggers/webhook.html">webhook</router-link> to trigger a flow from any application or simply start it directly from the Web UI.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-bg" />
                </section>

                <section class="section overflow-hidden overflow-hidden">
                    <div class="container mt-100 mt-60">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">An extensible data orchestrator</h4>
                                    <p data-aos="fade-right">
                                        Kestra is built with <strong>data at its heart</strong> and integrates <strong>directly</strong> with your source and destination; no need to choose <strong>between ETL or ELT</strong> — both are possible.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="row align-items-center">
                            <div class="col-lg-6 order-2 order-lg-1 mt-4 pt-2 mt-lg-0 pt-lg-0">
                                <div class="section-title mr-lg-4">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <DotsHexagon title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>ETL or ELT!</h5>
                                                    <p class="text-muted mb-0">
                                                        Don’t be left choosing between ETL or ELT — Kestra handles both at scale. Choose the method you need: convert from
                                                        <router-link to="/plugins/plugin-serdes/tasks/csv/io.kestra.plugin.serdes.csv.CsvReader.html">standard</router-link> <router-link to="/plugins/plugin-serdes/tasks/avro/io.kestra.plugin.serdes.avro.AvroWriter.html">format</router-link>,
                                                        , use task to <router-link to="/plugins/plugin-script-nashorn/tasks/io.kestra.plugin.scripts.nashorn.FileTransform.html">transform data directly</router-link>, or
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
                                                        Plugins offer rich integrations with all the underlying systems. Get rich outputs, gather metrics for all tasks executed.
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
                                                        Kestra is robust and built with the top <router-link to="/docs/architecture/">cloud-native technologies</router-link>! Scale to millions of executions hassle free.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 order-1 order-lg-2">
                                <div class="saas-feature-shape-right position-relative">
                                    <img
                                        src="../assets/features/gantt.png"
                                        class="img-fluid mx-auto d-block rounded shadow"
                                        alt=""
                                        data-aos="fade-left"
                                        data-aos-anchor-placement="top-bottom"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-dark" />
                </section>

                <section class="section bg-dark text-white overflow-hidden">
                    <div class="container mt-100 mt-60">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">An all-in-one platform</h4>
                                    <p data-aos="fade-right">
                                        Kestra is composed of a <strong>rich UI</strong> allowing you to <strong>create, run, and monitor</strong> all your flows. It has a <strong>full, scalable and cloud-native</strong> architecture, and <strong>based on plugins</strong> allowing you to use or create your own plugins with little fuss.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="row align-items-center">
                            <div class="col-lg-7">
                                <div class="saas-feature-shape-left position-relative">
                                    <video autoplay loop muted="" poster="/ui.gif" class="img-fluid">
                                        <source src="/video.m4v" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>

                            <div class="col-lg-5 mt-4 pt-2 mt-lg-0 pt-lg-0">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="d-flex pt-4" data-aos="fade-left">
                                            <h2>
                                                <Web title="" />
                                            </h2>
                                            <div class="ml-3">
                                                <h5>Rich and real-time UI</h5>
                                                <p class="text-muted mb-0">
                                                    Create and edit your flows <router-link to="/docs/user-interface-guide/">directly on your browser.</router-link> Execute and monitor all your executions in real time!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <div class="d-flex pt-4" data-aos="fade-left">
                                            <h2>
                                                <SchoolOutline title="" />
                                            </h2>
                                            <div class="ml-3">
                                                <h5>Low code</h5>
                                                <p class="text-muted mb-0">
                                                    Kestra flows are <router-link to="/docs/developer-guide/flow/">simple, descriptive YAML</router-link> files — No need to learn another language to create a flow!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <div class="d-flex pt-4" data-aos="fade-left">
                                            <h2>
                                                <OpenInNew title="" />
                                            </h2>
                                            <div class="ml-3">
                                                <h5>Cloud native and infinitely scalable</h5>
                                                <p class="text-muted mb-0">
                                                    Scale to millions of executions without the pain as Kestra is built on <router-link to="/docs/architecture/">cloud native and scalable</router-link> solutions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <div class="d-flex pt-4" data-aos="fade-left">
                                            <h2>
                                                <GoogleCirclesExtended title="" />
                                            </h2>
                                            <div class="ml-3">
                                                <h5>Easy to extend</h5>
                                                <p class="text-muted mb-0">
                                                    Plugins are everywhere in Kestra — many are available from <router-link to="/plugins/">Kestra core team</router-link>; creating your own is simple and also an option.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-white" />
                </section>

                <section class="section overflow-hidden bg-white">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">Prompt shipping</h4>
                                    <p data-aos="fade-right">Save on time, stress, and development costs.</p>
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
                                        <h5>Full platform for end-to-end workflows</h5>
                                        <p class="text-secondary mb-0">All the necessary tools and autonomy to deliver enterprise-grade workflows.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4 col-12 mt-5 mt-md-0">
                                <div class="features" data-aos="fade-top">
                                    <div class="image position-relative d-inline-block">
                                        <Web class="text-primary h1" title="" />
                                    </div>

                                    <div class="content mt-4">
                                        <h5>Live edit in browser</h5>
                                        <p class="text-secondary mb-0">No desktop application installation needed — a <router-link to="/docs/user-interface-guide/">simple browser to edit and monitor</router-link> all your flows.</p>
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
                                        <p class="text-secondary mb-0"><router-link to="/docs/terraform/">Deploy Kestra flows</router-link> and your cloud dependencies for atomic release processing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-dark" />
                </section>

                <section class="section overflow-hidden bg-dark text-white overflow-hidden">
                    <div class="container mt-100 mt-60">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">An Enterprise Edition</h4>
                                    <p data-aos="fade-right">The enterprise edition fits all company needs regarding security and productivity.y</p>
                                </div>
                            </div>
                        </div>
                        <div class="row align-items-center">
                            <div class="col-lg-7 order-2 order-lg-1 mt-4 pt-2 mt-lg-0 pt-lg-0">
                                <div class="mr-lg-4">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <ShieldLockOutline title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>SSO/OIDC and RBAC</h5>
                                                    <p class="text-muted mb-0">
                                                        Secure your Kestra with a single sign-on with your Open ID provider and control fine-grained ACL for users and groups.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <FileLockOutline title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>Audit Log and Secrets</h5>
                                                    <p class="text-muted mb-0">
                                                        Integrate your secret manager to ensure the security of your password and key, and audit all the resources created in one instance.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="col-12">
                                            <div class="d-flex pt-4" data-aos="fade-right">
                                                <h2>
                                                    <ViewDashboardOutline title="" />
                                                </h2>
                                                <div class="ml-3">
                                                    <h5>Improve your productivity</h5>
                                                    <p class="text-muted mb-0">
                                                        Configure a namespace with task defaults, variables, secrets to automatically configure all flows — follow them with the one eye dashboard!
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
                                        src="../assets/features/security-app.png"
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
                                        Endless options to choose from to develop your own plugins!
                                    </h4>
                                    <h5 class="text-muted para-desc mx-auto mb-0" data-aos="fade-right" >
                                        Start building with <span class="text-primary font-weight-bold">Kestra</span> and enjoy your pipelines — the only limit is your imagination!
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
import AOS from "aos";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Shape from "../components/layout/Shape";
import Breadcrumb from "../components/layout/Breadcrumb"
import { ArrowUpIcon, ShieldIcon, CpuIcon, VideoIcon } from "vue-feather-icons";
import MonitorMultiple from "vue-material-design-icons/MonitorMultiple";
import Terraform from "vue-material-design-icons/Terraform"
import CalendarClockOutline from "vue-material-design-icons/CalendarClockOutline"
import Api from "vue-material-design-icons/Api"
import Abacus from "vue-material-design-icons/Abacus"
import DotsHexagon from "vue-material-design-icons/DotsHexagon";
import GoogleCirclesExtended from "vue-material-design-icons/GoogleCirclesExtended";
import ArrowRight from "vue-material-design-icons/ArrowRight";
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline";
import PlayCircle from "vue-material-design-icons/PlayCircle";
import OpenInNew from "vue-material-design-icons/OpenInNew";
import Web from "vue-material-design-icons/Web";
import SchoolOutline from "vue-material-design-icons/SchoolOutline";
import ShieldLockOutline from "vue-material-design-icons/ShieldLockOutline";
import FileLockOutline from "vue-material-design-icons/FileLockOutline"
import ViewDashboardOutline from "vue-material-design-icons/ViewDashboardOutline"

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
        ArrowRight,
        FileDocumentOutline,
        PlayCircle,
        SchoolOutline,
        OpenInNew,
        ShieldLockOutline,
        FileLockOutline,
        ViewDashboardOutline
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
