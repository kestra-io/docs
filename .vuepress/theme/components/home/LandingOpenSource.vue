<template>
    <section class="section bg-dark overflow-hidden">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 text-center">
                    <div class="section-title mb-4 pb-2">
                        <h4 class="title mb-4 text-white" data-aos="fade-left">Open-source without limitations</h4>

                        <p data-aos="fade-right" class="text-white para-desc mx-auto mb-0">
                            Customize, create plugins and add features, <strong>deploy anywhere</strong> (Kubernetes, Cloud Compute, Docker or even on premise) and enjoy <strong>no lock-in</strong> of the open-source ecosystems.
                            Join the community and help us build the best open source orchestration and scheduling platform.
                        </p>

                        <p class="text-center">
                            <a
                                href="https://github.com/kestra-io/kestra"
                                target="_blank"
                                class="text-light btn btn-light title-dark mt-3 mr-1"
                                data-aos="zoom-in"
                            >
                                <github-icon class="fea icon-sm fea-social"></github-icon> Star us on GitHub
                                <ArrowRight title="" />
                            </a>

                            <a
                                href="https://api.kestra.io/v1/communities/slack/redirect"
                                target="_blank"
                                class="text-light btn btn-light title-dark mt-3 mr-1"
                                data-aos="zoom-in"
                            >
                                <slack title="" /> Chat with us on Slack
                                <ArrowRight title="" />
                            </a>

                            <a
                                href="https://twitter.com/kestra_io"
                                target="_blank"
                                class="text-light btn btn-light title-dark mt-3 mr-1"
                                data-aos="zoom-in"
                            >
                                <TwitterIcon title="" /> Follow us on Twitter
                                <ArrowRight title="" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/kestra"
                                target="_blank"
                                class="text-light btn btn-light title-dark mt-3 mr-1"
                                data-aos="zoom-in"
                            >
                                <LinkedinIcon title="" /> Follow us on LinkedIn
                                <ArrowRight title="" />
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <Shape class="text-white" />
    </section>
</template>

<script>
    import Shape from "../layout/Shape";
    import ArrowRight from 'vue-material-design-icons/ArrowRight'
    import Slack from 'vue-material-design-icons/Slack'
    import {GithubIcon, TwitterIcon, LinkedinIcon} from 'vue-feather-icons';

    export default {
        data() {
            return {}
        },
        components: {Shape, ArrowRight, GithubIcon, TwitterIcon, LinkedinIcon, Slack}
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
