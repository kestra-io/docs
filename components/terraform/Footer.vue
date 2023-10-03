<template>
    <div class="row justify-content-center">
        <div class="col-12 col-md-7">
            <div class="container text-center mb-5 rounded">
                <div>
                    <h3 data-aos="fade-right">Getting Started</h3>
                    <h6 class="mt-3" data-aos="zoom-in">
                        <p>Integration between Kestra and Terraform is straightforward. Add the Kestra provider to your Terraform main configuration file to get started.</p>
                    </h6>
                    <div class="d-flex flex-wrap justify-content-center align-items-center">
                        <NuxtLink href="https://www.youtube.com/watch?v=tiHa3zucS_Q&list=PLEK3H8YwZn1olYeQ7qbGdY5XQySKCNLUr&ab_channel=Kestra">
                            <button class="btn btn-light me-3">YouTube playlist</button>
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
        background: #2A1940;
        padding: calc($spacer * 2.375) calc($spacer * 2);


        > div {
            h6 {
                font-weight: normal;
                line-height: 1.625rem;
            }
        }
    }
    
</style>