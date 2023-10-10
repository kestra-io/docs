<template>
    <div class="main">
        <div class="hero container text-center">
            <img src="/icon.svg" class="kestra-logo" data-aos="zoom-in" />
            <p class="overline" data-aos="fade-left">About kestra</p>
            <h1 data-aos="fade-right">Building the Future of Orchestration and Automation</h1>
        </div>
    </div>
    <div class="container">
        <Section
            title="About Kestra"
            subtitle="Our story"
            class="pt-3"
        >
            <div class="container text-center baseline-max-width" data-aos="fade-left">
                <p>
                    Kestra is an open-source, event-driven orchestrator that simplifies data operations and improves collaboration between engineers and business users. 
                </p>
                <p>
                    By bringing Infrastructure as Code best practices to data pipelines, Kestra allows you to build reliable workflows and manage them with confidence.
                </p>
                <p>
                    Thanks to the declarative YAML interface for defining orchestration logic, everyone who benefits from analytics can participate in the data pipeline creation process. 
                </p>
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

    .main {
        background: url("/landing/company/header.svg") no-repeat 50% 70px;
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