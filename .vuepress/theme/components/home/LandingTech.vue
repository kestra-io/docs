<template>
    <section class="section bg-white overflow-hidden">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 text-center">
                    <div class="section-title mb-4 pb-2">
                        <h4 class="title mb-4" data-aos="fade-left">Build with cloud native technologies</h4>
                        <p data-aos="fade-right" class="text-muted para-desc mx-auto mb-0">Enjoy <span class="text-primary font-weight-bold">infinite scalability</span>
                            as <strong>Kestra</strong> was developed with a cloud native concept and relies on state-of-the-art technology with no single point of failure.<br />
                            Grow from only a few executions to millions, without hassle.
                        </p>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://kafka.apache.org/" data-aos="fade-right">
                        <img src="../../assets/home/tech/kafka.png" class="avatar" alt="">
                    </a>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://kafka.apache.org/26/documentation/streams/" data-aos="fade-right">
                        <img src="../../assets/home/tech/kafka-stream.png" class="avatar" alt="">
                    </a>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://elastic.co/" data-aos="fade-right">
                        <img src="../../assets/home/tech/elasticsearch.png" class="avatar" alt="">
                    </a>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://www.java.com/" data-aos="fade-left">
                        <img src="../../assets/home/tech/java.png" class="avatar" alt="">
                    </a>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="https://micronaut.io/" data-aos="fade-left">
                        <img src="../../assets/home/tech/micronaut.svg" class="avatar" alt="">
                    </a>
                </div>

                <div class="col-lg-2 col-md-2 col-6 text-center mt-4 pt-2 tech-avatar">
                    <a href="http://kubernetes.io/" data-aos="fade-left">
                        <img src="../../assets/home/tech/kubernetes.png" class="avatar" alt="">
                    </a>
                </div>
            </div>
        </div>
        <Shape class="text-bg" />
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
