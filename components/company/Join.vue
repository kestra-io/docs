<template>
    <div class="container">
        <Section
            title="Join Our Team and Contribute to the Future of Data Orchestration"
        >
            <div class=" d-flex justify-content-center">
                <p class="text-center mb-5 baseline-max-width" data-aos="fade-right">
                    We are always on the lookout for passionate and talented individuals who share our vision for a more efficient and seamless data orchestration experience. If you are excited about the prospect of working on cutting-edge technology and shaping the future of data orchestration, we would love to hear from you ❤️
                </p>
            </div>

            <div class="text-center cta">
                <NuxtLink href="/careers" target="_blank" class="btn btn-primary me-2" data-aos="zoom-in">
                    Join us
                </NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '~/components/layout/Section.vue';

    export default {
        components: {Section}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container {
        text-align: center;
        background: $purple-8 no-repeat bottom right;
        background-size: contain;
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