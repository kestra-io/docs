<template>
    <section class="section main-features overflow-hidden">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="features-absolute">
                        <div class="row">
                            <div class="col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0" data-aos="fade-up" :data-aos-delay="index * 150" v-for="(feature, index) in features">
                                <div class="media features p-4 bg-white shadow-lg rounded">
                                    <div class="icons m-0 rounded h2 text-primary text-center px-3">
                                        <span :is="feature.icon" />
                                    </div>
                                    <div class="content ml-4">
                                        <h5 class="mb-1"><a href="javascript:void(0)" class="text-dark">{{ feature.title }}</a></h5>
                                        <p class="text-muted mb-0">{{ feature.description }}</p>
                                    </div>
                                </div>
                            </div>
                            <!--end col-->

                            <div class="col-12 mt-4 pt-4 text-center">
                                <router-link
                                    to="/features/features"
                                    class="btn btn-primary"
                                    data-aos="zoom-in"
                                >
                                    <FeatureSearch title="" /> Explore features
                                    <ArrowRight title="" />
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Shape class="text-white" />
    </section>
</template>

<script>
import DotsHexagon from "vue-material-design-icons/DotsHexagon";
import SchoolOutline from "vue-material-design-icons/SchoolOutline";
import GoogleCirclesExtended from "vue-material-design-icons/GoogleCirclesExtended";
import ClockStart from "vue-material-design-icons/ClockStart";
import Web from "vue-material-design-icons/Web";
import OpenInNew from "vue-material-design-icons/OpenInNew";
import Shape from "../layout/Shape";
import ArrowRight from 'vue-material-design-icons/ArrowRight'
import FeatureSearch from "vue-material-design-icons/FeatureSearch"

export default {
    components: {Shape, ArrowRight, FeatureSearch},
    data() {
        return {
            features: [
                {
                    title: "Any kind of workflow",
                    description: "Workflows can start simple and progress to more complex systems with branching, parallel, dynamic tasks, flow dependencies",
                    icon: DotsHexagon
                },
                {
                    title: "Easy to learn",
                    description: "Flows are in simple, descriptive language defined in YAML; you don't need to be a developer to create a new flow.",
                    icon: SchoolOutline
                },
                {
                    title: "Easy to extend",
                    description: "Plugins are everywhere in Kestra, many are available from the Kestra core team, but you can create one easily.",
                    icon: GoogleCirclesExtended
                },
                {
                    title: "Any triggers",
                    description: "Kestra is event-based at heart—you can trigger an execution from API, schedule, detection, events",
                    icon: ClockStart
                },
                {
                    title: "A rich user interface",
                    description: "The built-in web interface allows you to create, run, and monitor all your flows—no need to deploy your flows, just edit them.",
                    icon: Web
                },
                {
                    title: "Enjoy infinite scalability",
                    description: "Kestra is built around top cloud native technologies—scale to millions of executions stress free.",
                    icon: OpenInNew
                }
            ]
        }
    },
}
</script>

<style lang="scss">
@import ".vuepress/theme/styles/variables";

section.main-features {
    margin-top: -120px;

    .features {
        flex-wrap: nowrap;
        margin-top: 3.5rem;

        .content {
            flex-grow: 1;
        }

        @media (max-width: 719px) {
            & {
                flex-direction: row;
            }
        }
    }
}
</style>
