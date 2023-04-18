<template>
    <div class="container">
        <Section
            class="with-shadow"
            title="Our Values and Commitments"
            subtitle="Staying True to Our Mission"
        >
            <div class="row card-group card-centered no-shadow mb-2">
                <p class="baseline-max-width">
                    At Kestra, our values are at the core of everything we do. We believe that by adhering to these principles, we can create a platform that not only meets the needs of our users but also exceeds their expectations.
                </p>
                <p class="baseline-max-width mb-5">
                    <strong>Innovation:</strong> We are driven by a passion for continuous improvement and a desire to challenge the status quo. We strive to develop new ideas and solutions that redefine the data orchestration landscape.
                </p>
            </div>

            <div class="row card-group card-centered no-shadow mb-2">
                <div class="col-md-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                                <span class="card-icon">
                                    <QualityHigh />
                                </span>
                            <h4 class="card-title">Quality</h4>
                            <p class="card-text">We are committed to delivering a platform that meets the highest standards of performance, reliability, and usability</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                                <span class="card-icon">
                                    <AccountGroupOutline />
                                </span>
                            <h4 class="card-title">Collaboration</h4>
                            <p class="card-text">We believe in the power of collaboration and the importance of fostering strong relationships with our users, partners, and team members</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                                <span class="card-icon">
                                    <EmoticonOutline />
                                </span>
                            <h4 class="card-title">User-Centric</h4>
                            <p class="card-text">We are committed to incorporating user feedback and addressing their challenges as we continue to evolve Kestra</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                                <span class="card-icon">
                                    <Opacity />
                                </span>
                            <h4 class="card-title">Transparency</h4>
                            <p class="card-text">We value openness and honesty in all aspects of our work, from our development processes to our communications with users and partners</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    import QualityHigh from "vue-material-design-icons/QualityHigh.vue";
    import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue";
    import EmoticonOutline from "vue-material-design-icons/EmoticonOutline.vue";
    import Opacity from "vue-material-design-icons/Opacity.vue";

    export default {
        components: {Section, QualityHigh, AccountGroupOutline, EmoticonOutline, Opacity}
    }
</script>