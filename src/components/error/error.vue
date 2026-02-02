<template>
    <div class="container-fluid">
        <div class="container">
            <div class="row g-0">
                <div class="col-md-6 p-5 d-flex flex-column text-white justify-content-center">
                    <h6>OHHHH... 😔</h6>
                    <h1 @click="visible = !visible">
                        {{ title }}
                    </h1>
                    <p class="text-error">
                        {{ description }}
                    </p>
                    <div v-if="visible">
                        <h3>{{ error.title }}</h3>
                        <ul>
                            <li v-if="error.name">
                                name: <code>{{ error.name }}</code>
                            </li>
                            <li v-if="error.plugin">
                                plugin: <code>{{ error.plugin }}</code>
                            </li>
                            <li v-if="error.id">
                                id: <code>{{ error.id }}</code>
                            </li>
                        </ul>
                        <pre>{{ JSON.stringify(error, null, 2) }}</pre>
                    </div>
                    <a href="/" class="btn btn-animated btn-purple-animated mb-2"> Back to home </a>
                </div>
                <div class="col-md-6 p-5">
                    <img v-bind="errorImage" class="img-fluid" alt="error" />
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
        class="mb-5 text-white"
    />
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import LayoutFooterContact from "~/components/layout/FooterContact.vue"
    import errorImage from "./assets/error.png"

    defineOptions({
        name: "error",
    })

    defineProps<{
        error: {
            name: string
            title: string
            plugin: string
            id: string
        }
        title: string
        description: string
    }>()

    const visible = ref(false)
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        background: url("./assets/background.svg") no-repeat center 100%;

        .container {
            padding-top: 5rem;
            padding-bottom: 3rem;
            border-bottom: $block-border;
            color: $white;

            h6,
            h1,
            .text-error {
                font-weight: 300;
                margin-bottom: 1rem;
            }

            h6,
            .text-error {
                font-size: $font-size-xl;
            }

            h1 {
                font-size: 3.125rem;
                background: linear-gradient(90deg, #e151f7 46.62%, #5c47f5 55.05%);
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