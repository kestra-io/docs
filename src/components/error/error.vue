<template>
    <Squared>
        <h1>{{ error.statusCode }}</h1>

        <h2 @click="visible = !visible">
            {{ title }}
        </h2>

        <p class="text-error">
            {{ description }}
        </p>

            <div v-if="visible" class="error-details">
                <h3 v-if="error.title">{{ error.title }}</h3>

                <div class="message-wrapper">
                    <pre
                        v-if="error.message"
                        class="error-message"
                    >{{ error.message }}</pre>
                    <pre class="raw-json">{{ JSON.stringify(error, null, 2) }}</pre>
                </div>
            </div>

        <Link href="/" text="Back to home" class="btn btn-primary" reversed />
        <img :src="errorImage.src" alt="Error" class="img-fluid" />
    </Squared>
</template>

<script lang="ts" setup>
    import { ref } from "vue"
    import errorImage from "./assets/error.webp"
    import Squared from "~/components/layout/Squared.vue"
    import Link from "~/components/common/Link.vue"

    defineOptions({
        name: "error",
    })

    defineProps<{
        error: {
            name?: string
            title?: string
            plugin?: string
            id?: string
            statusCode?: number
            message?: string
        }
        title: string
        description: string
    }>()

    const visible = ref(false)
</script>

<style lang="scss" scoped>


    .squared {
        padding-bottom: 0 !important;

        :deep(.container) {
            display: flex;
            align-items: center;
            flex-direction: column;
            text-align: center;
        }

        h1 {
            @include media-breakpoint-up(xl) {
                font-size: 128px;
            }

            @include media-breakpoint-down(xl) {
                font-size: $h1-font-size * 2;
            }
        }

        h2 {
            margin-bottom: 1rem;
            cursor: pointer;
        }

        .text-error {
            color: var(--ks-content-secondary);
            @include media-breakpoint-up(lg) {
                width: 306px;
            }
        }

        .error-details {
            text-align: left;
            margin: 2rem 0;
            padding: 1.5rem;
            width: 100%;
            max-width: 800px;
            border-radius: $border-radius-lg;
            padding: 1rem;

            h3 {
                font-size: $font-size-lg;
                margin-bottom: 1.5rem;
                color: var(--ks-content-primary);
                font-weight: 600;
                font-family: $font-family-monospace;
                background-color: var(--ks-background-function);
                width: fit-content;
                padding: 0.5rem;
                border-radius: $border-radius-lg;
            }

            .message-wrapper {
                background: var(--ks-background-secondary);
                border-radius: $border-radius-lg;
                padding: 1rem;
                overflow: hidden;
                border: $block-border;
            }
        }

        h6 {
            font-size: $font-size-lg;
        }

        a {
            width: fit-content;
        }

        .img-fluid {
            @include media-breakpoint-up(xl) {
                margin-top: -4rem;
            }
        }
    }
</style>