<template>
    <div class="main">
        <div class="hero container text-center">
            <img src="/icon.svg" class="kestra-logo" />
            <p class="overline">About kestra</p>
            <h1>Pioneering the Future of Data Orchestration and Automation</h1>
        </div>
    </div>
    <div class="team-image text-center">
        <img src="/landing/company/team-image.png" width="670"/>
    </div>
    <div class="container">
        <Section
            title="The Genesis of Kestra"
            subtitle="Our story"
            class="pt-3"
        >
            <div class="container text-center baseline-max-width">
                <p>
                    Our journey began with an inspiring vision: to design a data orchestration platform that would transcend the limitations of existing market solutions while offering an exceptional user experience.
                </p>
                <p>
                    As a team of professionals with a solid background in automation and workflow planning, we have constantly been driven by the ambition to push the boundaries of what is possible. We aspired to develop an open-source solution that would seamlessly adapt to projects of all sizes.
                </p>
                <p>
                    Guided by our passion for innovation and our determination to create an outstanding product, we have crafted our own tool - a platform that redefines data orchestration and automation, paving the way for a new era of possibilities and efficiency.
                </p>
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

    .main {
        background: url("/landing/company/header.svg") no-repeat 52% 70px;
        background-size: cover;
        color: var(--bs-white);
        padding-top: 80px;
        margin-top: -80px;
        padding-bottom: calc($spacer * 5);

        .kestra-logo {
            padding-bottom: $spacer;
            width: 100px;
        }
    }

    .team-image {
        margin-top: -10rem;
    }
</style>