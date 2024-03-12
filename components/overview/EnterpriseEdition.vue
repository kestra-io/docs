<template>
    <div class="container-fluid">
        <div class="container">
            <div class="d-flex justify-content-center mb-3">
                <img src="/landing/overview/orchestration-experience.svg" alt="Orchestration Experience">
            </div>
            <Section subtitle="Enhance Your Orchestration Experience with Kestra " subtitle-after="Enterprise Edition"
                     baseline="Elevate your orchestration capabilities with Kestra's Enterprise Edition. Designed for enhanced control and security.">
                <div data-aos="fade-left">
                    <LayoutTabContent :navLinks="businessDetails.navLinks" />
                </div>
            </Section>
        </div>
    </div>
</template>

<script setup>
  import lan from "vue-material-design-icons/lan.vue";
  import ToyBrickPlus from "vue-material-design-icons/ToyBrickPlus.vue";
  import businessDetails from "~/data/business-details.js";
</script>


<script>
  import Section from "../layout/Section.vue";

  export default {
    components: { Section },
  };
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    :deep(section) {
        padding: 0;

        .subtitle {
            max-width: 60%;
            @include media-breakpoint-down(lg) {
                max-width: 100%;
            }
        }

        p.baseline {
            font-size: $h6-font-size !important;
        }
    }

    .container-fluid {
        background: $black-1;
        color: var(--bs-white);
        z-index: 1;
        position: relative;
        overflow: hidden;

        &:before {
            content: "";
            position: absolute;
            width: calc($spacer * 22);
            height: calc($spacer * 12);
            background: linear-gradient(139.54deg, rgba(68, 15, 154, 0.6) 33%, rgba(142, 18, 93, 0) 90.85%);
            filter: blur(100px);
            z-index: -5;
            left: 51rem;
            top: 6rem;
        }

        .container {
            padding-top: calc($spacer * 6.8);
            padding-bottom: calc($spacer * 3);
        }
    }

</style>