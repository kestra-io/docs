<template>
    <div>
        <section class="section">
            <div class="container">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="video-solution-cta position-relative" style="z-index: 1;">
                            <div class="position-relative">
                                <img src="/ui.gif" class="img-fluid" alt="">
                            </div>
                            <div class="content mt-md-4 pt-md-2">
                                <div class="row justify-content-center">
                                    <div class="col-lg-10">
                                        <div class="row  mt-5 mt-md-0">
                                            <div class="col-md-6">
                                                <div class="section-title text-md-left">
                                                    <h4 class="title text-white mb-4 mb-0-md title-dark">
                                                        Edit, run & monitor in real-time directly on the <strong>all in one</strong> web
                                                        interface.
                                                    </h4>
                                                </div>
                                            </div>

                                            <div class="col-md-6 col-12 ">
                                                <div class="section-title text-md-left">
                                                    <p class="text-white-50 para-desc">
                                                        <span class="text-light title-dark">Kestra</span> provide a
                                                        built-in
                                                        rich user interface that allow you to edit your flows, run &
                                                        monitor them in real-time.
                                                        No need to setup complex architecture, all features is provide
                                                        by default !
                                                    </p>
                                                    <a href="/docs/user-interface-guide" class="text-light btn btn-light title-dark"><i class="mdi mdi-file-document"></i> Read More <i class="mdi mdi-arrow-right"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end col-->
                </div>
                <!--end row -->

                <div class="feature-posts-placeholder bg-primary"></div>
            </div>
            <!--end container-->
            <div class="position-relative">
                <div class="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        components: {}
    }
</script>

<style lang="scss" scoped>
@import ".vuepress/styles/variables";

#app {
    .shape {
        bottom: -100px;
    }
}

</style>
