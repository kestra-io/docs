<template>
    <div class="container">
        <Section
            title="Ready to take your data department to the next level?"
        >
        <div class="text-center cta">
                <a href="https://demo.kestra.io" target="_blank" class="btn btn-lg btn-primary me-2">
                    <Console /> Book a demo
                </a>
                <a href="/company/contact" class="btn btn-lg btn-secondary">
                    <Email /> Contact us
                </a>
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
        background: $purple-8 url("/landing/enterprise/Group_2.png") no-repeat bottom right;
        color: var(--bs-black);
        padding-left: calc($spacer * 4);
        padding-right: calc($spacer * 4);
        margin-bottom: calc($spacer * 2);

        :deep(p.baseline) {
            color: var(--bs-black);
        }
    }
</style>