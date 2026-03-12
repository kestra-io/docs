<template>
    <section class="community">
        <CommunityGradient />
        <div class="container">
            <div class="header">
                <img
                    :src="contributorsImg.src"
                    alt="community Statistics"
                    width="236"
                    height="80"
                />
                <h2>Kestra is built in the open</h2>
                <p>
                    Inspire and get inspired. Join our community of maintainers and <br
                    /> contributors and help us improve our open-source product.
                </p>
            </div>

            <div class="stats-grid">
                <NoGapGrid :items="communityStats" :inverted="true" />
            </div>

            <div class="cta">
                <Link
                    href="https://github.com/kestra-io/kestra"
                    class="btn btn-secondary"
                    text="Follow on GitHub"
                />
                <Link
                    href="https://github.com/kestra-io/kestra/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen"
                    class="btn btn-primary"
                    text="Find Open Issues"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from "vue";
    import CommunityGradient from "~/components/community/assets/CommunityGradient.vue";
    import NoGapGrid from "~/components/common/NoGapGrid.vue";
    import Link from "~/components/common/Link.vue";
    import contributorsImg from "~/components/community/assets/contributors.png";

    import StarOutline from "vue-material-design-icons/StarOutline.vue";
    import DirectionsFork from "vue-material-design-icons/DirectionsFork.vue";
    import BugCheckOutline from "vue-material-design-icons/BugCheckOutline.vue";
    import SourcePull from "vue-material-design-icons/SourcePull.vue";
    import SourceCommit from "vue-material-design-icons/SourceCommit.vue";
    import AccountSupervisorCircle from "vue-material-design-icons/AccountSupervisorCircle.vue";

    import { useApi } from "~/composables/useApi";
    import { $fetch } from "~/utils/fetch";

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
        forks: number;
    }

    const api = useApi();
    const metrics = ref<GitHubMetrics>({
        stars: 0,
        forks: 0,
        issues: 0,
        pullRequests: 0,
        commits: 0,
        contributors: 0,
    });

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("en-US").format(num);
    };

    const communityStats = computed(() => [
        {
            icon: StarOutline,
            title: "Stars",
            description: formatNumber(metrics.value.stars),
        },
        {
            icon: DirectionsFork,
            title: "Forks",
            description: formatNumber(metrics.value.forks),
        },
        {
            icon: BugCheckOutline,
            title: "Issues",
            description: formatNumber(metrics.value.issues),
        },
        {
            icon: SourcePull,
            title: "Pull requests",
            description: formatNumber(metrics.value.pullRequests),
        },
        {
            icon: SourceCommit,
            title: "Commits",
            description: formatNumber(metrics.value.commits),
        },
        {
            icon: AccountSupervisorCircle,
            title: "Contributors",
            description: formatNumber(metrics.value.contributors),
        },
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
                stars: github.stargazers ?? 0,
                forks: github.forks ?? 0,
                issues: mData?.issues ?? 0,
                pullRequests: mData?.pullRequests ?? 0,
                commits: mData?.commits ?? 0,
                contributors: Array.isArray(cData) ? cData.length : (github as any).contributors ?? 0,
            };
        } catch (error) {
            console.error("Error fetching community metrics:", error);
            // fallback gracefully
        }
    };

    onMounted(fetchData);
</script>

<style lang="scss" scoped>


    .community {
        position: relative;
        overflow: hidden;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 32px;
        padding-top: 90px;
        padding-bottom: 140px;
        background: var(--ks-background-primary-inverse);

        .container {
            @include media-breakpoint-down(md) {
                padding-inline: 1rem;
            }
        }

        .header {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            position: relative;
            z-index: 1;

            h2,
            p {
                color: var(--ks-content-primary-inverse);
                margin-bottom: 0;
            }
        }

        .stats-grid {
            width: 100%;
            overflow: hidden;
            position: relative;
            margin: 2rem 0;
            z-index: 1;
            border-radius: $border-radius-lg;
            background: var(--ks-background-primary-inverse);

            :deep(.feature-card) {
                text-align: center;
            }

            :deep(.feature-icon) {
                align-self: center !important;
                font-size: 40px !important;
                width: 40px !important;
                height: 40px !important;
            }

            :deep(.feature-title) {
                font-size: $h1-font-size !important;
            }
        }

        .cta {
            position: relative;
            z-index: 10;
            display: flex;
            gap: 1rem;
            justify-content: center;

            @include media-breakpoint-down(sm) {
                flex-direction: column;
            }
        }
    }
</style>
