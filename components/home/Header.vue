<template>
    <section class="main-header">
        <div class="hero container">
            <div class="text-block">
                <h1>
                    Powerful orchestration.
                    Simplified workflows.
                </h1>
                <p>Unify orchestration for all engineers. Build and govern <br>all your workflows — Everything-as-Code, and from the UI.</p>
                <div class="buttons">
                    <NuxtLink
                        href="/docs/getting-started/quickstart#start-kestra"
                        class="btn btn-lg btn-primary me-3 mb-2"
                    >
                        Get Started!
                    </NuxtLink>

                    <NuxtLink
                        href="/demo"
                        class="btn btn-lg btn-secondary mb-2"
                        target="_blank"
                    >
                        Talk to us
                    </NuxtLink>

                </div>
            </div>
            <div class="img-block" ref="imgBlock">
                <a
                    href="https://www.youtube.com/embed/9tgQs0XgSVs?autoplay=1"
                    class="homepage-video"
                    data-bs-toggle="modal"
                    data-bs-target="#home-intro"
                >
                    <div>
                        <PlayCircleOutlineIcon class="play-icon"/>
                        Kestra in 60 seconds
                    </div>
                    <NuxtImg
                        src="/landing/home/video60sec.gif"
                        alt="video"
                        height="90"
                        width="162"
                    />
                </a>
                <NuxtImg
                    v-if="isMobile"
                    height="720"
                    loading="lazy"
                    src="/landing/home/homepage.png"
                    alt="homepage"
                    class="homepage-image"
                />
                <canvas v-else-if="!riveDisabled" ref="riveCanvas" id="rive-dev" height="1520" width="2000" :class="{
                    loading: !riveLoaded,
                }"/>
                <div class="canvas-placeholder" v-else>
                    Loading...
                </div>
            </div>
        </div>
    </section>
    <div
        v-on="{
            'show.bs.modal': () => (videoVisible = true),
            'hidden.bs.modal': () => (videoVisible = false),
        }"
        class="modal modal-full fade"
        id="home-intro"
        tabindex="-1"
        aria-labelledby="home-intro"
        aria-hidden="true"
    >
        <button 
        v-if="videoVisible"
        type="button" 
        class="floating-close-btn"
        @click="closeVideoModal"
        aria-label="Close video"
        >
            <Close />
        </button>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="video-responsive">
                        <iframe
                            v-if="videoVisible"
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/9tgQs0XgSVs?autoplay=1"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    import { useMediaQuery, useIntersectionObserver } from "@vueuse/core";
    import PlayCircleOutlineIcon from "vue-material-design-icons/PlayCircleOutline.vue";
    import Close from "vue-material-design-icons/Close.vue";

    const isMobile = useMediaQuery('(max-width: 768px)')

    import { Rive } from "@rive-app/canvas";

    const videoVisible = ref(false)
    const riveCanvas = useTemplateRef<HTMLCanvasElement>('riveCanvas')
    const imgBlock = useTemplateRef<HTMLDivElement>('imgBlock')

    const riveAnimation = ref()
    const riveLoaded = ref(false)
    const riveDisabled = ref(false)

    function closeVideoModal() {
        const modal = document.getElementById('home-intro');
        const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modal);
        
        if (modalInstance) {
            modalInstance.hide();
        } else {
            const closeBtn = document.createElement('button');
            closeBtn.setAttribute('data-bs-dismiss', 'modal');
            modal?.appendChild(closeBtn);
            closeBtn.click();
            modal?.removeChild(closeBtn);
        }
        videoVisible.value = false;
    }

    function setupRiveAnimation() {
        const canvas = riveCanvas.value;
         if(!canvas) {
            console.error("canvas not found")
            return
        }
        const anim = new Rive({
            src: "/landing/home/homepage.riv",
            canvas,
            autoplay: true,
            stateMachines: "kestra",
            isTouchScrollEnabled: true,
            onLoad: () => {
                riveLoaded.value = true
                anim.resizeDrawingSurfaceToCanvas();
            },
        });
        riveAnimation.value = anim
    }

    useIntersectionObserver(imgBlock, ([{ isIntersecting }]) => {
        if (isIntersecting && !isMobile.value) {
            riveDisabled.value = false
            nextTick(() => {
                setupRiveAnimation();
            })
        } else {
            riveDisabled.value = true
            cleanupRiveAnimation()
        }
    });

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

    .floating-close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 99999;
        width: 30px;
        height: 30px;
        border: none;
        border-radius: 50%;
        background: white;
        color: #000;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background: rgba(255, 255, 255, 0.9);
            transform: scale(1.05);
        }

        @include media-breakpoint-down(md) {
            width: 25px;
            height: 25px;
        }
    }

    @include media-breakpoint-down(md) {
        .modal-dialog{
            top: 28px;
        }
    }

    .main-header {
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
        }

        .hero {
            padding-bottom: 2rem;
            padding-top: 5rem;
            position: relative;
        }

        h1 {
            color: white;
            text-align: center;
            max-width: 100%;
            font-weight: 600;
            font-size: 1.5rem;
            padding: 0;
            margin-top: 2rem;
            margin-bottom: 0;
            @include media-breakpoint-up(lg) {
                font-size: 3rem;
                margin: 0;
                max-width: 800px;
                font-size: 3.875rem;
                line-height: 1.2em;
            }
        }

        p {
            max-width: fit-content;
            text-align: center;
            font-weight: 400;
            color: #B9B9BA;
            text-wrap: balance;
            margin: 0;
            margin-top: .5rem;
            font-size: .9rem;
            @include media-breakpoint-up(lg) {
                text-wrap: wrap;
                width: 600px;
                font-size: 1.2rem;
            }
        }

        .buttons {
            text-align: center;
            margin-top: 1.5rem;
            white-space: nowrap;
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
                padding-bottom: 0;
                .text-block {
                    margin-bottom: 0;
                }
            }
        }

        .img-block
        {
            .homepage-video {
                position: absolute;
                top: 30px;
                left: 50%;
                transform: translateX(-50%);
                @include media-breakpoint-up(lg) {
                    top: -70px;
                    transform: none;
                    right: 0;
                    left: auto;
                }
                z-index: 10;
                padding: 0;
                overflow: hidden;
                border: 1px solid #5818D8;
                border-radius: 1rem;
                color: white;
                height: 90px;
                background-color: #5818D8;
                > div {
                    position: absolute;
                    text-align: center;
                    display: flex;
                    width: 100%;
                    height: 100%;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    font-size: 13px;;
                    .play-icon{
                        margin: .5rem;
                        font-size: 32px;
                    }
                }
            }
            position: relative;
            display: flex;
            justify-content: center;
            .homepage-image {
                display: none;
            }
            @include media-breakpoint-down(md) {
                position: relative;
                justify-content: flex-start;
                height: 360px;
                overflow: hidden;
                width: 100vw;
                canvas {
                    display: none;
                }
                .homepage-image{
                    display: block;
                    height: 400px;
                    margin-top: 75px;
                    position: relative;
                    width: 900px;
                    left: -50px;
                    margin-bottom: 100px;
                }
            }

            canvas, .canvas-placeholder {
                width: 2000px;
                margin-top: -700px;
                margin-bottom: -200px;
                background-image: url("/landing/home/homepage.png");
                background-position: 237px 596px;
                background-size: 1600px;
                background-repeat: no-repeat;
            }

            .canvas-placeholder{
                height: 1520px;
            }

            canvas.loading{
                opacity: .5;
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
