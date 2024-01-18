<template>
    <div class="container rounded-3">
        <Section
            title="Ready to bring your orchestration to the next level?"
        >
        <div class="text-center cta">
                <a href="https://kestra.io/demo" target="_blank" class="btn btn-primary me-2 mb-2" data-aos="zoom-in">
                    <Console /> Talk to Us
                </a>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import Console from "vue-material-design-icons/Console.vue"
    import Email from "vue-material-design-icons/Email.vue"
</script>

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