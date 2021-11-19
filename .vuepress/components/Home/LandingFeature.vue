<template>
    <div>
        <!-- FEATURES START -->
        <section class="section main-features">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="features-absolute">
                            <div class="row">
                                <div class="col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0" v-for="feature in features">
                                    <div class="media features p-4 bg-white shadow-lg rounded">
                                        <div class="icons m-0 rounded h2 text-primary text-center px-3">
                                            <i :class="feature.icon"></i>
                                        </div>
                                        <div class="content ml-4">
                                            <h5 class="mb-1"><a href="javascript:void(0)" class="text-dark">{{ feature.title }}</a></h5>
                                            <p class="text-muted mb-0">{{ feature.description }}</p>
                                        </div>
                                    </div>
                                </div>
                                <!--end col-->

                                <!--
                                <div class="col-12 mt-4 pt-4 text-center">
                                    <a href="javascript:void(0)" class="btn btn-primary">
                                        Explore features
                                        <i class="mdi mdi-arrow-right"></i>
                                    </a>
                                </div>
                                -->
                            </div>
                        </div>
                    </div>
                </div>
                <!--end row-->
            </div>
            <!--end container-->
        </section>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                features: [
                    {
                        title: "Any kind of workflow",
                        description: "Workflow can start simple to more complex with branching, parallel, dynamic tasks, depending flows, ...",
                        icon: "mdi mdi-dots-hexagon"
                    },
                    {
                        title: "Easy to learn",
                        description: "Flow are simple descriptive language defined in YAML, we don't need to be a developer to create a new flow.",
                        icon: "mdi mdi-school"
                    },
                    {
                        title: "Easy to extend",
                        description: "Plugins are class first in Kestra, many are available from Kestra core team but you can create one easily.",
                        icon: "mdi mdi-google-circles-extended"
                    },
                    {
                        title: "Any triggers",
                        description: "Kestra is event based at heart, you can trigger an execution from api, schedule, detection, events, ...",
                        icon: "mdi mdi-clock-start"
                    },
                    {
                        title: "A rich user interface",
                        description: "The built-in web interface allow you to create, run & monitor all your flows, no need to deploy your flow, just edit them.",
                        icon: "mdi mdi-web"
                    },
                    {
                        title: "Enjoy infinitely scalability",
                        description: "Kestra is built around top cloud native technologies, scale to million of executions without the pain.",
                        icon: "mdi mdi-open-in-new"
                    }
                ]
            }
        },
    }
</script>

<style lang="scss">
    @import ".vuepress/styles/variables";

    section.main-features {
        margin-top: -75px;

        .features {
            flex-wrap: nowrap;

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
