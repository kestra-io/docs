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
                subtitle="Join the community"
            >
                <div class="metrics">
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="stargazers || 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Stars</p>
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.forks : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Forks</p>
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.issues : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Issues</p>
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.pullRequests : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Pull Requests</p>
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="contributors ? contributors.length : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Contributors</p>
                    </div>
                </div>

                <div class="text-center mt-5 d-flex align-items-center justify-content-center flex-wrap gap-3 px-4">
                    <NuxtLink href="https://github.com/kestra-io/kestra" target="_blank" class="btn btn-animated btn-dark-animated btn-dark" data-aos="zoom-in">Give a star</NuxtLink>
                    <NuxtLink href="https://kestra.io/slack" target="_blank" class="btn btn-animated btn-purple-animated btn-purple" data-aos="zoom-in">Join the Community</NuxtLink>
                    <NuxtLink href="/docs/getting-started/contributing" class="btn btn-animated btn-dark-animated btn-dark" data-aos="zoom-in">Contribute</NuxtLink>
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
    import {useApi} from "~/composables/useApi.js";
    import axios from "axios";

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
        setup() {
            return {useApi}
        },
        data() {
            return {
                contributors: undefined,
                contributorsRand: undefined,
                metrics: undefined,
                imgPoss: [],
                stargazers: undefined,
            };
        },

        async created() {
            try {
                const [metrics, contributors] = await Promise.all([
                    this.useApi().get('/communities/github/metrics'),
                    this.useApi().get('/communities/github/contributors')
                ])
                this.metrics = metrics.data
                this.contributors = contributors.data

            } catch (e) {
                this.contributors = []
                this.metrics = {}
            }
        },

        async mounted() {
          const response = await axios.get('/api/github')
          this.stargazers = response.data.stargazers;
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
        position: relative;
        display: flex;

        :deep(section) {
            padding: 2rem 0;
            border-radius: 8px;
            border: $block-border;
            background: $black-2;
            .subtitle {
                font-weight: 400;
                font-size: $font-size-sm;
            }
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
            gap: $spacer calc($spacer * 2.57);
            @include media-breakpoint-down(xxl) {
                gap: $spacer calc($spacer * 1.57);
            }
            flex-flow: row wrap;
        }

        .container {
            flex-grow: 1;

            .line-separator {
                width: calc($spacer * 0.063);
                background-color: #242427;
                @include media-breakpoint-down(xl) {
                    display: none;
                }
            }

            .counter-box {
                text-align: center;
                font-family: $font-family-sans-serif;
                font-style: normal;
                h5 {
                    color: $white !important;
                    font-size: 58px;
                    font-weight: 700;
                }

                p {
                    color: #ABABB2;
                    font-size: 14px;
                    font-weight: 500;
                    text-transform: uppercase;
                }
            }
        }
    }
</style>