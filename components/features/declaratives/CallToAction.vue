<template>
    <div class="container">
        <Section
            title="Getting Started with Kestra's Declarative Orchestrator"
        >
            <div class="text-center cta">
                <p data-aos="fade-left">
                    Kickstart your journey with Kestra's declarative data orchestrator and unlock the full potential of your data.
                </p>
                <NuxtLink href="/docs/getting-started" class="btn btn-primary mt-3 mb-2" data-aos="zoom-in">
                    Get Started with Kestra
                </NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '~/components/layout/Section.vue';

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
        background: $purple-8 url("/landing/dot2.svg") no-repeat bottom right;
        color: var(--bs-black);
        padding-left: calc($spacer * 4);
        padding-right: calc($spacer * 4);
        margin-bottom: calc($spacer * 2);
        margin-top: calc($spacer * 2);
        border-radius: 10px;

        section {
            max-width: 600px;
            margin: 0 auto;
        }

        :deep(p.baseline) {
            color: var(--bs-black);
        }
    }
</style>