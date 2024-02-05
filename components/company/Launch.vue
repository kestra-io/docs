<template>
    <div class="container-fluid">
        <Section
            subtitle="The Public"
            subtitle-after="Launch and Beyond"
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
            <Companies />
        </div>
    </div>
</template>

<script>
    import Companies from "../layout/Companies.vue";
    import Section from "~/components/layout/Section.vue";

    export default {
        components: {Section, Companies}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        :deep(section) {
            .main {
                padding-top: 0;
            }
        }

        p {
            color: $white;
            margin-bottom: 0;
        }

        .container-fluid {
            border-bottom: $block-border;
        }
    }
</style>