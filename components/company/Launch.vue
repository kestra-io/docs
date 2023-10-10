<template>
    <div class="container-fluid">
        <Section
            title="The Public Launch and Beyond"
        >
            <div class="justify-content-center d-flex">
                <div>
                    <p class="baseline-max-width text-center" data-aos="fade-left">
                        We are excited to see how Kestra will transform the way organizations approach data orchestration and automation.
                    </p>
                    <p class="baseline-max-width text-center" data-aos="fade-left">
                        We believe that Kestra's potential is limitless, and we are eager to explore new opportunities and partnerships as we move forward.
                    </p>
                </div>
            </div>
        </Section>

        <div class="container-fluid pb-5">
            <Companies :inverted="true" />
        </div>
    </div>
</template>

<script>
    import Companies from "~/components/layout/Companies.vue";
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section, Companies}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: $purple-29;

        .companies-title {
            position: relative;

            &:after {
                content: '';
                position: absolute;
                left: 50%;
                top: 2.5rem;
                display: inline-block;
                height: 2px;
                width: 51px;
                background: var(--bs-pink);
            }
        }
    }

    .hero {
        h2 {
            font-size: 2.5rem;
        }
    }

    .container {
        padding-top: 80px;
        margin-top: -70px;
    }
</style>