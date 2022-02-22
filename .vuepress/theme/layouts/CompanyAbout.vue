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
                                        For many years in the automation and workflow planning landscape, we were frustrated that we <strong>did not see a working, professional open-source solution</strong> that was suitable for either simple or complex projects.
                                    </p>
                                    <p>
                                        During our consulting missions, our tireless research for reliable, professional, testable orchestrators ended <strong>in failure</strong> — none were scalable, they were too complex to use, not production ready, and had poor user interface.
                                    </p>

                                </div>
                            </div>

                            <div class="container">
                                <div class="row align-items-center">
                                    <div class="mt-4 pt-2">
                                        <p>
                                            A challenge presented itself to us: <strong>Develop your own tool! One Platform to rule them all ^^</strong>
                                        </p>
                                        <p>
                                            Above all, we are seeking to challenge the ecosystem;
                                            to give you a tool to allow you to <router-link to="/features/features">orchestrate and automate your data</router-link>, workflows, and batches all with simplicity, autonomy, and high performance.
                                            his has been our ambition since day one and will continue to challenge us after the <router-link to="/blogs/2022-02-01-kestra-opensource">public launch of the Kestra project.</router-link>.
                                        </p>
                                        <p>
                                            We developed our Open Source platform with careful precision and dedication as part of a mission for one of the leaders of retail in Europe, <router-link to="/blogs/2022-02-22-leroy-merlin-usage-kestra">Leroy Merlin, who were in need of high-capacity data management.</router-link>.
                                        </p>
                                        <p>
                                            The platform is <strong>operational, in production, and performing</strong> to the satisfaction of several hundred internal users who have seen their productivity gain skyrocket since using Kestra. What a reward it is for us to build something new that brings <strong>complete satisfaction</strong> to its users.
                                        </p>
                                        <p>
                                            Now we are at the <router-link to="/blogs/2022-02-01-kestra-opensource">stage of our public launch</router-link> with the aim of bringing Kestra to everyone who needs it. We have structured a company and our teams are <strong>ready to help</strong> you with your future tests and integrations.
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
                                        Want more information?
                                    </h4>
                                    <h5 class="text-muted para-desc mx-auto mb-0" data-aos="fade-right">
                                        Any questions about Kestra or the company, please get in touch!
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
