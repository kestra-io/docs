<template>
    <div class="container">
        <Section
            title="Our contributors"
            subtitle="Orchestrate Success Together"
        >
        <div v-if="contributors" class="contributors left" id="bla">
            <template v-for="contributor in contributorsPartition(0)">
                <a :href="'https://github.com/' + contributor.name" target="_blank" class="name text-dark">
                    <img
                        :src="contributor.avatar"
                        class="rounded-circle"
                        :width="contributor.size"
                        alt=""
                    />
                </a>
            </template>
        </div>
            <div v-if="contributors" class="contributors right">
                <template v-for="contributor in contributorsPartition(10)">
                    <a :href="'https://github.com/' + contributor.name" target="_blank" class="name text-dark">
                        <img :src="contributor.avatar" class="img-fluid avatar avatar-small rounded-circle" :width="contributor.size" alt="">
                    </a>
                </template>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    import axios from "axios";

    export default {
        components: {Section},
        data() {
            return {
                contributors: undefined,
                contributorsRand: undefined
            };
        },
        created() {
            axios.get("https://api.kestra.io/v1/communities/github/contributors")
                .then(response => {
                    this.contributors = response.data;
                    this.contributorsRand = this.contributors.sort(() => 0.5 - Math.random()).slice(0, 20)
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
    }
</style>