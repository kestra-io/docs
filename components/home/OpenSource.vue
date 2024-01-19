<template>
    <div class="main join-community">
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
                subtitle="Join the community"
            >
                <div class="metrics">
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.stars : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Stars</p>
                    </div>
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.forks : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Forks</p>
                    </div>
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.issues : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Issues</p>
                    </div>
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.pullRequests : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Pull Requests</p>
                    </div>
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="contributors ? contributors.length : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Contributors</p>
                    </div>
                </div>

                <div class="text-center mt-5 d-flex align-items-center justify-content-center flex-wrap gap-3 px-4">
                    <a href="https://github.com/kestra-io/kestra" target="_blank" class="btn btn-dark" data-aos="zoom-in">Give a star</a>
                    <a href="https://kestra.io/slack" target="_blank" class="btn btn-primary" data-aos="zoom-in">Join the Community</a>
                    <a href="#" target="_blank" class="btn btn-dark" data-aos="zoom-in">Contributer</a>
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

        async created() {
            try {
                const [metrics, contributors] = await Promise.all([
                    kestraInstance.get('/communities/github/metrics'),
                    kestraInstance.get('/communities/github/contributors')
                ])
                this.metrics = metrics.data
                this.contributors = contributors.data

            } catch (e) {
                this.contributors = []
                this.metrics = {}
            }
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

<style lang="scss">
    @import "../../assets/styles/variable";
    .join-community {
        position: relative;
        display: flex;

        section {
            border-radius: 8px;
            border: 1px solid $black-3;
            background: $black-2;

            .main {
                background-color: $black-2 !important;
            }
        }

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

        .metrics {
            padding-left: calc($spacer * 2);
            padding-right: calc($spacer * 2);
            margin: 0 auto;
            display: flex;
            justify-content: center;
            gap: $spacer calc($spacer * 2);
            flex-flow: row wrap;
        }

        .container {
            flex-grow: 1;

            .counter-box {
                text-align: center;
                font-family: $font-family-sans-serif;
                font-style: normal;
                h5 {
                    color: $white !important;
                    font-size: 58px;
                    font-weight: 700;
                    line-height: 22px;
                }

                p {
                    color: #ABABB2;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 65px;
                    text-transform: uppercase;
                }
            }
        }

        .btn-dark {
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            background: $black-4 !important;
        }

    }
</style>