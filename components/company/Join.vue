<template>
    <div class="container bg-dark-2">
        <Section
            subtitle="Join Our Team and Contribute to the Future of Data Orchestration"
        >
            <div class="text-center cta">
                <NuxtLink href="/careers" target="_blank" class="btn btn-animated btn-purple-animated me-2" data-aos="zoom-in">
                    Get started
                </NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        border-radius: 8px;
        border: $block-border;
        position: relative;

        &::before {
            content: "";
            position: absolute;
            width: 262px;
            height: 170px;
            background: url("/landing/features/scheduling/light-mask2.svg");
            right: 0px;
            top: 0px;
            z-index: 1;
        }

        :deep(section) {
            padding-top: 2rem;
            padding-bottom: 2rem;

            .subtitle {
                max-width: 46%;

                @include media-breakpoint-down(xl) {
                    max-width: 100%;
                }

                p {
                    font-size: $h3-font-size;
                    font-weight: 100;
                }
            }

            .main {
                padding-top: 0;
            }
        }
    }
</style>