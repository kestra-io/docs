<template>
    <div class="container-fluid">
        <div class="pt-5 pb-5 mt-5 declarative">
            <div class="container pt-3">
                <div class="row mb-0 mb-sm-5">
                    <div class="col-md-6" data-usal="fade-r">
                        <NuxtImg
                            loading="lazy"
                            format="webp"
                            width="508px"
                            height="355px"
                            class="img-fluid"
                            src="/landing/features/declarative/features_1.svg"
                            alt="A YAML sample of code for declarative language and construction of Kestra's flows"
                        />
                    </div>
                    <div class="col-md-6 py-3 py-sm-5 px-2 px-sm-5" data-usal="fade-r">
                        <h3>YAML for Declarative Orchestration</h3>
                        <ul>
                            <li>
                                <strong>Data structures:</strong> YAML supports various data
                                structures, such as mappings, sequences, and scalars, allowing for
                                the flexible representation of complex data workflows.
                            </li>
                            <li>
                                <strong>Comments:</strong> Inline comments in YAML files facilitate
                                better communication and documentation within data teams, ensuring
                                clarity and understanding of workflow logic.
                            </li>
                            <li>
                                <strong>Custom tags and types:</strong> YAML allows for the
                                definition of custom tags and types, enabling the creation of
                                domain-specific languages and abstractions tailored to your data
                                orchestration needs.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="pt-5 pb-5 declarative-orchestration">
        <div class="container pt-1">
            <div class="row">
                <div class="col-md-6 order-1 order-md-0" data-usal="fade-l">
                    <h3>Empower Your Team with Declarative Orchestration</h3>
                    <ul>
                        <li>
                            <strong>Accelerate time to value:</strong>
                            Declarative orchestration modernized the creation and maintenance of
                            data pipelines, enabling data teams to deliver results faster and more
                            efficiently.
                        </li>
                        <li>
                            <strong>Speed up your development cycles:</strong>
                            By using a declarative approach, data teams can quickly adapt to
                            changing business requirements without the need to overhaul complex
                            procedural code.
                        </li>
                        <li>
                            <strong>Reduce maintenance burden:</strong>
                            Declarative workflows help minimize errors by allowing data teams to
                            focus on defining the desired outcome, while Kestra's orchestrator takes
                            care of the execution.
                        </li>
                    </ul>
                </div>
                <div class="col-md-6 order-0 order-md-1" data-usal="fade-l">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="421px"
                        class="img-fluid"
                        src="/landing/features/declarative/features_2.svg"
                        alt="Image of execution of a task on Kestra with event or time based triggering"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Section from "~/components/layout/Section.vue"
    export default {
        components: { Section },
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";
    .declarative {
        position: relative;

        &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: url("/landing/features/declarative/declarative-glow.svg") no-repeat;
            z-index: 2;
            background-size: 40% 100%;
            top: -5%;
            left: 3%;

            @include media-breakpoint-down(lg) {
                background-size: 78% 100%;
                top: -26%;
                left: -23%;
            }

            @include media-breakpoint-down(md) {
                background-size: 100% 100%;
                top: -29%;
                left: -19%;
            }
        }
    }

    .declarative-orchestration {
        position: relative;

        &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: url("/landing/features/declarative/declarative-orchestration-glow.svg")
                no-repeat;
            z-index: -2;
            background-size: 40% 100%;
            top: -5%;
            right: -46%;

            @include media-breakpoint-down(lg) {
                background-size: 78% 100%;
                top: -26%;
                right: -35%;
            }

            @include media-breakpoint-down(md) {
                background-size: 100% 100%;
                top: -29%;
                right: 4%;
            }
        }
    }
    .container {
        h3 {
            color: $white;
            font-weight: 300;
        }

        ul li {
            color: $white-1;
            font-size: $font-size-md;
            font-weight: 300;

            strong {
                font-weight: 600;
            }
        }
    }
</style>