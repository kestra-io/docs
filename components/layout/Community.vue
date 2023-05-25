<template>
    <div class="container">
        <Section
            title="Join our community"
            :animation="animation"
        >
            <div class="text-center cta">
                <p :data-aos="animationType('fade-left')">
                    Want to chat with the team or talk with other Kestra's enthusiasts?
                </p>
                <a href="https://kestra.io/slack" target="_blank" class="btn btn-primary me-2 mb-2" :data-aos="animationType('zoom-in')">
                    Join our slack
                </a>
                <NuxtLink href="/community" class="btn btn-secondary mb-2" :data-aos="animationType('zoom-in')">
                    Contribute
                </NuxtLink>
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

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        background: $purple-8 url("/landing/dot2.svg") no-repeat bottom right;
        color: var(--bs-black);
        padding-left: calc($spacer * 4);
        padding-right: calc($spacer * 4);
        margin-bottom: calc($spacer * 2);
        margin-top: calc($spacer * 2);
        border-radius: 10px;

        :deep(p.baseline) {
            color: var(--bs-black);
        }
    }
</style>