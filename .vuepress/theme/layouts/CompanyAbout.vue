<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main>
                <Breadcrumb />

                <!-- About Start -->
                <section class="section">
                    <div class="container">
                        <div class="row align-items-center">
                            <div class="col-lg-5 col-md-5 mt-4 pt-2 mt-sm-0 pt-sm-0">
                                <div class="position-relative">
                                    <img
                                        src="images/company/about.jpg"
                                        class="rounded img-fluid mx-auto d-block"
                                        alt=""
                                    />
                                    <div class="play-icon">
                                        <a
                                            v-b-modal.modal
                                            href="javascript:void(0);"
                                            class="play-btn video-play-icon"
                                        >
                                            <Play title="" class="rounded-circle bg-white shadow" />
                                        </a>

                                        <b-modal
                                            id="modal"
                                            hide-footer
                                            size="lg"
                                            header-close-variant="white"
                                            header-class="border-0"
                                            content-class="border-0"
                                            centered
                                        >
                                            <vimeo-player
                                                ref="player"
                                                :player-width="750"
                                                :player-height="450"
                                                :video-id="287684225"
                                            />
                                        </b-modal>
                                    </div>
                                </div>
                            </div>
                            <!--end col-->

                            <div class="col-lg-7 col-md-7 mt-4 pt-2 mt-sm-0 pt-sm-0">
                                <div class="section-title ml-lg-4">
                                    <h4 class="title mb-4">Our Story</h4>
                                    <p class="text-muted">
                                        Start working with
                                        <span class="text-primary font-weight-bold">Landrick</span> that
                                        can provide everything you need to generate awareness, drive
                                        traffic, connect. Dummy text is text that is used in the
                                        publishing industry or by web designers to occupy the space
                                        which will later be filled with 'real' content. This is required
                                        when, for example, the final text is not yet available. Dummy
                                        texts have been in use by typesetters since the 16th century.
                                    </p>
                                    <a href="javascript:void(0)" class="btn btn-primary mt-3">
                                        Buy Now <ChevronRight title="" />
                                    </a>
                                </div>
                            </div>
                            <!--end col-->
                        </div>
                        <!--end row-->
                    </div>
                    <!--end container-->

                    <!--end container-->
                </section>
                <!--end section-->
                <!-- About End -->

                <!-- Team Start -->
                <section class="section bg-light">
                    <div class="container">
                        <div class="row">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4">Our Greatest Minds</h4>
                                    <p class="text-muted para-desc mx-auto mb-0">
                                        Start working with
                                        <span class="text-primary font-weight-bold">Landrick</span> that
                                        can provide everything you need to generate awareness, drive
                                        traffic, connect.
                                    </p>
                                </div>
                            </div>
                            <!--end col-->
                        </div>
                        <!--end row-->

                        <Team :team-data="teamData" />
                    </div>
                    <!--end container-->

                    <div class="container mt-100 mt-60">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title">
                                    <h4 class="title mb-4">
                                        See everything about your employee at one place.
                                    </h4>
                                    <p class="text-muted para-desc mx-auto">
                                        Start working with
                                        <span class="text-primary font-weight-bold">Landrick</span> that
                                        can provide everything you need to generate awareness, drive
                                        traffic, connect.
                                    </p>

                                    <div class="mt-4">
                                        <a href="javascript:void(0)" class="btn btn-primary mt-2 mr-2"
                                        >Get Started Now</a
                                        >
                                        <a
                                            href="javascript:void(0)"
                                            class="btn btn-outline-primary mt-2"
                                        >Free Trial</a
                                        >
                                    </div>
                                </div>
                            </div>
                            <!--end col-->
                        </div>
                        <!--end row-->
                    </div>
                    <!--end container-->
                </section>
                <!--end section-->
                <!-- Team End -->
            </main>
        </div>
        <Footer />
    </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/layout/Breadcrumb"
import Team from '../components/company/Team';
import ChevronRight from 'vue-material-design-icons/ChevronRight'
import Play from 'vue-material-design-icons/Play'

export default {
    components: {
        Header,
        Footer,
        Team,
        Breadcrumb,
        ChevronRight,
        Play
    },
    data() {
        return {
            teamData: [
                {
                    image: "images/client/01.jpg",
                    name: "Emmanuel Darras",
                    designation: "C.E.O",
                },
                {
                    image: "images/client/04.jpg",
                    name: "Ludovic Dehon",
                    designation: "C.T.O",
                },
            ],
        };
    },
}
</script>

<style lang="scss" scoped>
@import '../styles/index';

</style>
