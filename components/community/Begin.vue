<template>
    <div class="container">
        <Section
            title="Begin Your Kestra Adventure"
        >
        <p class="text-center">
            Start building with Kestra and enjoy your pipelines — the only limit is your imagination!
        </p>
        <div class="text-center cta">
                <NuxtLink href="/docs" target="_blank" class="btn btn-lg btn-primary me-2">
                    Read the docs
                </NuxtLink>
                <NuxtLink href="/docs/getting-started" class="btn btn-lg btn-secondary">
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
        background: $purple-8 url("/landing/dot2.svg") no-repeat bottom right;
        color: var(--bs-black);
        padding-left: calc($spacer * 4);
        padding-right: calc($spacer * 4);
        margin-bottom: calc($spacer * 2);
        border-radius: 10px;

        :deep(p.baseline) {
            color: var(--bs-black);
        }
    }
</style>