<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main>
                <LandingHeader />
                <LandingFeature />
                <LandingTech />
                <LandingVideo />
                <LandingPlugins />
            </main>
        </div>
        <Footer />
    </div>
</template>

<script>
import LandingHeader from "../components/home/LandingHeader"
import LandingFeature from "../components/home/LandingFeature"
import LandingTech from "../components/home/LandingTech"
import LandingVideo from "../components/home/LandingVideo"
import LandingPlugins from "../components/home/LandingPlugins"
import Header from "../components/Header";
import Footer from "../components/Footer";

export default {
    components: {
        Header,
        Footer,
        LandingHeader,
        LandingFeature,
        LandingTech,
        LandingVideo,
        LandingPlugins,
    },
}
</script>

<style lang="scss">
@import '../styles/index';
</style>
