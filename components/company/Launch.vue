<template>
    <div class="container-fluid">
        <Section
            subtitle="Trusted by Enterprises"
            subtitle-after="Worldwide"
        >
            <div class="justify-content-center d-flex">
                <div>
                    <p class="baseline-max-width text-center" data-aos="fade-left">
                        We are grateful, humbled and excited to see how Kestra transforms the way organizations approach orchestration and automation. We are looking forward to the journey ahead and are committed to delivering the best orchestration platform to our enterprise customers, technology partners, and the open-source community.
                    </p>
                </div>
            </div>
        </Section>

        <Companies class="pb-5"/>
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

        :deep(.companies-container) {
            border-bottom: $container-border;
        }
    }
</style>