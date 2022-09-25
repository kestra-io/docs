<template>
    <div id="wrapper">
        <Chat />
        <Header />
        <div id="container">
            <main class="features-usage">
                <Breadcrumb title="Page not found" />

                <section class="section pt-1 overflow-hidden">
                    <div class="container pb-lg-4 mb-md-5 mb-4 mt-5">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <div class="section-title">
                                    <h4 class="title mb-4" data-aos="fade-left">
                                        Oh ! no ! Page not found
                                    </h4>
                                    <h5 class="text-muted para-desc mx-auto mb-0" data-aos="fade-right">
                                        {{ getMsg() }}
                                    </h5>

                                    <div class="mt-4">
                                        <a href="javascript:history.go(-1)" class="btn btn-primary mt-2 mr-2" data-aos="zoom-in">
                                            <ArrowLeftDropCircleOutline title="" /> Go Back <ArrowRight title="" />
                                        </a>
                                        <router-link to="/" class="btn btn-outline-primary mt-2" data-aos="zoom-in" >
                                            <Home title="" /> Go To Home <ArrowRight title="" />
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
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import Breadcrumb from "../components/layout/Breadcrumb.vue";
import Shape from "../components/layout/Shape.vue";
import ArrowRight from "vue-material-design-icons/ArrowRight.vue";
import Home from "vue-material-design-icons/Home.vue";
import ArrowLeftDropCircleOutline from "vue-material-design-icons/ArrowLeftDropCircleOutline.vue";
import SiteMap from "vue-material-design-icons/Sitemap.vue";
import CalendarClockOutline from "vue-material-design-icons/CalendarClockOutline.vue";
import ServerNetwork from "vue-material-design-icons/ServerNetwork.vue";
import Chat from "../components/layout/Chat.vue";
import AOS from "aos";

export default {
    name: "NotFound",
    components: {
        Header,
        Footer,
        Breadcrumb,
        Shape,
        ArrowRight,
        Home,
        ArrowLeftDropCircleOutline,
        SiteMap,
        CalendarClockOutline,
        ServerNetwork,
        Chat
    },
    mounted() {
        AOS.init({startEvent: "load"});
        AOS.refresh();
    },
    methods: {
        getMsg () {
            const msgs = [
                `There's nothing here.`,
                `How did we get here?`,
                `That's a Four-Oh-Four.`,
                `Looks like we've got some broken links.`
            ];

            return msgs[Math.floor(Math.random() * msgs.length)]
        }
    }
};
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
