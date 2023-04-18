<template>
    <div class="main">
        <div class="container">
            <Section subtitle="All-Inclusive Dashboard" title="Empower Developers with a Comprehensive, User-Friendly Interface ">
                <div class="row mb-5">
                    <div class="col-md-8">
                        <img src="/landing/home/ui-1.png" alt="Picture of Kestra's user interface" class="img-fluid" />
                    </div>

                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><WrenchOutline /></span>
                                    Built-in Low code editor for your flows
                                </p>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><ChartTimelineVariant /></span>
                                    Execute and monitor directly from the interface
                                </p>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><ApplicationBracketsOutline /></span>
                                    Simple declarative language editor
                                </p>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><ViewDashboardVariantOutline /></span>
                                    Complete and comprehensive dashboard
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <a class="btn btn-lg btn-primary" href="https://meetings-eu1.hubspot.com/quentin-sinig/meeting-link-demo" target="_blank">Book a demo</a>
                </div>
            </Section>
        </div>
    </div>

</template>

<script>
    import Section from '../layout/Section.vue';
    import WrenchOutline from "vue-material-design-icons/WrenchOutline.vue";
    import ChartTimelineVariant from "vue-material-design-icons/ChartTimelineVariant.vue";
    import ApplicationBracketsOutline from "vue-material-design-icons/ApplicationBracketsOutline.vue";
    import ViewDashboardVariantOutline from "vue-material-design-icons/ViewDashboardVariantOutline.vue";

    export default {
        components: {Section, WrenchOutline, ChartTimelineVariant, ApplicationBracketsOutline, ViewDashboardVariantOutline}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main {
        background: $purple-7;
        color: var(--bs-white);

        .card {
            background: $purple-10;
            box-shadow: $purple-9 !important;
            color: var(--bs-white);
            border: 1px solid $purple-11;
            margin-bottom: $spacer;

            p {
                font-size: $font-size-lg;
            }

            .card-icon {
                margin-bottom: 0;
                font-size: 2.25rem;
            }
        }
    }
</style>