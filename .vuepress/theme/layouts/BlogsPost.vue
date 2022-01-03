<template>
    <div id="wrapper">
        <Header />
        <div id="container">
            <main class="docs">
                <Breadcrumb :links="{'Blogs': '/blogs/'}" />
                <div class="container-fluid">
                    <div class="row flex-xl-nowrap">
                        <div class="col-md-3 col-xl-2">

                        </div>

                        <nav class="d-none d-xl-block col-xl-2 right">
                            <RightAnchor />
                        </nav>

                        <main class="col-md-9 col-xl-8 py-md-3 pl-md-5 docs" role="main">
                            <Content />
                        </main>
                    </div>
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
import RightAnchor from "../components/layout/RightAnchor";

export default {
    components: {
        Header,
        Footer,
        Breadcrumb,
        RightAnchor
    },
}
</script>

<style lang="scss">
@import '../styles/index';
</style>