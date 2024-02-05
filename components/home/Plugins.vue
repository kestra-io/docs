<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="mb-5">
                <h2 class="title">Integrate with tools you already <span>know</span> and <span>love</span></h2>
                <div class="plugins d-flex align-items-center justify-content-center flex-wrap">
                    <img src="/landing/home/plugins/fivetran.svg" alt="fivetran">
                    <img src="/landing/home/plugins/snowflake.svg" alt="snowflake">
                    <img src="/landing/home/plugins/aws-white.svg" alt="aws">
                    <img src="/landing/home/plugins/databricks.svg" alt="databricks">
                    <img src="/landing/home/plugins/azure.svg" alt="azure">
                    <img src="/landing/home/plugins/dbt.svg" alt="dbt">
                    <img src="/landing/home/plugins/airbyte.svg" alt="airbyte">
                    <img src="/landing/home/plugins/docker.svg" alt="docker">
                    <img src="/landing/home/plugins/terraform.svg" alt="terraform">
                    <img src="/landing/home/plugins/g-cloud.svg" alt="g-cloud">
                    <img src="/landing/home/plugins/github.svg" alt="github">
                </div>
                <div class="mt-5 d-flex justify-content-center">
                    <NuxtLink class="btn btn-animated btn-dark-animated" href="/plugins">See all plugins</NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Section from '../layout/Section.vue';

    export default {
        components: {Section},
        data() {
            return {
                active: 1,
            };
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: url("/landing/home/plugins/background.svg") no-repeat center;
        color: var(--bs-white);
        padding: 0;

        .container {
            padding: 64px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .title {
            color: var(--bs-white);
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: 50px;
            font-style: normal;
            font-weight: 300;
            line-height: 64px;
            padding: 0 24%;

            @include media-breakpoint-down(lg) {
                padding: 0;
            }

            span {
                background: linear-gradient(91deg, #E151F7 43.87%, #5C47F5 55.51%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }

        .plugins {
            gap: 27px 64px;
            margin: 90px 0;
        }


        .row {
            div:nth-child(2) {
                @include media-breakpoint-up(lg) {
                    padding: calc($spacer * 4) calc($spacer * 4) 0;
                }

                h2 {
                    margin-bottom: calc($spacer * 2);
                    background: linear-gradient(90.03deg, #E151F7 2.16%, #5C47F5 65.09%);
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-fill-color: transparent;
                }

                p {
                    font-size: $font-size-lg;
                }
            }
        }
    }


</style>