<template>
    <div class="container">
        <Section
            subtitle="Our contributors"
        >
            <div v-if="contributors" class="contributors d-flex flex-wrap justify-content-center">
                <template v-for="(contributor, index) in contributorsRand">
                    <ClientOnly>
                        <template #fallback>
                            <a :href="'https://github.com/' + contributors[index].name" />
                        </template>
                        <a :href="'https://github.com/' + contributor.name" target="_blank" class="d-flex flex-column gap-3 align-items-center" data-aos="zoom-in" >
                            <NuxtImg
                                width="90px"
                                height="90px"
                                loading="lazy"
                                format="webp"
                                class="rounded-circle"
                                :src="contributor.avatar"
                                :alt="contributor.name"
                            />
                            <p>{{contributor.name}}</p>
                        </a>
                    </ClientOnly>
                </template>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    import {useApi} from "~/composables/useApi.js";

    export default {
        components: {Section},
        setup() {
            return {useApi}
        },
        data() {
            return {
                contributors: undefined,
                contributorsRand: undefined
            };
        },
        async created() {
            try {
                const { data } = await this.useApi().get('/communities/github/contributors')
                this.contributors = data
                this.contributorsRand = this.contributors.toSorted(() => 0.5 - Math.random())
            } catch (e) {
                this.contributors = []
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    :deep(section) {
        padding-bottom: 0;
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
            img {
                width: 90px;
            }

            p {
                max-width: 90px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: $purple-35;
                font-size: $font-size-md;
                font-weight: 400;
            }

        }
    }
</style>