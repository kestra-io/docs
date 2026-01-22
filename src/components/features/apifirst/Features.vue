<template>
    <div class="container-fluid">
        <Section
            class="container px-2"
            subtitle="Building on an"
            subtitle-after="API-First Platform"
        >
            <div class="row mt-5">
                <div class="col-12">
                    <div class="row card-group no-shadow mb-2">
                        <div class="col-12 col-md-4 mb-4">
                            <Card
                                :icon="ServerNetwork"
                                title="API Coverage"
                                description="From workflow creation to user management, our API reference details how to interact with every aspect of the platform programmatically."
                            />
                        </div>
                        <div class="col-md-4 mb-4">
                            <Card
                                :icon="Extensibility"
                                title="Extensibility for Custom Solutions"
                                description="Leverage the power of Kestra to create interfaces or enhance existing systems, thanks to the API's flexibility."
                            />
                        </div>
                        <div class="col-md-4 mb-4">
                            <Card
                                :icon="TerraformIntegration"
                                title="Terraform Integration & Future SDKs"
                                description="We offer Terraform integration, and we're expanding our toolkit with SDKs in popular programming languages for even easier integration."
                            />
                        </div>
                    </div>
                    <div class="text-center">
                        <a
                            href="https://kestra.io/docs/api-reference"
                            target="_blank"
                            class="btn btn-animated btn-purple-animated"
                            data-usal="zoomin"
                            >Learn more</a
                        >
                    </div>
                </div>
            </div>
        </Section>
    </div>
</template>

<script lang="ts" setup>
    import Extensibility from "vue-material-design-icons/Connection.vue"
    import TerraformIntegration from "vue-material-design-icons/Terraform.vue"
    import ServerNetwork from "vue-material-design-icons/ServerNetwork.vue"
    import Section from "~/components/layout/Section.vue"
    import Card from "~/components/card/Card.vue"
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container {
        padding: calc($spacer * 4) 0;
        background-image: url("/landing/features/scheduling/masking.svg");
        position: relative;
        z-index: 10;

        &::before {
            content: "";
            position: absolute;
            width: 214px;
            height: 227px;
            background: linear-gradient(140deg, rgba(70, 24, 255, 0) -41.95%, #7e1cfa 77.28%);
            filter: blur(82px);
            left: 40.6rem;
            top: 15rem;
            z-index: 0;
        }

        .heading {
            max-width: 500px;
        }

        .title {
            font-weight: 300;
            font-size: $font-size-3xl;

            &-animated {
                background: linear-gradient(90deg, #e151f7 57.52%, #5c47f5 92.48%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }

    h3 {
        text-align: center;
        margin-bottom: 0;
    }

    .card {
        background-color: $black-2;
        color: $white;
        z-index: 99;
        box-shadow: none !important;

        &-body {
            padding: 2rem 2rem 7rem 2rem;
        }

        &-heading {
            font-size: $font-size-xl;
            font-weight: 300;
            line-height: 2rem;
        }

        &-para {
            font-size: $font-size-sm;
            font-weight: 400;
            line-height: 1.375;
            color: $white-1;
        }
    }

    .mask {
        position: relative;
        z-index: 99;

        &::after {
            content: "";
            position: absolute;
            height: calc($spacer * 16.656);
            width: calc($spacer * 10.641);
            right: calc($spacer * -5.887);
            bottom: calc($spacer * -14.531);
            z-index: 10;
            background: linear-gradient(180deg, rgba(98, 24, 255, 0), #6117ff 100%);
            filter: blur(100px);
        }
    }
</style>