<template>
    <div id="wrapper">
        <Chat />
        <Header />
        <div id="container">
            <main>
                <LandingHeader />
                <LandingFeature />
                <LandingCompany />
                <LandingOpenSource />
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
import LandingCompany from "../components/home/LandingCompany"
import LandingOpenSource from "../components/home/LandingOpenSource"
import LandingTech from "../components/home/LandingTech"
import LandingVideo from "../components/home/LandingVideo"
import LandingCustomer from "../components/home/LandingCustomer"
import LandingPlugins from "../components/home/LandingPlugins"
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chat from "../components/layout/Chat";

export default {
    components: {
        Header,
        Footer,
        LandingHeader,
        LandingCompany,
        LandingFeature,
        LandingOpenSource,
        LandingCustomer,
        LandingTech,
        LandingVideo,
        LandingPlugins,
        Chat,
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
