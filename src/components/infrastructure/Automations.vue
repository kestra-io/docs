<template>
    <section class="arc">
        <div class="container">
            <div
                class="arc-embed"
                data-aos="zoom-in"
                data-aos-duration="400"
                data-aos-delay="0"
                data-aos-easing="ease-out"
            >
                <iframe
                    class="arc-iframe"
                    src="https://demo.arcade.software/4ggZ33yP4fKHcs7yk6lz?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true&autoplay=true"
                    title="Infra"
                    frameborder="0"
                    loading="lazy"
                    allow="clipboard-write"
                    allowfullscreen
                />
            </div>
        </div>
    </section>

    <section class="automations">
        <div class="container">
            <h3
                data-aos="fade-up"
                data-aos-duration="400"
                data-aos-delay="0"
                data-aos-easing="ease-out"
            >
                Ready-to-Use <span class="highlight">Automation</span> Patterns
            </h3>

            <div class="blueprints">
                <button class="navigation navigation-left d-md-none" @click="scrollLeft"><ArrowLeft/></button>
                <button class="navigation navigation-right d-md-none" @click="scrollRight"><ArrowRight/></button>
                <div class="row carousel-md" ref="wrapper">
                    <div
                        v-for="(blueprint) in blueprints"
                        :key="blueprint.id"
                        class="col-lg-4 col-md-6 mb-3 card-wrapper"
                        data-aos="zoom-in-up"
                        data-aos-duration="400"
                        data-aos-delay="0"
                        data-aos-easing="ease-out"
                    >
                        <BlueprintCard
                            :blueprint="blueprint"
                            :tags
                            :href="`/blueprints/${blueprint.id}`"
                            scheme="light"
                        />
                    </div>
                </div>
            </div>

            <div
                class="align-self-end"
                data-aos="fade-in"
                data-aos-duration="400"
                data-aos-delay="0"
                data-aos-easing="ease-out"
            >
                <Link
                    href="/blueprints?tags=infrastructure"
                    text="View more Infrastructure blueprints"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import {ref, computed} from 'vue'
    import {useWindowSize} from '@vueuse/core'
    import ArrowLeft from "vue-material-design-icons/ArrowLeft.vue"
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue"
    import BlueprintCard from "~/components/layout/BlueprintCard.vue";
    import Link from "~/components/common/Link.vue";

    const props = defineProps<{
        blueprints: Blueprint[],
        tags: BlueprintTag[]
    }>()

    const wrapper = ref<HTMLElement | null>(null)

    const scrollLeft = () => {
        if(wrapper.value){
            wrapper.value.scrollTo({left:wrapper.value.scrollLeft - 300, behavior: 'smooth'})
        }
    }

    const scrollRight = () => {
        if(wrapper.value) {
            wrapper.value.scrollTo({left:wrapper.value.scrollLeft + 300, behavior: 'smooth'})
        }
    }

    const { width } = useWindowSize()
    const size = computed(() => width.value >= 768 ? 6 : 20)

    const blueprints = computed(() => props.blueprints?.slice(0, size.value) ?? [])
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .arc {
        width: 100%;
        padding: 3rem 1rem;
        border: 1px solid #E1E3E5;
        background: $white;

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            padding: 0;

            .arc-embed {
                position: relative;
                padding-bottom: calc(68.5088% + 41px);
                height: 0;
                width: 100%;

                .arc-iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 0;
                    color-scheme: light;
                }
            }
        }
    }

    .automations {
        background-image: url('/landing/infrastructure/grid.svg');
        background-color: #F4F4F4;
        width: 100%;
        padding: 3rem 0;

        @include media-breakpoint-up(lg) {
            padding: 4rem 0;
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: $rem-1;
            @include media-breakpoint-up(md) {
                gap: $rem-2;
            }
            padding: 0 1rem;

            @media (min-width: 576px) and (max-width: 768px) {
                max-width: 768px;
            }

            h3 {
                font-size: 2rem;
                text-align: center;
            }

            .btn {
                padding: 0.5rem 1.5rem;
                font-size: 16px;
                font-weight: 700;
                border-radius: 8px;
            }

            .blueprints {
                position: relative;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;

                .navigation {
                    position: absolute;
                    top: 46%;
                    transform: translateY(-50%);
                    background-color: $black-10;
                    color: $white;
                    border-radius: 50%;
                    z-index: 10;
                    height: 35px;
                    width: 35px;
                    border: none;
                    font-size: 24px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;

                    &-left {
                        left: -0.5rem;
                    }

                    &-right {
                        right: -0.5rem;
                    }

                    :deep(svg) {
                        position: absolute;
                        bottom: 0;
                    }
                }

                .carousel-md {
                    @include media-breakpoint-down(md) {
                        display: flex;
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        gap: 1rem;
                        margin: 0;
                        scrollbar-width: none;

                        &::-webkit-scrollbar {
                            display: none;
                        }

                        .card-wrapper {
                            flex: 0 0 auto;
                            width: 291px;
                            max-width: 291px;
                            padding: 0;
                        }
                    }
                }
            }

            .row {
                width: 100%;

                > * {
                    padding-right: 8px;
                    padding-left: 8px;
                }
            }

            .highlight {
                background: linear-gradient(90deg, #9F79F3 0%, #658AF9 100%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
            }
        }
    }
</style>