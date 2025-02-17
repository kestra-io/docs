<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row g-0">
                <div class="col-md-6 p-5 d-flex flex-column justify-content-center">
                    <h6>OHHHH... 😔</h6>
                    <h1 @click="visible = !visible">
                        {{ title }}
                    </h1>
                    <p class="text-error">
                        {{ description }}
                    </p>
                    <div v-if="visible">
                        <h3>{{ error.message }}</h3>
                        <span v-html="error.stack" />
                    </div>
                    <NuxtLink href="/" class="btn btn-animated btn-purple-animated mb-2">
                        Back to home
                    </NuxtLink>
                </div>
                <div class="col-md-6 p-5">
                    <img class="img-fluid" src="/error/error.png" alt="error" />
                </div>
            </div>
        </div>
    </div>

    <LayoutFooterContact
        title="New to Kestra?"
        subtitle="Use blueprints to kickstart your first workflows."
        purpleButtonText="Get started with Kestra"
        purpleButtonHref="https://kestra.io/slack"
        :animation="false"
        class="mb-5"
    />
</template>

<script>
    export default {
        name: "error",
        props: ['error', 'title', 'description'],
        data() {
            return {
                visible: false
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .container-fluid {
        background: url("/error/background.svg") no-repeat center 100%;

        .container {
            padding-top: 5rem;
            padding-bottom: 3rem;
            border-bottom: $block-border;
            color: $white;

            h6, h1, .text-error {
                font-weight: 300;
                margin-bottom: 1rem;
            }

            h6, .text-error {
                font-size: $font-size-xl;
            }

            h1 {
                font-size: 3.125rem;
                background: linear-gradient(90deg, #E151F7 46.62%, #5C47F5 55.05%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            a {
                width: fit-content;
            }
        }
    }

    .text-error {
        font-size: $font-size-lg;
        font-weight: 300;
    }
</style>