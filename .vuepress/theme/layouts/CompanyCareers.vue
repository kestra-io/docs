<template>
    <div id="wrapper">
        <Chat />
        <Header />
        <div id="container">
            <main>
                <Breadcrumb />

                <section class="section overflow-hidden bg-white">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-12">
                                <div class="section-title mb-0 pb-2">
                                    <h4 class="title mb-4 text-center" data-aos="fade-left">Join an open company</h4>
                                    <p data-aos="fade-right">
                                        Free and open isn’t just how we build our products, it’s how we build our culture. <br/>
                                        Our users and customers are at the center of everything we do. Customer focus is present across every functional area of the company and in every interaction, product feature, and engagement.<br />
                                        Our aim as an employer is to enrich our colleague's lives by providing exciting work, brilliant and thoughtful colleagues, opportunities to learn and do new things – as well as a competitive compensation and benefits package.
                                    </p>
                                    <p class="text-center mt-5 mb-0">
                                        <a href="#open" class="btn btn-primary " data-aos="zoom-in">
                                            <Email title="" />
                                            Open positions
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Shape class="text-light" />
                </section>

                <section class="section overflow-hidden bg-light">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">Perks & Benefits</h4>
                                    <p data-aos="fade-right">Feeling your best allows you to do your best. We take care of the whole of you.</p>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 col-12 mt-5">
                                <div class="features bg-light" data-aos="fade-right">
                                    <div class="image position-relative d-inline-block">
                                        <Web class="text-primary h1" title="" />
                                    </div>

                                    <div class="content">
                                        <h5>Work from anywhere</h5>
                                        <p class="text-secondary mb-0">We're a remote-first and completely distributed team, so you can work wherever home is.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4 col-12 mt-5">
                                <div class="features bg-light" data-aos="fade-right">
                                    <div class="image position-relative d-inline-block">
                                        <CalendarStarOutline class="text-primary h1" title="" />
                                    </div>

                                    <div class="content">
                                        <h5>Flexible working hours</h5>
                                        <p class="text-secondary mb-0">Flexibility in schedule to be there for life’s important moments.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4 col-12 mt-5">
                                <div class="features bg-light" data-aos="fade-right">
                                    <div class="image position-relative d-inline-block">
                                        <ScaleBalance class="text-primary h1" title="" />
                                    </div>

                                    <div class="content">
                                        <h5>Work/life balance</h5>
                                        <p class="text-secondary mb-0">Prioritize work-life balance in the way that works best for you and generous vacation policy.</p>
                                    </div>
                                </div>
                            </div>


                            <div class="col-md-4 col-12 mt-5">
                                <div class="features bg-light" data-aos="fade-left">
                                    <div class="image position-relative d-inline-block">
                                        <BottleTonicPlusOutline class="text-primary h1" title="" />
                                    </div>

                                    <div class="content">
                                        <h5>Expanded health benefits</h5>
                                        <p class="text-secondary mb-0">Including premium medical, dental, and vision coverage for employees and their dependent loved ones.</p>
                                    </div>
                                </div>
                            </div>


                            <div class="col-md-4 col-12 mt-5">
                                <div class="features bg-light" data-aos="fade-left">
                                    <div class="image position-relative d-inline-block">
                                        <ChairRolling class="text-primary h1" title="" />
                                    </div>

                                    <div class="content">
                                        <h5>Office costs covered</h5>
                                        <p class="text-secondary mb-0">Work from home, or from any other coworking space – we’ll cover the costs.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4 col-12 mt-5">
                                <div class="features bg-light" data-aos="fade-left">
                                    <div class="image position-relative d-inline-block">
                                        <Update class="text-primary h1" title="" />
                                    </div>

                                    <div class="content">
                                        <h5>Up-to-date always</h5>
                                        <p class="text-secondary mb-0">We’ll cover all hardware and software needed so you’re always with the latest versions.</p>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <Shape class="text-dark" />
                </section>

                <section id="open" class="section bg-dark text-white">
                    <div class="container">
                        <div class="row">
                            <div class="col-12 text-center">
                                <div class="section-title mb-4 pb-2">
                                    <h4 class="title mb-4" data-aos="fade-left">Our open positions</h4>
                                    <p>We are looking for talented open-source enthusiasts working remotely from anywhere. Browse our open positions, find a job you love, say goodbye to imposter syndrome, and apply.</p>
                                </div>
                            </div>
                        </div>

                        <router-link
                            class="card blog rounded border-0 shadow overflow-hidden mb-3"
                            data-aos="fade-left"
                            v-for="page of filteredList"
                            :key="page.key"
                            :to="page.path"
                        >
                            <div class="row align-items-center no-gutters">
                                <div class="card-body content">
                                    <h5 class="text-primary mb-0 jobs-offers">
                                        <span>
                                            {{ page.title }}
                                        </span>
                                        <span class="badge badge-info">{{ page.frontmatter.type }}</span>
                                    </h5>
                                </div>
                            </div>
                        </router-link>
                    </div>
                    <Shape class="text-bg" />
                </section>

                <section class="section">
                    <div class="container mt-5">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title">
                                    <h4 class="title mb-4" data-aos="fade-left">
                                        Don't see the right opportunity?
                                    </h4>
                                    <h5 class="text-muted para-desc mx-auto mb-0" data-aos="fade-right">
                                        We love meeting new people who can make our team even stronger!
                                    </h5>

                                    <div class="mt-4">
                                        <a href="mailto:jobs@kestra.io?subject=[jobs] Spontaneous Application" class="btn btn-primary mt-2 mr-2" data-aos="zoom-in">
                                            <Email title="" />
                                            Spontaneous Application!
                                        </a>
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
import Chat from "../components/layout/Chat";
import Web from "vue-material-design-icons/Web.vue";
import CalendarStarOutline from "vue-material-design-icons/CalendarStarOutline.vue";
import ScaleBalance from "vue-material-design-icons/ScaleBalance.vue";
import BottleTonicPlusOutline from "vue-material-design-icons/BottleTonicPlusOutline.vue";
import ChairRolling from "vue-material-design-icons/ChairRolling.vue";
import Update from "vue-material-design-icons/Update.vue";

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
        Chat,
        Web,
        CalendarStarOutline,
        ScaleBalance,
        BottleTonicPlusOutline,
        ChairRolling,
        Update,
    },
    mounted() {
        AOS.init({startEvent: "load"});
        AOS.refresh();
    },
    computed: {
        filteredList() {
            // Order by publish date, desc
            return this.$site.pages
                .filter(item => item.path.startsWith("/company/careers/") && item.path !== "/blogs/")
                .filter(item => item.frontmatter.draft === undefined || item.frontmatter.draft === false)
                .sort((a, b) => {
                    return new Date(b.frontmatter.date || b.lastUpdated) - new Date(a.frontmatter.date || a.lastUpdated)
                })
        }
    },
}
</script>

<style lang="scss">
@import '../styles/index';
</style>

<style lang="scss" scoped>
@import '../styles/variables';

h5.jobs-offers {
    display: flex;

    span:first-child {
        flex-grow: 2;
    }
}
</style>