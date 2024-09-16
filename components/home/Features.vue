<template>
    <div class="container">
        <Section subtitle="Simplicity scales, complexity" subtitle-after="fails">
            <div class="row card-group mb-2">
                <div class="col-md-6 col-lg-4 mb-3">
                    <Card
                        :icon="CalculatorVariant"
                        title="Declarative workflow creation"
                    />
                </div>

                <div class="col-md-6 col-lg-4 mb-3">
                    <Card
                        :icon="Lan"
                        title="Scalable multitenant architecture"
                    />
                </div>

                <div class="col-md-6 col-lg-4 mb-3">
                    <Card
                        :icon="Hubspot"
                        title="Run anywhere, code in any language in built-in Editor"
                    />
                </div>

                <div class="col-md-6 col-lg-4 mb-3">
                    <Card
                        :icon="LightningBolt"
                        title="Fast development cycles, simple deployments"
                    >
                    </Card>
                </div>

                <div class="col-md-6 col-lg-4 mb-3">
                    <Card
                        :icon="RefreshAuto"
                        title="API-first design with a rich plugin ecosystem"
                    />
                </div>

                <div class="col-md-6 col-lg-4 mb-3">
                    <Card
                        :icon="ImageFilterDrama"
                        title="Deploy anywhere with no single point of failure"
                    />
                </div>
            </div>

            <div class="text-center">
                <NuxtLink class="btn btn-animated btn-purple-animated " href="/features" data-aos="zoom-in">See all features</NuxtLink>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import LightningBolt from "vue-material-design-icons/LightningBolt.vue"
    import Lan from "vue-material-design-icons/Lan.vue"
    import ImageFilterDrama from "vue-material-design-icons/ImageFilterDrama.vue"
    import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
    import Hubspot from "vue-material-design-icons/Hubspot.vue"
    import CalculatorVariant from "vue-material-design-icons/CalculatorVariant.vue"
</script>

<script>
    import Section from '../layout/Section.vue';
    import Card from '../card/Card.vue';

    export default {
        components: {Section, Card}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    .container {
        background: url("/landing/features/bg.webp") no-repeat center;
        background-size: 100% 100%;
        :deep(section) {
            border-bottom: $container-border;
            padding-top: 0;

            .subtitle {
                max-width: 48%;

                @include media-breakpoint-down(lg) {
                    max-width: 100%;
                }
            }
        }
        :deep(.card) {
            padding: 1.625rem 1rem;
            min-height: 112px;
            height: unset;
            .card-title {

            }
            @include media-breakpoint-down(xxl) {
                padding: 1rem;
                height: 100%;
            }
            @include media-breakpoint-down(lg) {
                padding: 1rem;
                height: unset;
                min-height: unset;
            }
        }

    }
</style>
