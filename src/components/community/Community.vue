<template>
    <section class="container-fluid hide-overflow">
        <div class="container">
            <div class="row align-items-center mb-5">
                <div class="col-md-6 text-right info-section">
                    <NuxtImg :src="ContributorsImg.src" class="mb-4 img-fluid" data-usal="fade-l" alt="Contributors" />
                    <h2 class="mb-4" data-usal="fade-l">Kestra is built in the open</h2>
                    <p data-usal="fade-r">
                        Inspire and get inspired. Join our community of maintainers and contributors
                        and help us improve our open-source product.
                    </p>
                </div>
                <div class="col-md-6">
                    <div class="row community">
                        <div v-for="item in metricsData" :key="item.label" class="col-6 col-md-4 metric-card" data-usal="fade-r">
                            <div class="icon-wrapper">
                                <component :is="item.icon" />
                            </div>
                            <p>
                                {{ item.label }} <br />
                                <span class="number" :data-usal="`count-[${item.value}] duration-4000`">
                                    {{ item.value }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center community-links mb-3">
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
    </section>
    <svg width="0" height="0" class="position-absolute">
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
    import { ref, onMounted, computed, markRaw } from "vue";
    import SourceCommitLocal from "vue-material-design-icons/SourceCommitLocal.vue";
    import Star from "vue-material-design-icons/Star.vue";
    import DirectionsFork from "vue-material-design-icons/DirectionsFork.vue";
    import BugOutline from "vue-material-design-icons/BugOutline.vue";
    import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue";
    import { useApi } from "~/composables/useApi";
    import { $fetch } from "~/utils/fetch";
    import ContributorsImg from "./assets/contributors.png";

    interface GitHubMetrics {
        stars: number;
        forks: number;
        issues: number;
        pullRequests: number;
        commits: number;
        contributors: number;
    }

    interface GitHubResponse {
        stargazers: number;
    }

    const api = useApi();
    const metrics = ref<GitHubMetrics | undefined>(undefined);

    const metricsData = computed(() => [
        { label: "Stars", value: metrics.value?.stars ?? 0, icon: markRaw(Star) },
        { label: "Forks", value: metrics.value?.forks ?? 0, icon: markRaw(DirectionsFork) },
        { label: "Issues", value: metrics.value?.issues ?? 0, icon: markRaw(BugOutline) },
        { label: "Pull requests", value: metrics.value?.pullRequests ?? 0, icon: markRaw(BugOutline) },
        { label: "Commits", value: metrics.value?.commits ?? 0, icon: markRaw(SourceCommitLocal) },
        { label: "Contributors", value: metrics.value?.contributors ?? 0, icon: markRaw(AccountGroupOutline) },
    ]);

    const fetchData = async () => {
        try {
            const [github, githubMetrics, githubContributors] = await Promise.all([
                $fetch<GitHubResponse>("/api/github"),
                api.get("/communities/github/metrics"),
                api.get("/communities/github/contributors"),
            ]);

            const mData = (githubMetrics as any).data;
            const cData = (githubContributors as any).data;

            metrics.value = {
                stars: github.stargazers,
                forks: mData?.forks ?? 0,
                issues: mData?.issues ?? 0,
                pullRequests: mData?.pullRequests ?? 0,
                commits: mData?.commits ?? 0,
                contributors: Array.isArray(cData) ? cData.length : 0,
            };
        } catch (error) {
            console.error("Error fetching community metrics:", error);
            metrics.value = { stars: 0, forks: 0, issues: 0, pullRequests: 0, commits: 0, contributors: 0 };
        }
    };

    onMounted(fetchData);
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        color: var(--ks-content-primary);
        background: url("./assets/community-bg.svg") no-repeat right;
        background-color: var(--ks-background-tertiary);
        padding: 4rem 0;
        overflow: hidden;
        .info-section {
            text-align: right;
            padding-right: 3rem;
            @include media-breakpoint-down(md) {
                margin-bottom: 3rem;
                border-bottom: $block-border;
                padding-bottom: 3rem;
                padding-right: 0;
                text-align: center;
            }
            @include media-breakpoint-up(md) {
                border-right: $block-border;
            }
            p {
                max-width: 500px;
                margin: 0 auto;
            }
        }
        .community {
            text-align: center;
            .metric-card {
                margin-bottom: 2rem;
                transition: transform 0.3s ease;
                &:hover {
                    transform: translateY(-5px);
                }
                .icon-wrapper {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 1rem;
                    background: color-mix(in srgb, var(--ks-background-secondary), transparent 20%);
                    border: 1px solid transparent;
                    backdrop-filter: blur(4px);
                    font-size: 2rem;
                    padding: 1rem;
                    position: relative;
                    margin-bottom: 1rem;
                    &::before {
                        content: "";
                        position: absolute;
                        inset: 0;
                        border-radius: inherit;
                        padding: 1px;
                        background: linear-gradient(145deg, #b010fb 0%, rgba(222, 151, 255, 0.5) 30%, rgba(162, 39, 219, 0.2) 50%, rgba(255, 255, 255, 0.1) 80%, #a610ec 100%);
                        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                        -webkit-mask-composite: xor;
                        mask-composite: exclude;
                        pointer-events: none;
                    }
                    :deep(.material-design-icon) {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        filter: drop-shadow(2px 4px 4px rgba(186, 53, 249, 0.25));
                        svg path {
                            fill: url(#featureiconsgradient);
                        }
                        > .material-design-icon__svg {
                            bottom: 0;
                        }
                    }
                }
                p {
                    color: var(--ks-content-tertiary);
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin: 0;
                    .number {
                        display: block;
                        font-size: 2rem;
                        font-weight: 700;
                        margin-top: 0.25rem;
                        color: var(--ks-content-primary);
                    }
                }
            }
        }
        .community-links {
            margin-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 3rem;
            .btn {
                padding: 0.75rem 2rem;
                font-weight: 600;
                border-radius: 0.5rem;
            }
        }
    }
</style>