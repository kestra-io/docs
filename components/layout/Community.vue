<template>
    <div class="container">
        <Section
            title="Join our community"
        >
            <div class="text-center cta">
                <p>
                    Want to chat with the team or talk with other Kestra's enthusiasts?
                </p>
                <a href="https://api.kestra.io/v1/communities/slack/redirect" target="_blank" class="btn btn-lg btn-primary me-2">
                    Join our slack
                </a>
                <NuxtLink href="/community" class="btn btn-lg btn-secondary">
                    Contribute
                </NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from './Section.vue';

    export default {
        components: {Section}
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