<template>
    <div id="wrapper">
        <Chat />
        <Header />
        <div id="container">
            <main class="features-usage">
                <Breadcrumb />
                <section class="section pt-1 overflow-hidden">

                    <div class="container pb-lg-4 mb-md-5 mb-4 mt-5">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title">
                                    <h4 class="title mb-4" data-aos="fade-left">
                                        Join the Kestra
                                        <img src="../assets/home/slack.png" class="logo-slack" />
                                        Community
                                    </h4>
                                    <p data-aos="fade-right">
                                        Join the slack to share ideas and best practices, get help with technical questions, and discuss Kestra with other developers (and even the founders).
                                    </p>

                                    <div class="row">
                                        <div class="col-md-4 mt-4 pt-2">
                                            <div class="card work-process border-0 rounded shadow">
                                                <div class="card-body">

                                                    <a href="https://api.kestra.io/v1/communities/slack/redirect">
                                                        <h4 class="title">Ask a question</h4>
                                                        <p class="text-muted para">
                                                            Get stuck with the documentation, We´re here to help!
                                                        </p>

                                                        <ul class="list-unstyled d-flex justify-content-between mb-0 mt-2">
                                                            <li class="step h1 mb-0 font-weight-bold">#help</li>
                                                        </ul>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-4 mt-4 pt-2">
                                            <div class="card work-process border-0 rounded shadow">
                                                <div class="card-body">
                                                    <a href="https://api.kestra.io/v1/communities/slack/redirect">
                                                        <h4 class="title">Introduce yourself</h4>
                                                        <p class="text-muted para">
                                                            Welcome to the Kestra community! Let's introduce ourselves!
                                                        </p>

                                                        <ul class="list-unstyled d-flex justify-content-between mb-0 mt-2">
                                                            <li class="step h1 mb-0 font-weight-bold">#introductions</li>
                                                        </ul>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <!--end col-->

                                        <div class="col-md-4 mt-4 pt-2">
                                            <div class="card work-process border-0 rounded shadow">
                                                <div class="card-body">
                                                    <a href="https://api.kestra.io/v1/communities/slack/redirect">

                                                        <h4 class="title">Share Feedback</h4>
                                                        <p class="text-muted para">
                                                            Discussions about the product, including your feedback, ideas, and dreams.
                                                        </p>
                                                        <ul class="list-unstyled d-flex justify-content-between mb-0 mt-2">
                                                            <li class="step h1 mb-0 font-weight-bold">#feedback-and-requests</li>
                                                        </ul>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 mt-4 pt-4 text-center">
                                            <a
                                                href="https://api.kestra.io/v1/communities/slack/redirect"
                                                class="btn btn-primary"
                                                data-aos="zoom-in"
                                            >
                                                <slack title="" /> Join our Slack
                                                <ArrowRight title="" />
                                            </a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Shape class="text-dark" />
                </section>

                <section class="section bg-dark text-white overflow-hidden">
                    <div class="container pb-lg-4 mb-md-5 mb-4 mt-5">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title">
                                    <h4 class="title mb-4" data-aos="fade-left">
                                        Kestra is built by the open-source community
                                    </h4>
                                    <p data-aos="fade-right">Inspire and get inspired. Join our community of maintainers
                                        and contributors and help us make Kestra better!
                                    </p>
                                    <div class="row metrics">
                                        <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-left">
                                            <div class="counter-box text-center">
                                                <Star title="" />
                                                <h2 class="mb-0 mt-2">
                                                    <countTo :endVal="this.metrics ? this.metrics.stars : 0" :duration="4000"></countTo>
                                                </h2>
                                                <h6 class="counter-head text-muted">Stars</h6>
                                            </div>
                                        </div>

                                        <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-left">
                                            <div class="counter-box text-center">
                                                <DirectionsFork title="" />
                                                <h2 class="mb-0 mt-2">
                                                    <countTo :endVal="this.metrics ? this.metrics.forks : 0" :duration="4000"></countTo>
                                                </h2>
                                                <h6 class="counter-head text-muted">Forks</h6>
                                            </div>
                                        </div>

                                        <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-left">
                                            <div class="counter-box text-center">
                                                <BugOutline title="" />
                                                <h2 class="mb-0 mt-2">
                                                    <countTo :endVal="this.metrics ? this.metrics.issues : 0" :duration="4000"></countTo>
                                                </h2>
                                                <h6 class="counter-head text-muted">Issues</h6>
                                            </div>
                                        </div>

                                        <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-right">
                                            <div class="counter-box text-center">
                                                <SourcePull title="" />
                                                <h2 class="mb-0 mt-2">
                                                    <countTo :endVal="this.metrics ? this.metrics.pullRequests : 0" :duration="4000"></countTo>
                                                </h2>
                                                <h6 class="counter-head text-muted">Pull Requests</h6>
                                            </div>
                                        </div>

                                        <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-right">
                                            <div class="counter-box text-center">
                                                <SourceCommitLocal title="" />
                                                <h2 class="mb-0 mt-2">
                                                    <countTo :endVal="this.metrics ? this.metrics.commits : 0" :duration="4000"></countTo>
                                                </h2>
                                                <h6 class="counter-head text-muted">Commits</h6>
                                            </div>
                                        </div>

                                        <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-right">
                                            <div class="counter-box text-center">
                                                <AccountGroupOutline title="" />
                                                <h2 class="mb-0 mt-2">
                                                    <countTo :endVal="this.contributors ? this.contributors.length : 0" :duration="4000"></countTo>
                                                </h2>
                                                <h6 class="counter-head text-muted">Contributors</h6>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mt-4">
                                        <a href="https://github.com/kestra-io/kestra" target="_blank" class="btn btn-light title-dark mt-2 mr-2" data-aos="zoom-in">
                                            <GithubIcon title="" />  Follow on GitHub<ArrowRight title="" />
                                        </a>

                                        <a href="https://github.com/kestra-io/kestra/issues" target="_blank" class="btn btn-secondary mt-2 mr-2" data-aos="zoom-in">
                                            <GithubIcon title="" />  Find Open Issues<ArrowRight title="" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-bg" />
                </section>


                <section class="section overflow-hidden">
                    <div class="container pb-lg-4 mb-md-5 mb-4 mt-5">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title">
                                    <h4 class="title mb-4" data-aos="fade-left">
                                        Our contributors
                                    </h4>
                                    <div class="row">
                                        <div v-for="contributor in contributors" class="contributors p-2" data-aos="fade-zoom">
                                            <div class="position-relative">
                                                <a :href="'https://github.com/' + contributor.name" class="name text-dark">
                                                    <img :src="contributor.avatar" class="img-fluid avatar avatar-small rounded-circle shadow" alt="">
                                                </a>
                                            </div>
                                            <a :href="'https://github.com/' + contributor.name" class="name">{{ contributor.name }}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-white" />
                </section>

                <section class="section pt-1 bg-white overflow-hidden">
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
/*


Community
KESTRA
COMMUNITY
{ "issues": 875, "pullRequests": 446, "commits": 3925, "forks": 207, "stars": 2878 } [ { "name": "tchiotludo", "avatar": "https://avatars.githubusercontent.com/u/2064609?", "count": 6717 }, { "name": "eregnier", "avatar": "https://avatars.githubusercontent.com/u/5399780?", "count": 474 }, { "name": "brahimalm", "avatar": "https://avatars.githubusercontent.com/u/47592117?", "count": 113 }, { "name": "Kaibert123", "avatar": "https://avatars.githubusercontent.com/u/73552404?", "count": 46 }, { "name": "corentinghigny", "avatar": "https://ava
 */
import axios from 'axios';
import countTo from "vue-count-to";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Shape from "../components/layout/Shape";
import Breadcrumb from "../components/layout/Breadcrumb"
import ArrowRight from 'vue-material-design-icons/ArrowRight'
import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline";
import SourceCommitLocal from "vue-material-design-icons/SourceCommitLocal";
import BugOutline from "vue-material-design-icons/BugOutline";
import SourcePull from "vue-material-design-icons/SourcePull";
import DirectionsFork from "vue-material-design-icons/DirectionsFork";
import Star from "vue-material-design-icons/Star";
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue";
import PlayCircle from "vue-material-design-icons/PlayCircle.vue";
import ChevronDoubleRight from "vue-material-design-icons/ChevronDoubleRight.vue";

import Slack from 'vue-material-design-icons/Slack'
import {GithubIcon} from 'vue-feather-icons';
import Chat from "../components/layout/Chat";

import AOS from "aos";

export default {
    components: {
        Header,
        Footer,
        Breadcrumb,
        Shape,
        ArrowRight,
        AccountGroupOutline,
        SourceCommitLocal,
        BugOutline,
        SourcePull,
        DirectionsFork,
        Star,
        ChevronDoubleRight,
        Slack,
        PlayCircle,
        FileDocumentOutline,
        GithubIcon,
        countTo,
        Chat
    },
    data() {
        return {
            contributors: undefined,
            metrics: undefined,
        };
    },
    mounted() {
        AOS.init({startEvent: "load"});
        AOS.refresh();

        axios.get("https://api.kestra.io/v1/communities/github/contributors")
            .then(response => {
                this.contributors = response.data;
            })

        axios.get("https://api.kestra.io/v1/communities/github/metrics")
            .then(response => {
                this.metrics = response.data;
            })
    }
}
</script>

<style lang="scss">
@import '../styles/index';
.contributors {
    width: 100px;
    text-align: center;

    a {
        margin-top: $spacer/2;
        font-weight: 300;
        text-overflow: ellipsis;
        max-width: 100%;
        overflow: hidden;
        display: block;
        font-size: $font-size-sm;
        white-space: nowrap;
    }
}

.metrics {
    .material-design-icon {
        font-size: $font-size-lg * 2;
    }
}

.logo-slack {
    max-height: 50px;
}

.work-process {
    .list-unstyled {
        text-overflow: ellipsis;
        max-width: 100%;
        overflow: hidden;
        display: block;
        white-space: nowrap;
        color: $secondary;
        .step {
            opacity: 0.6;
        }
    }
}

</style>
