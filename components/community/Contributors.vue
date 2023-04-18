<template>
    <div class="container">
        <Section
            title="Our contributors"
            subtitle="Orchestrate Success Together"
        >
            <div v-if="contributors" class="contributors">
                <template v-for="(contributor) in contributorsRand">
                    <a :href="'https://github.com/' + contributor.name" target="_blank" class="name text-dark">
                        <img
                            :src="contributor.avatar"
                            :alt="contributor.username"
                        />
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
                    this.contributorsRand = this.contributors
                        .sort(() => 0.5 - Math.random());
                })
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
            width: 90px;
        }
    }
</style>