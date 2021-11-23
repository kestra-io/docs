<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main class="docs">
                <Breadcrumb :links="{'Blogs': '/blogs/'}" />
                <div class="container pt-5 pb-5">
                    <Content />
                </div>
            </main>
        </div>
        <Footer />
    </div>
</template>

<script>
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/layout/Breadcrumb"

export default {
    components: {
        Header,
        Footer,
        Breadcrumb
    },
}
</script>

<style lang="scss">
@import '../styles/index';
</style>