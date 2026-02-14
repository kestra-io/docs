<template>
    <section class="container-fluid">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-5 order-1 order-md-0" data-usal="fade-r">
                    <h1 v-if="title" v-html="title"></h1>
                    <p class="baseline" data-usal="fade-l">
                        {{ description }}
                    </p>
                    <div class="cta d-flex gap-3">
                        <a 
                            v-for="item in cta" 
                            :key="item.text" 
                            :href="item.href" 
                            class="btn btn-animated"
                            :class="`btn-${item.style}-animated`" 
                            data-usal="zoomin"
                        >
                            {{ item.text }}
                        </a>
                    </div>
                </div>
                <div class="col-md-7 order-0 order-md-1" data-usal="zoomin">
                    <NuxtImg 
                        loading="lazy" 
                        format="webp" 
                        :width="image.width" 
                        :height="image.height"
                        class="img-fluid" 
                        :class="image.class" 
                        :src="image.src" 
                        :alt="image.alt" 
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
export interface Props {
    title: string;
    description: string;
    cta?: { text: string; href: string; style?: string }[];
    image: {
        src: string;
        alt: string;
        width: string;
        height: string;
        class?: string;
    };
}

withDefaults(defineProps<Props>(), {
    cta: () => [],
});
</script>

<style lang="scss" scoped>
@import "~/assets/styles/variable";

.container-fluid {
    background: url("/landing/features/language/header-bg.svg") no-repeat center;
    background-size: cover;
    .container {
        padding: calc($spacer * 3) 0;
        @include media-breakpoint-down(md) {
            padding: 2rem 1rem;
        }
        h1 {
            color: var(--ks-content-primary);
            font-size: $font-size-4xl;
            @include media-breakpoint-up(lg) {
                font-size: calc($font-size-2xl * 1.75);
            }
        }
        p {
            color: var(--ks-content-primary);
            font-weight: normal;
            @include media-breakpoint-up(lg) {
                font-size: $font-size-lg;
            }
        }
    }
}
</style>
