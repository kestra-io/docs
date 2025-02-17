<template>
    <div class="bg-dark-4">
        <div class="container ui-container">
            <Section
                class="dark"
                subtitle-before="All-Inclusive"
                subtitle="Dashboard"
            >
                <div class="row mb-5 align-items-center">
                    <div class="col-lg-8">
                        <NuxtImg loading="lazy" format="webp" quality="80" width="852" height="553" sizes="320px xs:640px lg:852px" v-if="active === 1" src="/landing/home/ui-1.png" alt="Picture of Kestra's user interface" class="zoom img-fluid rounded-3" data-aos="fade-right" />
                        <NuxtImg loading="lazy" format="webp" quality="80" width="852" height="553" sizes="320px xs:640px lg:852px" v-if="active === 2" src="/landing/home/ui-2.png" alt="Picture of Kestra's user interface" class="zoom img-fluid rounded-3" data-aos="fade-right" />
                        <NuxtImg loading="lazy" format="webp" quality="80" width="852" height="553" sizes="320px xs:640px lg:852px" v-if="active === 3" src="/landing/home/ui-3.png" alt="Picture of Kestra's user interface" class="zoom img-fluid rounded-3" data-aos="fade-right" />
                        <NuxtImg loading="lazy" format="webp" quality="80" width="852" height="553" sizes="320px xs:640px lg:852px" v-if="active === 4" src="/landing/home/ui-4.png" alt="Picture of Kestra's user interface" class="zoom img-fluid rounded-3" data-aos="fade-right" />
                    </div>

                    <div class="col-lg-4 mt-3 mt-lg-0">
                        <div class="card" @click="active = 1" :class="{active: active === 1}" data-aos="fade-left">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><WrenchOutline /></span>
                                    Autocompletion and syntax validation
                                </p>
                            </div>
                        </div>
                        <div class="card" @click="active = 2" :class="{active: active === 2}" data-aos="fade-left" data-aos-delay="50">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><ChartTimelineVariant /></span>
                                    No setup required — build workflows directly from the UI
                                </p>
                            </div>
                        </div>
                        <div class="card" @click="active = 3" :class="{active: active === 3}" data-aos="fade-left" data-aos-delay="100">
                            <div class="card-body">
                                <p class="mb-0">
                                    <span class="card-icon rounded-5"><ApplicationBracketsOutline /></span>
                                    Embedded Code editor with Git push & sync
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

    .container {
        color: var(--bs-white);

        :deep(section) {
            border-bottom: $container-border;

            .subtitle {
                max-width: 40%;

                @include media-breakpoint-down(lg) {
                    max-width: 100%;
                }
            }
        }

        .active {
            border: 1px solid #B010FB !important;
            background: $black-4 !important;

            .card-icon {
                background: $primary !important;

                .material-design-icon svg path {
                    fill: $white !important;
                }
            }
        }

        .card {
            background: $purple-10;
            box-shadow: $purple-9 !important;
            color: var(--bs-white);
            margin-bottom: $spacer;
            cursor: pointer;
            transition: all ease 0.2s;
            border: 1px solid $black-6;
            background: $black-2;

            p {
                font-size: $font-size-lg;
            }



            .card-body {
                p {
                    display: flex;
                    align-items: center;
                }

                .card-icon {
                    margin-bottom: 0;
                    width: 40px;
                    min-width: 40px;
                    height: 40px;
                    min-height: 40px;
                    background: $black-3;
                    font-size: 24px !important;

                    .material-design-icon {
                        margin-top: -6px;
                        width: 24px;
                        height: 24px;

                        svg path {
                            fill: #8405FF;
                        }
                    }
                }
            }

            &:hover {
                background: $black-4 !important;
            }
        }
    }

    .ui-container {
        :deep(.material-design-icon__svg) {
            width: 24px !important;
            height: 24px !important;
        }
    }
</style>