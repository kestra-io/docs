<template>
    <div class="container rounded-3">
        <Section
            title="Ready to take your data department to the next level?"
        >
        <div class="text-center cta">
                <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary me-2">
                    <Console /> Book a demo
                </a>
                <NuxtLink href="/company/contact" class="btn btn-lg btn-secondary">
                    <Email /> Contact us
                </NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

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

        :deep(p.baseline) {
            color: var(--bs-black);
        }
    }
</style>