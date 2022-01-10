<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main>
                <Breadcrumb />

                <!-- About Start -->
                <section class="section overflow-hidden">
                    <div class="container">
                        <div class="section-title text-center pb-2">
                            <h4 class="title mb-4" data-aos="fade-right">Our Story</h4>
                        </div>

                        <div class="row align-items-center">
                            <div class="col-lg-5 col-md-5 mt-4 pt-2 mt-sm-0 pt-sm-0">
                                <div class="position-relative">
                                    <img
                                        src="../assets/home/ui.png"
                                        class="rounded img-fluid mx-auto d-block"
                                        alt=""
                                        data-aos="fade-right"
                                    />
                                </div>
                            </div>

                            <div class="col-lg-7 col-md-7 mt-4 pt-2 mt-sm-0 pt-sm-0">
                                <div class="section-title ml-lg-4" data-aos="fade-left">

                                    <p>
                                        <strong>Why did you create a data orchestration platform?</strong><br />
                                        For many years in the automation and workflow planning landscape, we were frustrated that we <strong>did not see a working, professional open-source solution</strong> that was suitable for either simple or complex needs.
                                    </p>
                                    <p>
                                        During our consulting missions, all our research for reliable, professional, quickly testable orchestrators ended <strong>tirelessly in failures</strong>! Not scalable, too complex to use, not production ready, poor user interface, ...
                                    </p>

                                </div>
                            </div>

                            <div class="container">
                                <div class="row align-items-center">
                                    <div class="mt-4 pt-2">
                                        <p>
                                            A challenge presented itself to us: <strong>Develop our own tool! One Platform to rule them all ^^</strong>
                                        </p>
                                        <p>
                                            Before all, we are seeking to challenge the ecosystem.
                                            Give you a tool to allow you to <router-link to="/features/features">orchestrate and automate your data</router-link>, your workflows, your batches, all with simplicity, autonomy and performance.
                                            This has been our ambition since day since day one and will challenge us after the <router-link to="/blogs/2022-01-10-kestra-opensource">public launch of the Kestra project</router-link>.
                                        </p>
                                        <p>
                                            We have developed our opensource platform with calm, precision and self-sacrifice, as part of a mission for one of the leaders of retail in Europe, <router-link to="/blogs/2022-01-10-leroy-merlin-usage-kestra">Leroy Merlin, with strict needs for enormous data management</router-link>.
                                        </p>
                                        <p>
                                            The platform is <strong>operational, in production and performing</strong> for the pleasure of several hundred internal users who have seen their productivity gain skyrocketed using Kestra. What a reward for us. To build something new and that gives <strong>complete satisfaction</strong> to our users.
                                        </p>
                                        <p>
                                            Now is the <router-link to="/blogs/2022-01-10-kestra-opensource">public launch</router-link> stage to bring Kestra to everyone who will need it. We have structured a company and our teams are now <strong>ready to help</strong> you with your future tests and integrations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Shape class="text-dark" />
                </section>

                <section class="section bg-dark text-white">
                    <div class="container">
                        <div class="row">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">Our Founders</h4>
                                </div>
                            </div>
                        </div>

                        <Team :team-data="teamData" />
                    </div>
                    <Shape class="text-bg" />
                </section>

                <section class="section">
                    <div class="container mt-5">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title">
                                    <h4 class="title mb-4" data-aos="fade-left">
                                        Want more informations ?
                                    </h4>
                                    <h5 class="text-muted para-desc mx-auto mb-0" data-aos="fade-right">
                                        Any questions about Kestra or the company, reach us please!
                                    </h5>

                                    <div class="mt-4">
                                        <router-link to="/company/contact.html" class="btn btn-primary mt-2 mr-2" data-aos="zoom-in">
                                            <Email title="" />
                                            Contact Us
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
import Team from '../components/company/Team';
import ChevronRight from 'vue-material-design-icons/ChevronRight'
import Play from 'vue-material-design-icons/Play'
import AOS from "aos";
import Email from "vue-material-design-icons/Email";

export default {
    components: {
        Header,
        Footer,
        Team,
        Breadcrumb,
        Shape,
        ChevronRight,
        Play,
        Email,
    },
    mounted() {
        AOS.init({startEvent: "load"});
        AOS.refresh();
    },
    data() {
        return {
            teamData: [
                {
                    image: require("../assets/company/edarras.jpg"),
                    name: "Emmanuel Darras",
                    designation: "C.E.O",
                    socials: {
                        "linkedin": "https://www.linkedin.com/in/emmanuel-darras-48689b/"
                    }
                },
                {
                    image: require("../assets/company/ldehon.jpg"),
                    name: "Ludovic Dehon",
                    designation: "C.T.O",
                    socials: {
                        "linkedin": "https://www.linkedin.com/in/ludovic-dehon-60886530/",
                        "twitter": "https://twitter.com/tchiotludo",
                        "github": "https://github.com/tchiotludo"
                    }
                },
            ],
        };
    },
}
</script>

<style lang="scss">
@import '../styles/index';
</style>
