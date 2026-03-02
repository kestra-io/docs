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
    @import "~/assets/styles/variable";

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
            margin-bottom: 1rem;
            border: $block-border;
            border-radius: $border-radius-lg;
            padding: 1rem;

            ul {
                list-style: none;
                padding: 0;
            }

            pre {
                background: var(--ks-background-secondary);
                padding: 1rem;
                border-radius: 4px;
                max-width: 90vw;
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