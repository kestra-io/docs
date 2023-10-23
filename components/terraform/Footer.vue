<template>
    <div class="row justify-content-center">
        <div class="col-12 col-md-7">
            <div class="container text-center mb-5 rounded">
                <div>
                    <h3 data-aos="fade-right">Getting Started</h3>
                    <h6 class="mt-3" data-aos="zoom-in">
                        <p>Integration between Kestra and Terraform is simple. Add the Kestra provider to your Terraform configuration file to get started.</p>
                    </h6>
                    <div class="d-flex gap-2 flex-wrap justify-content-center align-items-center">
                        <NuxtLink href="https://www.youtube.com/watch?v=tiHa3zucS_Q&list=PLEK3H8YwZn1olYeQ7qbGdY5XQySKCNLUr&ab_channel=Kestra">
                            <button class="btn btn-light">YouTube playlist</button>
                        </NuxtLink>
                        <NuxtLink href="/docs/terraform">
                            <button class="btn btn-primary">Documentation</button>
                        </NuxtLink>
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
        background: $purple-31;
        padding: calc($spacer * 2.375) calc($spacer * 2);


        > div {
            h6 {
                font-weight: normal;
                line-height: 1.625rem;
            }
        }

        border: double 1px transparent;
        background-image: linear-gradient($purple-31, $purple-31), radial-gradient(circle at top left, #B010FB 18.11%, #DE97FF 27.65%, #A227DB 36.31%, rgba(162, 39, 219, 0) 58.84%, rgba(166, 16, 236, 0.84) 80.5%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
    }

</style>