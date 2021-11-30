<template>
    <section class="section bg-white mt-6 pt-5 pb-5">
        <Shape class="text-white" />

        <div class="container mb-7">
            <div class="row justify-content-center">
                <div class="col-12 text-center">
                    <div class="section-title mb-4 pb-2">
                        <h4 class="title mb-4">Build with cloud native technologies</h4>
                        <p class="text-muted para-desc mx-auto mb-0">Enjoy <span class="text-primary font-weight-bold">infinitely scalability</span>
                            since <strong>Kestra</strong> was built from inception with cloud native concept and rely on
                            top technologies with no Single Point of Failure.<br />
                            Grow from few executions to millions without the pain.
                        </p>
                    </div>
                </div>
                <!--end col-->
            </div>
            <!--end row-->

            <div class="row justify-content-center">
                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://kafka.apache.org/">
                        <img src="landing/tech/kafka.png" class="avatar" alt="">
                    </a>
                </div>
                <!--end col-->

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://kafka.apache.org/26/documentation/streams/">
                        <img src="landing/tech/kafka-stream.png" class="avatar" alt="">
                    </a>
                </div>
                <!--end col-->

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://elastic.co/">
                        <img src="landing/tech/elasticsearch.png" class="avatar" alt="">
                    </a>
                </div>
                <!--end col-->

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://www.java.com/">
                        <img src="landing/tech/java.png" class="avatar" alt="">
                    </a>
                </div>
                <!--end col-->

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://micronaut.io/">
                        <img src="landing/tech/micronaut.svg" class="avatar" alt="">
                    </a>
                </div>
                <!--end col-->

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="http://kubernetes.io/">
                        <img src="landing/tech/kubernetes.png" class="avatar" alt="">
                    </a>
                </div>
                <!--end col-->

            </div>
            <!--end row-->
        </div>
    </section>
</template>

<script>
    import Shape from "../layout/Shape";
    export default {
        data() {
            return {}
        },
        components: {Shape}
    }
</script>

<style lang="scss" scoped>
    @import ".vuepress/theme/styles/variables";

    /deep/ .shape-wrapper.text-white .shape {
        top: -8rem;

        @media (max-width: map-get($grid-breakpoints, "md")) {
            top: -60px;
        }
    }

    .tech-avatar {
        height: 50px;
        vertical-align: center;

        a {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        img {
            max-height:50px;
            filter: grayscale(1);
            transition: 0.2s;
        }

        &:hover {
            img {
                filter: grayscale(0);
                transform: scale(1.05);
            }
        }
    }
</style>
