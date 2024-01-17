<template>
    <div class="main">
        <div class="dashboard container">
            <Section
                class="dark"
                subtitle-before="All-Inclusive"
                subtitle="Dashboard"
            >
                <div class="row mb-5">
                    <div class="col-lg-8">
                        <img v-if="active === 1" src="/landing/home/ui-1.png" alt="Picture of Kestra's user interface" class="zoom img-fluid rounded-3" data-aos="fade-right" />
                        <img v-if="active === 2" src="/landing/home/ui-2.png" alt="Picture of Kestra's user interface" class="zoom img-fluid rounded-3" data-aos="fade-right" />
                        <img v-if="active === 3" src="/landing/home/ui-3.png" alt="Picture of Kestra's user interface" class="zoom img-fluid rounded-3" data-aos="fade-right" />
                        <img v-if="active === 4" src="/landing/home/ui-4.png" alt="Picture of Kestra's user interface" class="zoom img-fluid rounded-3" data-aos="fade-right" />
                    </div>

                    <div class="col-lg-4 mt-3 mt-lg-0">
                        <div class="card" @click="active = 1" :class="{active: active === 1}" data-aos="fade-left">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><WrenchOutline /></span>
                                    Built-in code editor
                                </p>
                            </div>
                        </div>
                        <div class="card" @click="active = 2" :class="{active: active === 2}" data-aos="fade-left" data-aos-delay="50">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><ChartTimelineVariant /></span>
                                    Execute and monitor directly from the interface
                                </p>
                            </div>
                        </div>
                        <div class="card" @click="active = 3" :class="{active: active === 3}" data-aos="fade-left" data-aos-delay="100">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><ApplicationBracketsOutline /></span>
                                    Declarative language editor
                                </p>
                            </div>
                        </div>
                        <div class="card" @click="active = 4" :class="{active: active === 4}" data-aos="fade-left" data-aos-delay="150">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><ViewDashboard /></span>
                                    Complete and comprehensive dashboard
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <a class="btn btn-primary" href="https://meetings-eu1.hubspot.com/meetings/david76" target="_blank" data-aos="zoom-in">Book a demo</a>
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
    import ViewDashboard from "vue-material-design-icons/ViewDashboard.vue";

    export default {
        components: {Section, WrenchOutline, ChartTimelineVariant, ApplicationBracketsOutline, ViewDashboard},
        data() {
            return {
                active: 1,
            };
        },
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
            cursor: pointer;
            transition: all ease 0.2s;

            p {
                font-size: $font-size-lg;
            }

            .card-icon {
                margin-bottom: 0;
                font-size: 2.25rem;
            }

            &:hover, &.active {
                background: $purple-28;
                p {
                    font-weight: bold;
                }
            }
        }
    }
</style>