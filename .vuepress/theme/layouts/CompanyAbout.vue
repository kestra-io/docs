<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main>
                <Breadcrumb />

                <!-- About Start -->
                <section class="section overflow-hidden">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-5 col-md-5 mt-4 pt-2 mt-sm-0 pt-sm-0">
                                <div class="position-relative">
                                    <img
                                        src="../assets/features/world.jpg"
                                        class="rounded img-fluid mx-auto d-block"
                                        alt=""
                                        data-aos="fade-right"
                                    />
                                </div>
                            </div>

                            <div class="col-lg-7 col-md-7 mt-4 pt-2 mt-sm-0 pt-sm-0">
                                <div class="section-title ml-lg-4" data-aos="fade-left">
                                    <h4 class="title mb-4">Our Story</h4>
                                    <p class="text-muted">
                                        Kestra was built based on <strong>frustration</strong> about current open source landscape on orchestration platform.
                                        Searching for <strong>reliable alternative</strong> was not an easy task and no clear solution was found. <br /><br />
                                        Ludovic start working on <strong>proof of concept during summer 2019</strong>, it's was an heavy work, that's need a lot of invest, all must be done from scratch.<br />
                                        After months of works, he decided to show his current work at <a href="https://www.leroymerlin.fr/">Leroy Merlin</a> that was seeking an orchestration / scheduling platform to handle all the BI needs after many failure trying to use actual ecosystems.<br /><br />
                                        An internal POC was decided and after months of testing the solution, the <strong>solution was approved</strong>! On may 2020, Kestra was <strong>on production</strong>! Month later, Leroy Merlin is using the <strong>Enterprise Edition since August 2020</strong>.
                                        Now more the thousand flow, millions of tasks, thousands days of processing execution is handle <strong>every month</strong>.<br /><br />
                                        In a meantime, Emmanuel, a friend of Ludovic since they work both at Ankama, start showing interest in the solution. They decide to <strong>found the company</strong> that will support the future of Kestra!
                                    </p>
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
        AOS.init()
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
