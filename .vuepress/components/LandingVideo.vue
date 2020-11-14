<template>
    <div>
        <section class="section">
            <div class="container">
                <div class="row">
                    <div class="col-12 text-center">
                        <div class="video-solution-cta position-relative" style="z-index: 1;">
                            <div class="position-relative">
                                <img src="landing/ui.png" class="img-fluid" alt="">
                                <div class="play-icon">
                                    <a href="https://www.youtube.com/watch?v=sZ7bKASht8w"
                                       class="play-btn video-play-icon">
                                        <i class="mdi mdi-play text-primary rounded-circle bg-white shadow-lg"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="content mt-md-4 pt-md-2">
                                <div class="row justify-content-center">
                                    <div class="col-lg-10">
                                        <div class="row align-items-center">
                                            <div class="col-md-6">
                                                <div class="section-title text-md-left">
                                                    <h4 class="title text-white mb-0 title-dark">
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
                                                    <a href="/docs/user-interface-guide/" class="text-light btn btn-light title-dark"><i class="mdi mdi-file-document"></i> Read More <i class="mdi mdi-arrow-right"></i></a>
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

<style lang="scss">
@import "../styles/landing/variables";

.play-btn {
    height: 78px;
    width: 78px;
    font-size: 30px;
    line-height: 76px;
    border-radius: 50%;
    display: inline-block;
    color: #ffffff;
}

.play-icon {
    display: none;
    position: absolute;
    bottom: 50%;
    transform: translateY(50%);
    right: 0;
    left: 0;
    text-align: center;

    i {
        height: 75px;
        -webkit-text-stroke: 2px $primary;
        -webkit-text-fill-color: transparent;
        width: 75px;
        font-size: 25px;
        line-height: 75px;
        display: inline-block;

        &:hover {
            -webkit-text-stroke: 2px $primary;
            -webkit-text-fill-color: $primary;
        }
    }
}

</style>
