<template>
    <section>
        <div class="container">
            <h2 class="text-center mb-4">Our contributors</h2>
            <div ref="topOfSection" />
            <div v-if="contributors" class="contributors d-flex flex-wrap justify-content-center">
                <template v-for="(contributor, index) in displayedContributors" :key="contributor.name">
                    <a :href="'https://github.com/' + contributor.name" target="_blank"
                        class="d-flex flex-column gap-3 align-items-center" data-usal="zoomin">
                        <img width="90px" height="90px" loading="lazy" class="rounded-circle" :src="contributor.avatar"
                            :alt="contributor.name" />
                        <p>{{ contributor.name }}</p>
                    </a>
                </template>
            </div>
            <div v-if="contributors && moreCount > 0" class="text-center mt-4">
                <button v-if="!isExpanded" type="button" class="btn btn-animated btn-dark-animated"
                    @click="isExpanded = true" data-usal="zoomin">
                    {{ moreCount }} more contributors
                </button>
                <button v-else type="button" class="btn btn-animated btn-purple-animated" @click="collapse"
                    data-usal="zoomin">
                    Show less
                </button>
            </div>
        </div>
    </section>
</template>

<script>
    import { useApi } from "~/composables/useApi.ts"

    export default {
        setup() {
            return { useApi }
        },
        data() {
            return {
                contributors: undefined,
                contributorsRand: undefined,
                isExpanded: false,
                regularCount: 24,
            }
        },
        computed: {
            sortedByContributions() {
                if (!this.contributors || this.contributors.length === 0) {
                    return []
                }
                const sample = this.contributors[0] || {}
                const hasContribField = Object.prototype.hasOwnProperty.call(
                    sample,
                    "contributions",
                )
                if (hasContribField) {
                    return [...this.contributors].sort(
                        (a, b) => (b.contributions || 0) - (a.contributions || 0),
                    )
                }
                return this.contributorsRand || []
            },
            regularContributors() {
                return (this.sortedByContributions || []).slice(0, this.regularCount)
            },
            displayedContributors() {
                if (this.isExpanded) {
                    return this.contributorsRand || []
                }
                return this.regularContributors || []
            },
            moreCount() {
                const total = this.contributors ? this.contributors.length : 0
                const shown = this.regularContributors ? this.regularContributors.length : 0
                const remaining = total - shown
                return remaining > 0 ? remaining : 0
            },
        },
        async created() {
            try {
                const { data } = await this.useApi().get("/communities/github/contributors")
                this.contributors = data
                this.contributorsRand = this.contributors.toSorted(() => 0.5 - Math.random())
            } catch (e) {
                this.contributors = []
            }
        },
        methods: {
            collapse() {
                this.isExpanded = false
                // Smoothly scroll back to the top of the contributors section
                try {
                    this.$refs.topOfSection?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    })
                } catch (e) {
                    // no-op
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        padding: $rem-3 $rem-1;
    }
    
    .contributors {
        height: 100%;
        max-height: 100%;
        overflow: hidden;
        text-align: center;
        padding: $spacer;
        column-gap: 2rem;
        row-gap: 4rem;
        a {
            width: fit-content;
            color: var(--ks-content-link);
            img {
                width: 100px;
            }
        }
    }
</style>