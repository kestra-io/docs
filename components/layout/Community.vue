<template>
    <div class="container bg-dark-2 community">
        <Section
            subtitle="New to Kestra?"
            :animation="animation"
        >
            <div class="text-center cta">
                <p :data-aos="animationType('fade-left')">
                    Use blueprints to kickstart your first workflows.
                </p>
                <a href="https://kestra.io/slack" target="_blank" class="btn btn-animated btn-purple-animated me-2 mb-2" :data-aos="animationType('zoom-in')">
                    Get started with Kestra
                </a>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from './Section.vue';

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

<style lang="scss">
    @import "../../assets/styles/variable";

    .community {
        padding-left: calc($spacer * 1);
        padding-right: calc($spacer * 1);
        margin-top: calc($spacer * 5.625);
        border-radius: 8px;
        border: $block-border;
        background: url("/landing/community/bg.svg") no-repeat right;
        background-size: 20% 100%;

        section {
            .subtitle {
                color: $white;
            }
            .main {
                padding-top: calc($spacer * 1) !important;

                p {
                    margin-bottom: calc($spacer * 1);
                    color: $white;
                }
            }
        }
    }
</style>