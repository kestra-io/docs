<template>
    <div class="main">
        <div v-if="contributors && false" class="contributors left">
            <template v-for="contributor in contributorsPartition(0)">
                <a :href="'https://github.com/' + contributor.name" target="_blank" class="name text-dark">
                    <img
                        :src="contributor.avatar"
                        class="img-fluid avatar avatar-small rounded-circle"
                        :width="contributor.size"
                        alt=""
                    />
                </a>
            </template>
        </div>
        <div class="container container-min">

            <Section
                title="Join our Open Source Community"
                subtitle="Community"
                baseline="Kestra empowers you to customize and extend your data orchestration with plugins and features that can be deployed anywhere. Join our Open Source community and help us shape the best orchestration and scheduling platform on the market."
            >
                <div class="row bd-gutter metrics">
                    <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-left">
                        <div class="counter-box text-center">
                            <Star title="" />
                            <h6>Stars</h6>
                            <h5 class="mb-0 mt-2">
                                <CountTo :endVal="metrics ? metrics.stars : 0" :duration="4000"></CountTo>
                            </h5>
                        </div>
                    </div>

                    <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-left">
                        <div class="counter-box text-center">
                            <DirectionsFork title="" />
                            <h6>Forks</h6>
                            <h5 class="mb-0 mt-2">
                                <CountTo :endVal="metrics ? metrics.forks : 0" :duration="4000"></CountTo>
                            </h5>
                        </div>
                    </div>

                    <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-left">
                        <div class="counter-box text-center">
                            <BugOutline title="" />
                            <h6>Issues</h6>
                            <h5 class="mb-0 mt-2">
                                <CountTo :endVal="metrics ? metrics.issues : 0" :duration="4000"></CountTo>
                            </h5>
                        </div>
                    </div>

                    <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-right">
                        <div class="counter-box text-center">
                            <SourcePull title="" />
                            <h6>Pull Requests</h6>
                            <h5 class="mb-0 mt-2">
                                <CountTo :endVal="metrics ? metrics.pullRequests : 0" :duration="4000"></CountTo>
                            </h5>
                        </div>
                    </div>

                    <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-right">
                        <div class="counter-box text-center">
                            <SourceCommitLocal title="" />
                            <h6>Commits</h6>
                            <h5 class="mb-0 mt-2">
                                <CountTo :endVal="metrics ? metrics.commits : 0" :duration="4000"></CountTo>
                            </h5>
                        </div>
                    </div>

                    <div class="col-md-2 col-4 mt-4 pt-2" data-aos="fade-right">
                        <div class="counter-box text-center">
                            <AccountGroupOutline title="" />
                            <h6>Contributors</h6>
                            <h5 class="mb-0 mt-2">
                                <CountTo :endVal="contributors ? contributors.length : 0" :duration="4000"></CountTo>
                            </h5>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-5">
                    <a href="https://kestra.io/slack" target="_blank" class="btn btn-lg btn-primary me-2" data-aos="zoom-in">Join our slack</a>
                    <a href="https://github.com/kestra-io/kestra" target="_blank" class="btn btn-lg btn-dark" data-aos="zoom-in">Give us a ⭐</a>
                </div>
            </Section>
        </div>
        <div v-if="contributors && false" class="contributors right">
            <template v-for="contributor in contributorsPartition(10)">
                <a :href="'https://github.com/' + contributor.name" target="_blank" class="name text-dark">
                    <img :src="contributor.avatar" class="img-fluid avatar avatar-small rounded-circle" :width="contributor.size" alt="">
                </a>
            </template>
        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';
    import axios from "axios";
    import {CountTo} from 'vue3-count-to';
    import SourceCommitLocal from "vue-material-design-icons/SourceCommitLocal.vue";
    import Star from "vue-material-design-icons/Star.vue";
    import DirectionsFork from "vue-material-design-icons/DirectionsFork.vue";
    import SourcePull from "vue-material-design-icons/SourcePull.vue";
    import BugOutline from "vue-material-design-icons/BugOutline.vue";
    import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue";

    export default {
        components: {
            AccountGroupOutline,
            BugOutline,
            SourcePull,
            DirectionsFork,
            Star,
            SourceCommitLocal,
            Section,
            CountTo
        },
        data() {
            return {
                contributors: undefined,
                contributorsRand: undefined,
                metrics: undefined,
                imgPoss: [],
            };
        },

        created() {
            axios.get("https://api.kestra.io/v1/communities/github/contributors")
                .then(response => {
                    this.contributors = response.data;
                    this.contributorsRand = this.contributors.sort(() => 0.5 - Math.random()).slice(0, 20)
                })

            axios.get("https://api.kestra.io/v1/communities/github/metrics")
                .then(response => {
                    this.metrics = response.data;
                })
        },
        methods: {
            contributorsPartition(i) {
                return this.contributorsRand
                    .slice(i, i + 10)
                    .map(r => {
                        r.size = 40 + Math.random() * 100;

                        return r;
                    })
            },

        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main {
        background: #FBF7F7;
        position: relative;
        display: flex;

        .contributors {
            height: 100%;
            max-height: 100%;
            overflow: hidden;
            text-align: center;
            padding: $spacer;

            img {
                margin-right: $spacer;
                margin-bottom: $spacer;
            }

            @include media-breakpoint-down("md", $grid-breakpoints) {
                &.left, &.right {
                    display: none;
                }
            }
        }
    }

    .metrics {
        padding-left: calc($spacer * 2);
        padding-right: calc($spacer * 2);
    }

    .container {
        flex-grow: 1;

        .counter-box {
            color: $primary;

            .material-design-icon {
                background: var(--bs-white);
                border-radius: var(--bs-border-radius-lg);
                box-shadow: 0px 1.20763px 2.41527px rgba(0, 0, 0, 0.07);
                font-size: 200%;
                width: 3rem;
                height: 3rem;
                text-align: center;
                align-items: center;
                justify-content: center;

                :deep(svg) {
                    bottom: 0.250em;
                }
            }

            h5 {
                color: var(--bs-black);
            }

            h6 {
                color: $primary;
                &:after {
                    display: none;
                }
            }
        }
    }
</style>