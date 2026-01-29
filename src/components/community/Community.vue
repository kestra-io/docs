<template>
    <div class="container-fluid hide-overflow">
        <div class="container">
            <div class="row">
                <div class="col-md-6 text-right">
                    <NuxtImg v-bind="ContributorsImg" class="mb-4 img-fluid" data-usal="fade-l" />
                    <h2 class="mb-4" data-usal="fade-l">Kestra is built in the open</h2>
                    <p data-usal="fade-r">
                        Inspire and get inspired. Join our community of maintainers and contributors
                        and help us improve our open-source product.
                    </p>
                </div>
                <div class="col-md-6">
                    <div class="row community">
                        <div class="col-6 col-md-4" data-usal="fade-r">
                            <Star title="" />
                            <p>
                                Stars <br />
                                <span class="number" :data-usal="`count-[${metrics ? metrics.stars : 0}] duration-4000`">
                                    {{metrics ? metrics.stars : 0}}
                                </span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-usal="fade-r">
                            <DirectionsFork title="" />
                            <p>
                                Forks <br />
                                <span class="number" :data-usal="`count-[${metrics ? metrics.forks : 0}] duration-4000`">
                                    {{metrics ? metrics.forks : 0}}
                                </span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-usal="fade-r">
                            <BugOutline title="" />
                            <p>
                                Issues <br />
                                <span class="number" :data-usal="`count-[${metrics ? metrics.issues : 0}] duration-4000`">
                                    {{metrics ? metrics.issues : 0}}
                                </span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-usal="fade-r">
                            <BugOutline title="" />
                            <p>
                                Pull requests <br />
                                <span class="number" :data-usal="`count-[${metrics ? metrics.pullRequests : 0}] duration-4000`">
                                    {{metrics ? metrics.pullRequests : 0}}
                                </span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-usal="fade-r">
                            <SourceCommitLocal title="" />
                            <p>
                                Commits <br />
                                <span class="number" :data-usal="`count-[${metrics ? metrics.commits : 0}] duration-4000`">
                                    {{metrics ? metrics.commits : 0}}
                                </span>
                            </p>
                        </div>
                        <div class="col-6 col-md-4" data-usal="fade-r">
                            <AccountGroupOutline title="" />
                            <p>
                                Contributors <br />
                                <span class="number" :data-usal="`count-[${contributors ? contributors.length : 0}] duration-4000`">
                                    {{contributors ? contributors.length : 0}}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container text-center community-links mb-3">
                <a
                    href="https://github.com/kestra-io/kestra"
                    data-usal="zoomin"
                    class="btn btn-animated btn-dark-animated mt-2 mx-2"
                >
                    Follow on GitHub
                </a>
                <a
                    href="https://github.com/kestra-io/kestra/issues"
                    data-usal="zoomin"
                    class="btn btn-animated btn-purple-animated mt-2"
                >
                    Find Open Issues
                </a>
            </div>
        </div>
    </div>
    <svg width="0" height="0">
        <defs>
            <linearGradient
                id="featureiconsgradient"
                x1="4.99595"
                y1="6.83411"
                x2="31.2214"
                y2="33.0161"
                gradientUnits="userSpaceOnUse"
            >
                <stop offset="0.015625" stop-color="#F2D5FF" />
                <stop offset="1" stop-color="#CB5AFF" />
            </linearGradient>
        </defs>
    </svg>
</template>

<script setup lang="ts">
    import SourceCommitLocal from "vue-material-design-icons/SourceCommitLocal.vue"
    import Star from "vue-material-design-icons/Star.vue"
    import DirectionsFork from "vue-material-design-icons/DirectionsFork.vue"
    import BugOutline from "vue-material-design-icons/BugOutline.vue"
    import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue"
    import { useApi } from "~/composables/useApi"
    import { onMounted, ref } from "vue"
    import { $fetch } from "~/utils/fetch"
    import ContributorsImg from "./assets/contributors.png"

    interface GitHubMetrics {
        stars: number
        forks: number
        issues: number
        pullRequests: number
        commits: number
    }

    interface GitHubResponse {
        stargazers: number
    }

    const api = useApi()
    const metrics = ref<GitHubMetrics | undefined>(undefined)
    const contributors = ref<any[] | undefined>(undefined)

    const fetchData = async (): Promise<void> => {
        try {
            const githubResponse = await $fetch<GitHubResponse>("/api/github")

            const [metricsResponse, contributorsResponse] = await Promise.all([
                api.get("/communities/github/metrics"),
                api.get("/communities/github/contributors"),
            ])

            metrics.value = {
                stars: githubResponse.stargazers,
                forks: (metricsResponse as any).data?.forks,
                issues: (metricsResponse as any).data?.issues,
                pullRequests: (metricsResponse as any).data?.pullRequests,
                commits: (metricsResponse as any).data?.commits,
            }

            contributors.value = (contributorsResponse as any).data
        } catch (error) {
            contributors.value = []
        }
    }

    onMounted(fetchData)
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        color: var(--bs-white);
        background: url("./assets/community-bg.svg") no-repeat right;

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
        min-height: calc($spacer * 4.135);
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
                content: "";
                position: absolute;
                top: -0.5px;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: -1;
                margin: -1px;
                border-radius: inherit;
                background: linear-gradient(
                    90deg,
                    rgba(176, 16, 251, 1) 0%,
                    rgba(222, 151, 255, 1) 14%,
                    rgba(162, 39, 219, 1) 28%,
                    rgba(255, 255, 255, 0.4654236694677871) 50%,
                    rgba(166, 16, 236, 0.8435749299719888) 72%
                );
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