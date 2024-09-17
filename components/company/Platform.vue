<template>
    <div class="container-fluid">
        <div class="hero container">
            <div class="row">
                <div class="text-block col-md-6 d-flex align-items-center">
                    <div>
                        <h2 data-aos="fade-left">Finally a Simple Orchestration Platform that <span>scales</span></h2>
                        <p class="mt-3" data-aos="fade-right">
                            Hundreds of organizations have already experienced significant productivity gains since adopting Kestra in their business-critical production workflows, validating the transformative power of our solution.
                        </p>
                        <p data-aos="fade-right" class="mt-3">
                            <a href="https://kestra.io/docs/getting-started/quickstart#start-kestra">Get started</a> today and see how Kestra can help you build reliable workflows.
                        </p>
                    </div>
                </div>
                <div class="col-md-6">
                    <img class="zoom img-fluid" src="/landing/company/ui.png" alt="Picture of the user interface of Kestra on light mode" data-aos="zoom-in"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        position: relative;
        &:before {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            background: url('/landing/company/platform-mask.svg') no-repeat center right;
            right: 13%;
        }

        .container {
            border-bottom: $block-border;
        }

        .text-block div {
            max-width: 90%;

            @include media-breakpoint-down(xxl) {
                max-width: 100%;
            }

            h2 {
                color: $white;
                font-weight: 300;
                margin-bottom: 0;

                span {
                    background: linear-gradient(90deg, #E151F7 1.11%, #5C47F5 34.37%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            p {
                color: $white;
                font-weight: 300;
                font-size: $font-size-md;
            }
        }
    }
</style>
<script setup lang="ts">
</script>