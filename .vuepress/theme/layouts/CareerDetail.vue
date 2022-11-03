<template>
    <div id="wrapper">
        <Chat />
        <Header />
        <div id="container">
            <main class="docs">
                <Breadcrumb :links="{'Company': undefined, 'Careers': '/company/careers.html'}" />
                <section class="section bg-white overflow-hidden">
                    <div class="container">
                        <CareersTop />
                        <Content />
                        <CareersBottom />

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
import Breadcrumb from "../components/layout/Breadcrumb"
import RightAnchor from "../components/layout/RightAnchor";
import Share from "../components/layout/Share";
import TimeAgo from '../components/TimeAgo';
import Chat from "../components/layout/Chat";
import CareersTop from '../components/company/CareersTop.vue';
import CareersBottom from '../components/company/CareersBottom.vue';

export default {
    components: {
        Header,
        Footer,
        Breadcrumb,
        RightAnchor,
        Share,
        TimeAgo,
        Chat,
        CareersTop,
        CareersBottom
    },
    computed: {
        author() {
            return this.$page.frontmatter.author;
        },
        image() {
            return require(`../assets/company/${this.author.image}.jpg`);
        }
    }

}
</script>

<style lang="scss">
@import '../styles/index';
</style>