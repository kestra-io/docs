<template>
    <div class="container">
        <Section
            subtitle="Staying True to Our"
            subtitle-after="Mission"
        >
            <div class="text-block row card-group card-centered no-shadow mb-2">
                <p class="baseline-max-width" data-aos="fade-right">
                    At Kestra, our principles shape our actions. We focus on making a platform that not only meets our users' needs but also surpasses their expectations. We're committed to continuous learning and iteration. Our goal is to introduce innovative ideas and solutions that significantly simplify and improve orchestration for our users.
                </p>
            </div>

            <div class="row card-group mb-2">
                <div class="col-md-3 mb-3">
                    <Card
                        :icon="QualityHigh"
                        title="High Quality Standards"
                        description="We are committed to delivering a platform that meets the highest standards of performance, reliability, and usability."
                    />
                </div>

                <div class="col-md-3 mb-3">
                    <Card
                        :icon="AccountGroupOutline"
                        title="Team Work"
                        description="We believe in the power of giving and receiving direct feedback, learning from it and fostering strong relationships with our users, partners, and team members."
                    />
                </div>

                <div class="col-md-3 mb-3">
                    <Card
                        :icon="EmoticonOutline"
                        title="Customer Obsession"
                        description="We listen to the feedback from our users and address their challenges at a rapid pace to continue building a product loved by our users."
                    />
                </div>

                <div class="col-md-3 mb-3">
                    <Card
                        :icon="Opacity"
                        title="Transparency"
                        description="We value openness and honesty in all aspects of our work, from our development processes to our communications with users and partners."
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