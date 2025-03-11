<template>
    <div class="main">
        <div class="hero container">
            <div class="text-block">
                <h1>
                    Powerful orchestration.
                    Simplified workflows.
                </h1>
                <p>Unify orchestration for all engineers.  Build and govern business-critical workflows as code and from the UI.</p>
                <div class="buttons">
                    <NuxtLink
                        href="/docs/getting-started/quickstart#start-kestra"
                        class="btn btn-primary me-3 mb-2"
                    >
                        Get started
                    </NuxtLink>

                    <NuxtLink
                        href="/demo"
                        class="btn btn-secondary mb-2"
                        target="_blank"
                    >
                        Book a Demo
                    </NuxtLink>

                </div>
            </div>
            <div class="img-block">
                <NuxtImg
                    v-if="isMobile"
                    width="2991px"
                    height="1257px"
                    loading="lazy"
                    format="webp"
                    src="/landing/home/homepage.jpg"
                    alt="homepage"
                    class="homepage-image"
                />
                <canvas v-else ref="canvas" height="1520" width="2000"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from "vue";
    import { useMediaQuery } from "@vueuse/core";

    const isMobile = useMediaQuery('(max-width: 768px)')

    import { Rive } from "@rive-app/canvas";

    const videoVisible = ref(false)
    const canvas = ref<HTMLCanvasElement>()
    const scrollingTexts = [
        { text: "Orchestrate", color: "#E500EA" },
        { text: "Automate", color: "#4281FF" },
        { text: "Schedule", color: "#9D40FB" },
    ]

    const riveAnimation = ref()

    function setupRiveAnimation(){
        if(!canvas.value) return
        const anim = new Rive({
            src: "/landing/home/homepage.riv",
            canvas: canvas.value,
            autoplay: true,
            stateMachines: "kestra",
            isTouchScrollEnabled: true,
            onLoad: () => {
                anim.resizeDrawingSurfaceToCanvas();
            },
        });
        riveAnimation.value = anim
    }

    onMounted(() => {
        if(!isMobile.value){
            setupRiveAnimation()
        }
    })
    function cleanupRiveAnimation(){
        try{
            riveAnimation.value?.cleanup();
        }catch(e){
            // eat the error
        }
        riveAnimation.value = undefined
    }

    watch(isMobile, (newVal) => {
        if(newVal){
            cleanupRiveAnimation()
        }else{
            nextTick(() => {
                setupRiveAnimation();
            })
        }
    })

    onUnmounted(() => {
        cleanupRiveAnimation();
    })
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .main {
        position: relative;
        &::before {
            position: absolute;
            content: "";
            z-index: 0;
            width: 100vw;
            height: 91.6%;
            right: 0;
            top: 0;
        }
        .text-block {
            position: relative;
            z-index: 10;
            margin: 4rem 0 1rem;
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
            gap: $spacer;
            @include media-breakpoint-down(md) {
                margin: 2.5rem 0 1rem;
            }
            p{
                max-width: 500px;
                font-weight: 300;
            }
        }

        .hero {
            padding-bottom: 2rem;
            padding-top: 5rem;
            position: relative;
        }

        h1 {
            color: var(--bs-white);
            text-align: center;
            max-width: 100%;
            font-size: 24pt;
            font-weight: 400;
            padding: 0;
            margin-top: 2rem;
            margin-bottom: 0;
            @include media-breakpoint-up(lg) {
                margin: 0;
                max-width: 800px;
                font-size: 39pt;
                line-height: 1em;
            }
        }

        p {
            max-width: fit-content;
            text-align: center;
            font-weight: 500;
            font-size: $h6-font-size;
            color: $white;
            text-wrap: balance;
            margin:0;
            margin-top: .5rem;
            @include media-breakpoint-down(md) {
                font-size: 11pt;
            }
            @include media-breakpoint-up(lg) {
                text-wrap: wrap;
                width: 600px;
            }
        }

        .buttons {
            text-align: center;
            margin-top: 1.5rem;
        }

        .companies {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 4rem !important;
        }

        .companies-title {
            position: relative;

            &:after {
                content: "";
                position: absolute;
                left: 50%;
                bottom: -1rem;
                transform: translateX(-50%);
                display: inline-block;
                height: 2px;
                width: 51px;
                background: var(--bs-pink);
            }
        }

        @include media-breakpoint-down(lg) {
            .hero {
                padding-top: 6rem;
                padding-bottom: 2rem;

                .text-block {
                    margin-bottom: 0;
                }
            }
        }

        .img-block
        {
            display: flex;
            justify-content: center;
            .homepage-image{
                display: none;
            }
            @include media-breakpoint-down(md) {
                position: relative;
                justify-content: flex-start;
                left: -50px;
                canvas {
                    display: none;
                }
                .homepage-image{
                    display: block;
                    height: 500px;
                    margin-bottom: 100px;
                }
            }

            canvas {
                width: 2000px;
                margin-top: -700px;
                margin-bottom: -200px;
            }
        }

        :deep(.companies-container) {
            max-width: unset;
            .companies-list-container {
                &:before,
                &:after {
                    content: none;
                }
            }
        }
    }
</style>
