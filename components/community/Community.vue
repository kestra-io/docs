<template>
    <div class="container-fluid hide-overflow">
        <div class="container">
            <div class="row">
                <div class="col-md-6 text-right">
                    <img data-aos="fade-left" src="/landing/community/contributors.png" class="mb-4 img-fluid"/>
                    <h2 class="mb-4" data-aos="fade-left">Kestra is built in the open</h2>
                    <p data-aos="fade-right">
                        Inspire and get inspired. Join our community of maintainers and contributors and help us improve
                        our open-source product.
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
                <NuxtLink
                    href="https://github.com/kestra-io/kestra"
                    data-aos="zoom-in"
                    class="btn btn-animated btn-dark-animated mt-2 mx-2"
                >
                    Follow on GitHub
                </NuxtLink>
                <NuxtLink
                    href="https://github.com/kestra-io/kestra/issues"
                    data-aos="zoom-in"
                    class="btn btn-animated btn-purple-animated
                     mt-2"
                >
                    Find Open Issues
                </NuxtLink>
            </div>
        </div>
    </div>
    <svg width="0" height="0">
        <defs>
            <linearGradient id="featureiconsgradient" x1="4.99595" y1="6.83411" x2="31.2214" y2="33.0161" gradientUnits="userSpaceOnUse">
                <stop offset="0.015625" stop-color="#F2D5FF"/>
                <stop offset="1" stop-color="#CB5AFF"/>
            </linearGradient>
        </defs>
    </svg>
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
    import {useApi} from "~/composables/useApi.js";

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
        setup() {
            return {useApi}
        },
        data() {
            return {
                metrics: undefined,
                contributors: undefined
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
        }
    }
</script>


<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);
        background: url("/landing/community/community-bg.svg") no-repeat right;

        &.hide-overflow {
            overflow: hidden;
        }

        h2 {
            font-size: $h2-font-size;
            font-weight: 300;
        }

        .container {
            & > .row {
                padding: calc($spacer * 2);
                padding-top: calc($spacer * 4);

                .text-right {
                    text-align: right;

                    @include media-breakpoint-up(md) {
                        border-right: 1px solid $black-6;
                        padding-right: calc($spacer * 3);
                    }

                    @include media-breakpoint-down(md) {
                        border-bottom: 1px solid $black-6;
                        padding-bottom: calc($spacer * 3);
                        margin-bottom: calc($spacer * 3);
                    }
                }
            }

            .container {
                border-bottom: $block-border;
                margin-bottom: 0 !important;
                padding-bottom: calc($spacer * 4);
            }
        }
    }

    .images-contributors {
        display: flex;
        position: relative;
        justify-content: flex-end;
        min-height: calc($spacer * 4.135);;
        img {
            border-radius: 50%;
            height: calc($spacer * 4.135);
            position: absolute;
        }
    }
    .community {
        text-align: center;
        color: $white;

        :deep(.material-design-icon) {
            border-radius: $border-radius-lg;
            background: $black-4;
            font-size: 2rem;
            padding: 1.5rem;
            align-items: center;
            justify-content: center;

            svg path {
                fill: url(#featureiconsgradient);
            }

            &:before {
                content: '';
                position: absolute;
                top: -0.5px; right: 0; bottom: 0; left: 0;
                z-index: -1;
                margin: -1px;
                border-radius: inherit;
                background: linear-gradient(90deg, rgba(176,16,251,1) 0%, rgba(222,151,255,1) 14%, rgba(162,39,219,1) 28%, rgba(255,255,255,0.4654236694677871) 50%, rgba(166,16,236,0.8435749299719888) 72%);
            }

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