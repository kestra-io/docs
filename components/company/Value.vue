<template>
    <div class="container">
        <Section
            subtitle="Staying True to Our"
            subtitle-after="Mission"
        >
            <div class="text-block row card-group card-centered no-shadow mb-2">
                <p class="baseline-max-width" data-aos="fade-right">
                    At Kestra, our values are at the core of everything we do. We believe that by adhering to these principles, we can create a platform that not only meets the needs of our users but also exceeds their expectations.
                </p>
                <p class="baseline-max-width mb-5" data-aos="fade-right">
                    Innovation: We are driven by a passion for continuous improvement and a desire to challenge the status quo. We strive to develop new ideas and solutions that redefine the data orchestration landscape.
                </p>
            </div>

            <div class="row card-group mb-2">
                <div class="col-md-3 mb-3">
                    <Card
                        :icon="QualityHigh"
                        title="Quality"
                        description="We are committed to delivering a platform that meets the highest standards of performance, reliability, and usability"
                    />
                </div>

                <div class="col-md-3 mb-3">
                    <Card
                        :icon="AccountGroupOutline"
                        title="Collaboration"
                        description="We believe in the power of collaboration and the importance of fostering strong relationships with our users, partners, and team members"
                    />
                </div>

                <div class="col-md-3 mb-3">
                    <Card
                        :icon="EmoticonOutline"
                        title="User-Centric"
                        description="We are committed to incorporating user feedback and addressing their challenges as we continue to evolve Kestra"
                    />
                </div>

                <div class="col-md-3 mb-3">
                    <Card
                        :icon="Opacity"
                        title="Transparency"
                        description="We value openness and honesty in all aspects of our work, from our development processes to our communications with users and partners"
                    />
                </div>
            </div>
        </Section>
    </div>
</template>
<script setup>
    import QualityHigh from "vue-material-design-icons/QualityHigh.vue";
    import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue";
    import EmoticonOutline from "vue-material-design-icons/EmoticonOutline.vue";
    import Opacity from "vue-material-design-icons/Opacity.vue";
</script>
<script>
    import Section from '../../components/layout/Section.vue';
    import Card from '../../components/card/Card.vue';

    export default {
        components: {Section, Card}
    }
</script>
<style scoped lang="scss">
    @import "../../assets/styles/variable";

    :deep(section) {
        border-bottom: $block-border;
        .subtitle, .subtitle p {
            margin-bottom: 0 !important;
        }

        .main {
            padding-top: 2rem !important;
        }
    }

    .text-block {
        p {
            color: $white;
            margin-bottom: 0;
        }
    }
</style>