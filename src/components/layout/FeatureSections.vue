<template>
    <section class="feature-sections">
        <div class="container">
            <div v-for="section in sections" :key="section.id" class="section-block">
                <header class="section-header" :data-usal="getAnimate('fade-up', 50)">
                    <h2>{{ section.title }}</h2>
                    <p class="fs-5">{{ section.description }}</p>
                </header>

                <div class="features">
                    <div class="feature-card main" :data-usal="getAnimate('fade-up', 70)">
                        <div class="feature-image">
                            <NuxtImg v-if="section.mainFeature.image" :src="section.mainFeature.image"
                                :alt="section.mainFeature.title" width="1076" height="608" />
                        </div>
                        <div class="feature-content">
                            <h4>{{ section.mainFeature.title }}</h4>
                            <p>{{ section.mainFeature.description }}</p>
                        </div>
                    </div>

                    <div class="sub-features">
                        <div v-for="(subFeature, index) in section.subFeatures" :key="subFeature.id"
                            class="feature-card sub" :data-usal="getAnimate('fade-up', 70 + (index * 100))">
                            <div class="feature-image">
                                <NuxtImg v-if="subFeature.image" :src="subFeature.image" :alt="subFeature.title"
                                    width="490" height="277" />
                            </div>
                            <div class="feature-content">
                                <h4>{{ subFeature.title }}</h4>
                                <p>{{ subFeature.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { useBreakpoints, breakpointsTailwind } from "@vueuse/core"

    interface Feature {
        id: string;
        title: string;
        description: string;
        image?: string;
    }

    interface Section {
        id: string;
        title: string;
        description: string;
        mainFeature: Feature;
        subFeatures: Feature[];
    }

    defineProps<{
        sections: Section[]
    }>()

    const breakpoints = useBreakpoints(breakpointsTailwind)
    const isMobile = breakpoints.smaller("md")

    const getAnimate = (type: string, delay: number) => {
        return !isMobile.value ? `${type} duration-500 delay-${delay}` : undefined
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .feature-sections {
        padding: 4rem 0;
        color: var(--ks-content-primary);
        .section-block {
            margin-bottom: 5rem;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .section-header {
            margin-bottom: 3rem;
        }
        .features {
            .feature-card {
                padding: 2rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                border-radius: 1rem;
                background: var(--ks-background-primary);
                border: 1px solid var(--ks-border-primary);
                color: var(--ks-content-primary);
                .feature-image img {
                    width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    object-fit: cover;
                }
                &.main {
                    margin-bottom: 2rem;
                }
            }
            .sub-features {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 2rem;
            }
        }
        @media (max-width: 992px) {
            .features .sub-features {
                grid-template-columns: 1fr;
            }
        }
        @media (max-width: 768px) {
            padding: 3rem 0;
            .feature-card {
                padding: 1.25rem;
            }
        }
    }
</style>
