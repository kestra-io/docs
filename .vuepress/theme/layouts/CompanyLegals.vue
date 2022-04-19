<template>
    <div id="wrapper">
        <Chat />
        <Header />
        <div id="container">
            <main class="docs">
                <Breadcrumb :links="{'Company': undefined}" />
                <div class="container">
                    <div class="card rounded shadow p-3 mt-5 mb-6">
                        <Content />
                        <p class="text-muted mb-0 mt-3 text-right">
                            Last updated: {{ $page.lastUpdated }}
                        </p>
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
import Chat from "../components/layout/Chat";

export default {
    components: {
        Header,
        Footer,
        Breadcrumb,
        Chat,
    },
    computed: {

    }

}
</script>

<style lang="scss">
@import '../styles/index';
</style>