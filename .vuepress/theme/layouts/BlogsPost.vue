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

                        <main class="col-md-9 col-xl-8 py-md-3 pl-md-5 docs" style="max-width: 1000px" role="main">
                            <div class="d-flex justify-content-between mt-5 mb-3" v-if="author">
                                <div class="media align-items-center">
                                    <img :src="image" alt="img" class="img-fluid avatar avatar-md-sm rounded-circle shadow mr-4">
                                    <div>
                                        <h6 class="mb-0">{{ author.name }}</h6>
                                        <span class="text-muted">
                                            Published&nbsp;
                                            <time-ago
                                                :last-updated="$page.frontmatter.date || $page.lastUpdated"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Content />

                            <Share />
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
import Share from "../components/layout/Share";
import TimeAgo from '../components/TimeAgo';

export default {
    components: {
        Header,
        Footer,
        Breadcrumb,
        RightAnchor,
        Share,
        TimeAgo
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