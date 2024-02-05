<template>
    <div class="container">
        <Section
            subtitle="Getting Started with  Declarative Orchestration"
        >
            <div class="d-flex justify-content-center gap-3">
                <NuxtLink href="/docs" class="btn btn-dark bg-dark-4" data-aos="zoom-in">
                    Read the docs
                </NuxtLink>
                <NuxtLink href="/docs/getting-started" class="btn btn-animated btn-purple-animated" data-aos="zoom-in">
                    Get started
                </NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../layout/Section.vue';

    export default {
        components: {Section},
        props: {
            animation: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            animationType(type) {
                return this.animation ? type : ""
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/styles/variable";

    .container {
        border-radius: 8px;
        border: $block-border;
        background: $black-2 url("/landing/community/bg.svg") no-repeat right;
        background-size: 20% 100%;

        :deep(section) {
            padding: 2rem 0;
            .subtitle {
                color: $white;
                font-size: $h3-font-size;
                font-weight: 100;
                max-width: 70%;

                @include media-breakpoint-down(lg) {
                    max-width: 100%;
                }
            }

            .main {
                padding-top: 0;
            }
        }

        .btn-dark {
            border: 1px solid $black-6;
        }
    }
</style>