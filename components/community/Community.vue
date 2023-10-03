<template>
    <div class="container-fluid bg-body-tertiary hide-overflow">
        <div class="container">
            <div class="row">
                <div class="col-md-6 text-right">
                    <img data-aos="fade-left" src="/landing/community/contributors.png" class="mb-5 img-fluid"/>
                    <h2 data-aos="fade-left">Kestra is built by the open-source community</h2>
                    <p data-aos="fade-right">
                        Inspire and get inspired. Join our community of maintainers and contributors and help us make
                        Kestra better!
                    </p>
                </div>
                <div class="col-md-6">
                    <div class="row community">
                        <div class="col-6 col-md-4" data-aos="fade-right">
                            <Star title=""/>
                            <p>
                                Stars <br>
                                <span class="number"><CountTo :endVal="metrics ? metrics.stars : 0"
                                                              :duration="4000"></CountTo></span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-aos="fade-right">
                            <DirectionsFork title=""/>
                            <p>
                                Forks <br>
                                <span class="number"><CountTo :endVal="metrics ? metrics.forks : 0"
                                                              :duration="4000"></CountTo></span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-aos="fade-right">
                            <BugOutline title=""/>
                            <p>
                                Issues <br>
                                <span class="number"><CountTo :endVal="metrics ? metrics.issues : 0"
                                                              :duration="4000"></CountTo></span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-aos="fade-right">
                            <BugOutline title=""/>
                            <p>
                                Pull requests <br>
                                <span class="number"><CountTo :endVal="metrics ? metrics.pullRequests : 0"
                                                              :duration="4000"></CountTo></span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-aos="fade-right">
                            <SourceCommitLocal title=""/>
                            <p>
                                Commits <br>
                                <span class="number"><CountTo :endVal="metrics ? metrics.commits : 0"
                                                              :duration="4000"></CountTo></span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-aos="fade-right">
                            <AccountGroupOutline title=""/>
                            <p>
                                Contributors <br>
                                <span class="number"><CountTo :endVal="contributors ? contributors.length : 0"
                                                              :duration="4000"></CountTo></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container text-center community-links mb-3">
                <a href="https://github.com/kestra-io/kestra" data-aos="zoom-in" class="btn btn-dark mt-2 mx-2">Follow on GitHub</a>
                <a href="https://github.com/kestra-io/kestra/issues" data-aos="zoom-in" class="btn btn-primary mt-2">Find Open Issues</a>
            </div>
        </div>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    import {CountTo} from 'vue3-count-to';
    import SourceCommitLocal from "vue-material-design-icons/SourceCommitLocal.vue";
    import Star from "vue-material-design-icons/Star.vue";
    import DirectionsFork from "vue-material-design-icons/DirectionsFork.vue";
    import SourcePull from "vue-material-design-icons/SourcePull.vue";
    import BugOutline from "vue-material-design-icons/BugOutline.vue";
    import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue";
    import {kestraInstance} from "~/utils/api.js";

    export default {
        components: {
            Section,
            CountTo,
            SourceCommitLocal,
            Star,
            DirectionsFork,
            SourcePull,
            BugOutline,
            AccountGroupOutline,
        },
        data() {
            return {
                metrics: undefined,
                contributors: undefined
            };
        },
        async created() {
            try {
                const [ metrics, contributors] = await Promise.all([
                    kestraInstance.get('/communities/github/metrics'),
                    kestraInstance.get('/communities/github/contributors')
                ])
                this.metrics = metrics.data
                this.contributors = contributors.data

            } catch (e) {
                this.contributors = []
                this.metrics = {}
            }
        }
    }
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-7;
        color: var(--bs-white);

        &.hide-overflow {
            overflow: hidden;
        }

        .container > .row {
            padding: calc($spacer * 2);
            padding-top: calc($spacer * 4);

            .text-right {
                text-align: right;

                @include media-breakpoint-up(md) {
                    border-right: 1px solid var(--bs-white);
                    padding-right: calc($spacer * 3);
                }

                @include media-breakpoint-down(md) {
                    border-bottom: 1px solid var(--bs-white);
                    padding-bottom: calc($spacer * 3);
                    margin-bottom: calc($spacer * 3);
                }
            }
        }
    }

    .container {
        .community-links {
            padding-bottom: calc($spacer * 2);
        }
    }

    .community {
        text-align: center;

        :deep(.material-design-icon) {
            border-radius: $border-radius-lg;
            background: var(--bs-white);
            font-size: 2rem;
            color: $primary;
            padding: 1.5rem;
            align-items: center;
            justify-content: center;

            > .material-design-icon__svg {
                bottom: 0;
                top: 15%;
            }
        }

        p {
            color: $purple-26;
            font-weight: bold;
            font-size: $font-size-sm;

            .number {
                font-size: $h3-font-size;
                margin-top: 0;
                color: var(--bs-white);
            }
        }
    }
</style>