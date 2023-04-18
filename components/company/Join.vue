<template>
    <div class="container">
        <Section
            class="with-shadow"
            title="Join Our Team and Contribute to the Future of Data Orchestration"
        >
        <p class="text-center mb-5">
            We are always on the lookout for passionate and talented individuals who share our vision for a more efficient and seamless data orchestration experience. If you are excited about the prospect of working on cutting-edge technology and shaping the future of data orchestration, we would love to hear from you ❤️
        </p>
        <div class="text-center cta">
                <NuxtLink href="/careers" target="_blank" class="btn btn-lg btn-primary me-2">
                    Join us
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
        color: var(--bs-black);
        padding-left: calc($spacer * 4);
        padding-right: calc($spacer * 4);
        margin-bottom: calc($spacer * 2);
        margin-top: calc($spacer * -2);
        border-radius: 10px;

        :deep(p.baseline) {
            color: var(--bs-black);
        }
    }
</style>