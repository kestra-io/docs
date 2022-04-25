<template>
    <div class="home-header overflow-hidden">
        <section class="bg-half-260 d-table w-100" id="home">
            <div class="container">
                <div class="row mt-5">
                    <div class="col-lg-6 ">
                        <div class="title-heading text-white" data-aos="fade-right">
                            <h1 class="heading mb-4">
                                The <span class="typing">open source data</span> <span>orchestration</span> and <span>scheduling </span> platform.
                            </h1>
                            <p class="para-desc mx-auto">
                                Kestra is an <strong>infinitely scalable</strong> orchestration and scheduling platform, creating, running, scheduling, and monitoring <strong>millions of complex</strong> pipelines.
                            </p>

                            <div class="mt-4 text-center">
                                <router-link
                                    to="/docs/getting-started"
                                    class="btn btn-light mr-3 mt-4"
                                    data-aos="zoom-in">
                                        <PlayCircle title="" /> Get Started <ArrowRight title="" />
                                </router-link>
                                <router-link
                                    to="/features/features"
                                    class="btn btn-light mr-3 mt-4"
                                    data-aos="zoom-in">
                                        <FeatureSearch title="" /> Discover <ArrowRight title="" />
                                </router-link>
                                <a
                                    href="https://demo.kestra.io"
                                    target="_blank"
                                    class="text-light btn btn-light title-dark mr-3 mt-4"
                                    data-aos="zoom-in"
                                >
                                    <Web title="" /> Demo
                                    <ArrowRight title="" />
                                </a>
                            </div>
                            <div class="mt-4 text-center">
                                ⭐ <a href="https://github.com/kestra-io/kestra" class="text-white star">Star us on GitHub</a> ⭐
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 ui-img">
                        <lottie
                            ref="lottie"
                            v-if="animationData"
                            :animation-data="animationData"
                            :assets-path="assetsPath"
                            :loop="false"
                            :auto-play="false"
                            :speed="1.2"
                            @complete="complete"
                            @domLoaded="play"
                        />
                    </div>
                </div>
            </div>
        </section>
        <Shape class="text-bg" />
    </div>
</template>

<script>
import ArrowRight from "vue-material-design-icons/ArrowRight";
import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline";
import PlayCircle from "vue-material-design-icons/PlayCircle";
import FeatureSearch from "vue-material-design-icons/FeatureSearch"
import Web from "vue-material-design-icons/Web"
import Shape from "../layout/Shape";
import Lottie from '../layout/VueLottie';
import * as animationData from './animation.json';

const logo = [
    require('../../assets/home/' + 'bigquery.svg'),
    require('../../assets/home/' + 'clickhouse.png'),
    require('../../assets/home/' + 'drive.svg'),
    require('../../assets/home/' + 'elasticsearch.svg'),
    require('../../assets/home/' + 'gcs.svg'),
    require('../../assets/home/' + 'mongodb.svg'),
    require('../../assets/home/' + 'mysql.png'),
    require('../../assets/home/' + 'oracle.svg'),
    require('../../assets/home/' + 'postgres.png'),
    require('../../assets/home/' + 'redshift.svg'),
    require('../../assets/home/' + 's3.png'),
    require('../../assets/home/' + 'sheets.svg'),
    require('../../assets/home/' + 'slack.png'),
    require('../../assets/home/' + 'vertica.png'),
    require('../../assets/home/' + 'snowflake.svg'),
    require('../../assets/home/' + 'abs.svg'),
    require('../../assets/home/' + 'cassandra.svg'),
    require('../../assets/home/' + 'kafka.svg'),
    require('../../assets/home/' + 'mqtt.svg'),
]

export default {
    components: {
        Shape,
        ArrowRight,
        FileDocumentOutline,
        PlayCircle,
        FeatureSearch,
        Web,
        Lottie
    },
    data() {
        return {
            animationData: undefined,
            assetsPath: undefined,
        }
    },
    mounted() {
        this.transform();
    },
    methods: {
        complete() {
            this.transform();
            this.$refs.lottie.init();

        },
        play() {
            this.$refs.lottie.play();
        },
        transform() {
            let logoCopy = [...logo];
            const random = Math.floor(Math.random()*logoCopy.length)

            let logo1 = logoCopy[random];
            logoCopy = logoCopy.filter((valur, key) => key !== random);

            let logo2 = logoCopy[Math.floor(Math.random()*logoCopy.length)];

            const data = {... animationData.default};

            this.assetsPath = logo1.substring(0, logo1.lastIndexOf("/") + 1);
            data.assets[0].p = logo1.replace(/^.*[\\\/]/, '');
            data.assets[1].p = logo2.replace(/^.*[\\\/]/, '');

            this.animationData = data;
        }
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
            bottom: 0;
        }

        a.star {
            border-bottom: 2px solid $tertiary;
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
