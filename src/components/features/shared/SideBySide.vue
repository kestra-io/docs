<template>
    <section class="container-fluid py-4">
        <div class="container">
            <div v-if="headerTitle" class="row justify-content-center mb-5">
                <div class="col-lg-6 text-center">
                    <h2 class="header-title" v-html="headerTitle"></h2>
                </div>
            </div>
            <div class="row align-items-center" :class="{ 'flex-row-reverse': reverse }">
                <div class="col-lg-6 mb-4 mb-lg-0" data-usal="zoomin">
                    <slot name="image">
                        <div v-if="image" :class="image.class || 'mask'">
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
                    </slot>
                </div>
                <div class="col-lg-6" :class="reverse ? 'pe-lg-5' : 'ps-lg-5'">
                    <div data-usal="fade-l" class="content-wrapper">
                        <div v-if="title || description">
                            <h2 v-if="title" class="title mb-3" v-html="title"></h2>
                            <template v-if="description">
                                <p v-if="typeof description === 'string'" class="description mb-4" v-html="description"></p>
                                <p v-else v-for="desc in description" :key="desc" class="description mb-4" v-html="desc"></p>
                            </template>
                        </div>

                        <div v-if="items && items.length" class="items-grid mb-4">
                            <div v-for="item in items" :key="item.title" class="item-card">
                                <h5 class="item-title">{{ item.title }}</h5>
                                <p class="item-desc" v-html="item.description"></p>
                            </div>
                        </div>

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
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    export interface Props {
        headerTitle?: string;
        title?: string;
        description?: string | string[];
        image?: { src: string; alt: string; width: string; height: string; class?: string };
        items?: any[];
        cta?: { text: string; href: string };
        reverse?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        reverse: false,
    });
</script>

 <style scoped lang="scss">
    @import "~/assets/styles/variable";

    section {
        background-color: var(--ks-background-secondary);
        border-top: $block-border;
        border-bottom: $block-border;
        .header-title {
            color: var(--ks-content-primary);
            font-size: $font-size-4xl;
        }
        .title {
            font-weight: 600;
            color: var(--ks-content-primary);
        }
        .description {
            font-size: $font-size-md;
            font-weight: 400;
            color: var(--ks-content-primary);
            line-height: 1.6;
        }
        .items-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .item-card {
            padding: 1.5rem;
            background-color: var(--ks-background-primary);
            border: 1px solid var(--ks-border-secondary);
            border-radius: 0.5rem;
            color: var(--ks-content-primary);
            .item-desc {
                color: var(--ks-content-primary);
                margin-bottom: 0;
            }
        }
        .mask,
        .mask-1 {
            position: relative;
            z-index: 1;
            img {
                position: relative;
                z-index: 10;
            }
            &::after,
            &::before {
                content: "";
                position: absolute;
                z-index: -1;
                filter: blur(65px);
                background: linear-gradient(180deg, rgba(98, 24, 255, 0) 0%, #6117ff 100%);
            }
        }
        .mask {
            &::after {
                width: 15rem;
                height: 15rem;
                right: 4rem;
                bottom: 4rem;
            }
        }
        .mask-1 {
            &::before {
                width: 9rem;
                height: 8rem;
                left: 0;
                top: 0;
                filter: blur(79px);
            }
            &::after {
                width: 15rem;
                height: 15rem;
                right: 0;
                bottom: 0;
            }
        }
    }
</style>
