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
                <a href="/community" class="btn btn-lg btn-secondary">
                    Contribute
                </a>
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
        background: $purple-8 url("/landing/enterprise/Group_2.png") no-repeat bottom right;
        color: var(--bs-black);
        padding-left: calc($spacer * 4);
        padding-right: calc($spacer * 4);
        margin-bottom: calc($spacer * 2);
        margin-top: calc($spacer * 2);

        :deep(p.baseline) {
            color: var(--bs-black);
        }
    }
</style>