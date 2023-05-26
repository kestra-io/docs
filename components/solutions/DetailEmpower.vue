<template>
    <div class="container">
        <Section :title="title">
        <p class="text-center" data-aos="fade-right">{{ subtitle }}</p>
        <div class="text-center cta">
                <NuxtLink href="/docs/getting-started" class="btn btn-primary mt-5" data-aos="zoom-in">
                    Get started
                </NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        props: {
            title: {
                type: String,
                required: false,
            },
            subtitle: {
                type: String,
                required: false,
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        background: $light-cyan;
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