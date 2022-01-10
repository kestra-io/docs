<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main>
                <LandingHeader />
                <LandingFeature />
                <LandingTech />
                <LandingCustomer />
                <LandingVideo />
                <LandingPlugins />
            </main>
        </div>
        <Footer />
    </div>
</template>

<script>
import AOS from "aos"
import LandingHeader from "../components/home/LandingHeader"
import LandingFeature from "../components/home/LandingFeature"
import LandingTech from "../components/home/LandingTech"
import LandingVideo from "../components/home/LandingVideo"
import LandingCustomer from "../components/home/LandingCustomer"
import LandingPlugins from "../components/home/LandingPlugins"
import Header from "../components/Header";
import Footer from "../components/Footer";

export default {
    components: {
        Header,
        Footer,
        LandingHeader,
        LandingFeature,
        LandingCustomer,
        LandingTech,
        LandingVideo,
        LandingPlugins,
    },

    mounted() {
        AOS.init({startEvent: "load"});
        AOS.refresh();
    }
}
</script>

<style lang="scss">
@import '../styles/index';
</style>
