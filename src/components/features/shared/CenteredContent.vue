<template>
    <section class="container-fluid py-5 centered-feature">
        <div class="container">
            <div class="text-center mb-4" v-if="image">
                <NuxtImg
                    loading="lazy"
                    format="webp"
                    :width="image.width"
                    :height="image.height"
                    class="img-fluid"
                    :src="image.src"
                    :alt="image.alt"
                />
            </div>
            <div class="heading mx-auto pb-4 text-center">
                <h1 v-if="title" class="title" v-html="title"></h1>
                <p v-if="description" class="description mt-3 mb-4">
                    {{ description }}
                </p>
                <a
                    v-if="cta"
                    :href="cta.href"
                    class="btn btn-primary"
                    data-usal="zoomin"
                >
                    {{ cta.text }}
                </a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    defineProps<{
        title?: string;
        description?: string;
        image?: {
            src: string;
            alt: string;
            width: string;
            height: string;
        };
        cta?: {
            text: string;
            href: string;
        };
    }>();
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .centered-feature {
        background-color: var(--ks-background-body);
        border-top: $block-border;
        border-bottom: $block-border;
    }

    .heading {
        max-width: $container-max-width;
    }

    .title {
        font-weight: 600;
        color: var(--ks-content-primary);
    }

    .description {
        color: var(--ks-content-primary);
    }
</style>
