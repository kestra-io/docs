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
                    Inspire and get inspired. Join our community of maintainers
                    and <br />
                    contributors and help us improve our open-source product.
                </p>
            </div>

            <div class="stats-grid">
                <NoGapGrid
                    :items="communityStats"
                    :inverted="true"
                    heading-level="h3"
                />
            </div>

            <div class="cta">
                <Link
                    href="https://github.com/kestra-io/kestra"
                    class="btn btn-secondary"
                    text="Follow on GitHub"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import CommunityGradient from "~/components/community/assets/CommunityGradient.vue"
    import NoGapGrid from "~/components/common/NoGapGrid.vue"
    import Link from "~/components/common/Link.vue"
    import contributorsImg from "~/components/community/assets/contributors.png"
    import type { GitHubMetrics } from "~/components/community/types"

    import StarOutline from "vue-material-design-icons/StarOutline.vue"
    import DirectionsFork from "vue-material-design-icons/DirectionsFork.vue"
    import BugCheckOutline from "vue-material-design-icons/BugCheckOutline.vue"
    import SourcePull from "vue-material-design-icons/SourcePull.vue"
    import SourceCommit from "vue-material-design-icons/SourceCommit.vue"
    import AccountSupervisorCircle from "vue-material-design-icons/AccountSupervisorCircle.vue"

    const props = defineProps<{
        metrics: GitHubMetrics
    }>()

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat("en-US").format(num ?? 0)
    }

    const communityStats = computed(() => [
        {
            icon: StarOutline,
            title: "Stars",
            description: formatNumber(props.metrics.stars),
        },
        {
            icon: DirectionsFork,
            title: "Forks",
            description: formatNumber(props.metrics.forks),
        },
        {
            icon: BugCheckOutline,
            title: "Issues",
            description: formatNumber(props.metrics.issues),
        },
        {
            icon: SourcePull,
            title: "Pull requests",
            description: formatNumber(props.metrics.pullRequests),
        },
        {
            icon: SourceCommit,
            title: "Commits",
            description: formatNumber(props.metrics.commits),
        },
        {
            icon: AccountSupervisorCircle,
            title: "Contributors",
            description: formatNumber(props.metrics.contributors),
        },
    ])
</script>

<style lang="scss" scoped>
    @use "/src/assets/styles/color-palette" as *;

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

            :deep(.btn-secondary) {
                --ks-content-primary: #fff;
                --ks-background-button-secondary: transparent;
                --ks-content-btn-secondary-hover: #{$base-grey-800};
                --ks-background-button-secondary-hover: #fff;
                border-color: #fff;
            }
        }
    }
</style>