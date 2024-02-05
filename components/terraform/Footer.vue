<template>
    <div class="mx-3 mx-sm-0">
        <div class="row justify-content-center ">
            <div class="col-12 col-md-7">
                <div class="container text-center mb-5 rounded bg-dark-2">
                    <div>
                        <h3 data-aos="fade-right">Getting Started</h3>
                        <h6 class="mt-3" data-aos="zoom-in">
                            <p>Integration between Kestra and Terraform is simple. Add the Kestra provider to your Terraform configuration file to get started.</p>
                        </h6>
                        <div class="d-flex gap-2 flex-wrap justify-content-center align-items-center">
                            <NuxtLink class="btn btn-dark me-2" href="https://www.youtube.com/watch?v=tiHa3zucS_Q&list=PLEK3H8YwZn1olYeQ7qbGdY5XQySKCNLUr&ab_channel=Kestra">
                                YouTube playlist
                            </NuxtLink>
                            <NuxtLink class="btn btn-animated btn-purple-animated" href="/docs/terraform">
                                Documentation
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .container {
        position: relative;
        padding: calc($spacer * 2.375) calc($spacer * 2);
        border: $block-border;

        > div {
            h3 {
                font-size: $h3-font-size;
                font-weight: 100;
            }
            h6 p {
                font-weight: 300;
                line-height: 1.625rem;
                font-size: $h6-font-size;
                padding: 0 180px;

                @include media-breakpoint-down(xxl) {
                    padding: 0;
                }
            }
        }
    }
</style>