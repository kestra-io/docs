<template>
    <div class="main">
        <div class="container container-min">
            <Section
                subtitle="Join the community"
            >
                <div class="metrics">
                    <div class="counter-box text-center" data-aos="fade-up" data-aos-delay="50">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="github ? github.stargazers : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Stars</p>
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center" data-aos="fade-up" data-aos-delay="100">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.forks : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Forks</p>
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center" data-aos="fade-up" data-aos-delay="150">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.pullRequests : 0" :duration="4000"></CountTo>
                        </h5>
                        <p>Pull Requests</p>
                    </div>
                    <div class="line-separator"></div>
                    <div class="counter-box text-center" data-aos="fade-up" data-aos-delay="200">
                        <h5 class="mb-0 mt-2">
                            <CountTo :endVal="metrics ? metrics.contributors : 0" :duration="4000"></CountTo>
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
    </div>
</template>

<script setup>
    import Section from '../layout/Section.vue';
    import {CountTo} from 'vue3-count-to';
    const config = useRuntimeConfig();

    const {data: metrics} = await useCachedAsyncData(
        `home-opensource-metrics`,
        () => $fetch(`${config.public.apiUrl}/communities/github/metrics`),
        {
            serverMaxAge: 60 * 10,
        }
    );

    const {data: github} = await useAsyncData(
        `home-opensource-github`,
        () => {
            return $fetch('/api/github');
        }
    );

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