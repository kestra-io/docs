<template>
    <div class="container-fluid">
        <div class="container">
            <Section subtitle="Definition" subtitle-before="Workflow"
                     baseline="We empowers our users with comprehensive capabilities for defining and managing their workflows">
                <div data-aos="fade-left">
                    <LayoutTabContent :navLinks="workflowDefinition.navLinks" />
                </div>
            </Section>
            <div class="row pb-3">
                <div class="col-md-4 order-1 order-md-1 d-flex flex-column justify-content-center mt-4" data-aos="fade-left">
                    <h3>Interactive Topology View</h3>
                    <p>
                        Use Kestra's topology view for a graphical representation of your workflows. This feature
                        provides an intuitive understanding of how each step in your process interconnects and operates.
                    </p>
                </div>
                <div class="col-md-7 order-0 order-md-0 left-glow" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="568px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/interactive-topology.png"
                        alt="Interactive Topology"
                        data-aos="zoom-in"
                    />
                </div>
            </div>
            <div class="row mb-5">
                <div class="col-md-4 order-1 order-md-0 d-flex flex-column justify-content-center mt-4"
                     data-aos="fade-right">
                    <h3>Intuitive Form Editor</h3>
                    <p>
                        This user-friendly interface is ideal for quickly setting up new workflows or making changes to
                        existing ones without deep diving into code.
                    </p>
                </div>
                <div class="col-md-7 order-0 order-md-1 right-glow d-flex justify-content-end" data-aos="fade-left">
                    <NuxtImg
                        loading="lazy"
                        format="webp"
                        width="569px"
                        height="329px"
                        class="img-fluid zoom"
                        src="/landing/overview/intuitive-form.png"
                        alt="Intuitive Form"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
  import workflowDefinition from "~/data/workflow-definition.js";
</script>


<script>
  import Section from "../layout/Section.vue";

  export default {
    components: {Section},
    data() {
      return {
        activeTabIndex: 1,
      }
    }
  };
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    :deep(section) {
        padding-bottom: 0;

        .main {
            padding: calc($spacer * 2.5) 0 !important;
        }

        p.baseline {
            font-size: $h6-font-size !important;
            font-weight: 300;
        }
    }

    .container-fluid {
        background: $black-4;
        color: var(--bs-white);
        z-index: 1;
        position: relative;
        overflow: hidden;

        .row {
            margin-bottom: 12rem;
            @include media-breakpoint-down(lg) {
                margin-bottom: 5rem;
            }
        }

        .line {
            background: rgba(255, 255, 255, 0.1) !important;
            height: 1px !important;
        }

        .container:first-child {
            border-top: $block-border;
            border-bottom: $block-border;
            padding-top: calc($spacer * 1.6);
            padding-bottom: calc($spacer * 1.6);
        }

        .left-glow,
        .right-glow {
            position: relative;
            z-index: 10;

            &::before,
            &::after
            {
                content: "";
                position: absolute;
                width: calc($spacer * 5.5);
                height: calc($spacer * 5.5);
                background: linear-gradient(140deg, rgba(70, 24, 255, 0) -41.95%, #7e1cfa 77.28%);
                filter: blur(55px);
                z-index: -5;
            }
        }

        .right-glow {
            &::before {
                left: 12rem;
                top: 0rem;
            }

            &::after {
                right: 1rem;
                bottom: 1rem;
            }

            @include media-breakpoint-down(lg) {
                &::before {
                    left: -1rem;
                }
            }
        }

        .left-glow {
            &::before {
                left: -1rem;
                top: 0;
            }

            &::after {
                right: 11rem;
                bottom: 1rem;
            }

            @include media-breakpoint-down(lg) {
                &::after {
                    right: -1rem;
                }
            }
        }

        h3 {
            color: $white;
            font-size: $h2-font-size;
            font-weight: 300;
        }
        p {
            color: $white-1;
            font-size: $font-size-md;
            font-weight: 300;
        }

    }

</style>