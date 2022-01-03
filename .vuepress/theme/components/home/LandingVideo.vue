<template>
    <section class="section overflow-hidden">
        <Shape class="text-bg top" />

        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <div class="position-relative" style="z-index: 1;">
                        <div class="position-relative">
                            <video autoplay controls muted="" poster="/ui.gif" class="img-fluid">
                                <source src="/video.m4v" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <div class="content mt-md-4 pt-md-2">
                            <div class="row justify-content-center">
                                <div class="col-lg-10">
                                    <div class="row  mt-5 mt-md-0">
                                        <div class="col-md-6">
                                            <div class="section-title text-md-left">
                                                <h4 class="title text-white mb-4 mb-0-md title-dark" data-aos="fade-right">
                                                    Edit, run & monitor in real-time directly on the <strong>all in
                                                    one</strong> web
                                                    interface.
                                                </h4>
                                            </div>
                                        </div>

                                        <div class="col-md-6 col-12 ">
                                            <div class="section-title text-md-left">
                                                <p class="text-white-50 para-desc" data-aos="fade-left">
                                                    <span class="text-light title-dark">Kestra</span> provide a
                                                    built-in
                                                    rich user interface that allow you to edit your flows, run &
                                                    monitor them in real-time.
                                                    No need to setup complex architecture, all features are provided
                                                    by default !
                                                </p>
                                                <router-link
                                                    to="/docs/user-interface-guide"
                                                    class="text-light btn btn-light title-dark"
                                                    data-aos="zoom-in"
                                                >
                                                    <FileDocumentOutline title="" /> Read More
                                                    <ArrowRight title="" />
                                                </router-link>
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
        <Shape class="text-bg bottom" />
    </section>
</template>

<script>
import ArrowRight from 'vue-material-design-icons/ArrowRight'
import FileDocumentOutline from 'vue-material-design-icons/FileDocumentOutline'
import Shape from "../layout/Shape";

export default {
    components: {
        Shape,
        ArrowRight,
        FileDocumentOutline
    }
}
</script>
