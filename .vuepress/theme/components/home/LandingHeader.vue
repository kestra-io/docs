<template>

    <div class="home-header">
        <!-- Hero Start -->
        <section class="bg-half-260 d-table w-100" id="home">
            <div class="container">
                <div class="row mt-5">
                    <div class="col-lg-6 ">
                        <div class="title-heading text-white">
                            <vue-typed-js :loop="true" :strings="['open source', 'scalable', 'extensible', 'real-time']">
                                <h1 class="heading mb-4">
                                    The <span class="typing"></span> <br /><span>orchestrator</span> & <span>scheduler</span> platform.
                                </h1>
                            </vue-typed-js>
                            <p class="para-desc mx-auto">
                                Kestra is an <strong>infinitely scalable</strong> orchestrator platform, in order to create, run, schedule and monitor <strong>millions of complex</strong> pipelines.
                            </p>

                            <div class="mt-4 pt-2">
                                <div class="row">
                                    <div class="col-12 col-sm-6 text-sm-right">
                                        <router-link to="/docs/getting-started" class="btn btn-light"><PlayCircle title="" /> Get Started <ArrowRight title="" /></router-link>
                                    </div>
                                    <div class="col-12 col-sm-6 text-sm-left mt-4 mt-sm-0">
                                        <router-link to="/docs" class="btn btn-light "><FileDocumentOutline title="" /> Read the docs <ArrowRight title="" /></router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end col-->

                    <div class="col-lg-6 ui-img">
                        <div>
                            <img src="../../assets/home/ui.png" class="img-fluid" alt="" />
                        </div>
                    </div>
                </div>
                <!--end row-->
            </div>
            <!--end container-->
        </section>
        <!--end section-->
        <!-- Hero End -->

        <Shape class="text-bg" />
    </div>
</template>

<script>
import {VueTypedJs} from 'vue-typed-js'
import ArrowRight from "vue-material-design-icons/ArrowRight";
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline";
import PlayCircle from "vue-material-design-icons/PlayCircle";
import Shape from "../layout/Shape";

export default {
        components: {
            Shape,
            VueTypedJs,
            ArrowRight,
            FileDocumentOutline,
            PlayCircle,
        }
    }
</script>

<style lang="scss" scoped>
    @import ".vuepress/theme/styles/variables";

    .home-header {
        @mixin home-common {
            background-size: cover;
            align-self: center;
            position: relative;
            background-position: center center;
        }

        /deep/ .shape {
            z-index: 3;
        }

        .bg-half-260 {
            background: $primary;

            h1 {
                .typing {
                    color: #FBD10B;
                }
            }

            .container {
                position: relative;
                z-index: 2;
            }

            .title-heading {
                .heading {
                    margin: 0 auto;
                }

                padding-bottom: 40px;

                @media (min-width: 1024px) {
                    padding-bottom: 130px;
                }
            }

            .ui-img {
                padding-bottom: 180px;
                > div {
                    transform: perspective(340px) rotateY(-5deg);
                    transform-style: preserve-3d;
                    margin-top: 30px;
                    margin-right: 10px;
                    img {
                        box-shadow: 0 10px 25px rgba($secondary, 0.4) !important;
                    }
                }
            }

            @media (min-width: 768px) {
                .ui-img {
                    padding-bottom: 120px;
                }
            }


            .btn {
                white-space: nowrap;
            }

            @include home-common();
            position: relative;

            &:before{
                position: absolute;
                z-index: 1;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                opacity: 0.8;
                content: "";
                background-color: $primary;
                background-size: cover;
            }
        }
    }

</style>
