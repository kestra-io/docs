<template>
    <section class="sticky-steps-section">
        <div class="container">
            <header v-if="data.title || data.subheading" class="header-content">
                <h2 v-if="data.title">{{ data.title }}</h2>
                <h2 v-if="data.subheading" class="subheading">{{ data.subheading }}</h2>
            </header>

            <div id="sticky-steps" class="sticky-steps" ref="container"
                :class="{ 'section-active': isActive }">
                <div class="steps-track">
                    <div v-for="(step, index) in data.steps" :key="step.id" class="step-item"
                        :class="{ active: index === currentStep }" v-show="isMobile || index === currentStep" :style="{
                            '--step-color': step.color,
                            '--label-color': step.labelColor
                        }">
                        <div class="gradient-border"></div>

                        <Transition name="fade" mode="out-in">
                            <div class="step-content" :key="`content-${index}`">
                                <span class="step-label">{{ step.label }}</span>
                                <h4>{{ step.title }}</h4>
                                <p>{{ step.description }}</p>
                            </div>
                        </Transition>

                        <Transition name="fade" mode="out-in">
                            <div class="step-image" v-if="!isMobile" :key="`image-${index}`">
                                <NuxtImg :src="step.image" :alt="step.alt" width="600" height="371" />
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>

            <FooterContact v-if="data.footerSubtitle" :subtitle="data.footerSubtitle" />
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref, computed, onUnmounted } from "vue"
    import {
        useEventListener,
        useElementBounding,
        useWindowSize,
        useScrollLock,
    } from "@vueuse/core"
    
    import FooterContact from "~/components/layout/FooterContact.vue"

    interface Step {
        id: string;
        label: string;
        title: string;
        description: string;
        image: string;
        alt: string;
        color: string;
        labelColor: string;
    }

    const props = defineProps<{
        data: {
            steps: Step[];
            title?: string;
            subheading?: string;
            footerSubtitle?: string;
        }
    }>()

    const { width: windowWidth } = useWindowSize()
    const container = ref<HTMLElement>()
    const { top, bottom, height } = useElementBounding(container)
    const isLocked = useScrollLock(typeof document !== 'undefined' ? document.body : null)

    const currentStep = ref(0)
    const isScrolling = ref(false)
    const isActive = ref(false)
    const isExiting = ref(false)
    const hasCompleted = ref(false)
    const touchStartY = ref(0)
    const isTouching = ref(false)

    const isMobile = computed(() => windowWidth.value <= 992)

    const isCentered = computed(() => {
        if (!container.value) return false
        const vh = window.innerHeight
        const center = top.value + height.value / 2
        return Math.abs(center - vh / 2) < vh * 0.1 && top.value < vh * 0.5 && bottom.value > vh * 0.2
    })

    const reset = () => {
        isActive.value = false
        isLocked.value = false
        isExiting.value = true
        isTouching.value = false
        setTimeout(() => {
            isExiting.value = false
            if (hasCompleted.value) {
                setTimeout(() => { hasCompleted.value = false }, 3000)
            }
        }, 1200)
    }

    const navigate = (deltaY: number) => {
        if (deltaY > 0) {
            if (currentStep.value < props.data.steps.length - 1) {
                currentStep.value++
            } else {
                hasCompleted.value = true
                reset()
            }
        } else if (deltaY < 0) {
            if (currentStep.value > 0) {
                currentStep.value--
            } else {
                reset()
            }
        }
    }

    const onAction = (deltaY: number) => {
        if (isExiting.value || isMobile.value || isScrolling.value) return

        if (isCentered.value && !isActive.value && !hasCompleted.value) {
            isActive.value = true
            isLocked.value = true
            currentStep.value = deltaY > 0 ? 0 : props.data.steps.length - 1
            isScrolling.value = true
            setTimeout(() => { isScrolling.value = false }, 400)
        } else if (isActive.value) {
            navigate(deltaY)
            isScrolling.value = true
            setTimeout(() => { isScrolling.value = false }, 400)
        }
    }

    useEventListener("wheel", (e) => onAction(e.deltaY), { passive: false })
    useEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") onAction(e.key === "ArrowDown" ? 1 : -1)
    })
    useEventListener("touchstart", (e) => { touchStartY.value = e.touches[0].clientY; isTouching.value = true }, { passive: false })
    useEventListener("touchmove", (e) => { if (isActive.value) e.preventDefault() }, { passive: false })
    useEventListener("touchend", (e) => {
        if (!isTouching.value) return
        const deltaY = touchStartY.value - e.changedTouches[0].clientY
        if (Math.abs(deltaY) > 50) onAction(deltaY)
        isTouching.value = false
    }, { passive: false })

    onUnmounted(() => reset())
</script>

<style lang="scss" scoped>
    .sticky-steps-section {
        background: var(--ks-background-body);
        padding: 4rem 0;
        .header-content {
            margin-bottom: 5rem;
            text-align: center;
            h2 {
                font-size: 3rem;
                font-weight: 600;
                color: var(--ks-content-primary);
                &.subheading {
                    background: linear-gradient(89.89deg, #9f79f3 37.64%, #658af9 63.06%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            }
        }
    }

    .sticky-steps {
        position: relative;
        height: 31.25rem;
        transition: all 0.3s ease;
        @media (min-width: 992px) {
            padding: 0 1.25rem;
        }
        @media (max-width: 992px) {
            height: auto;
        }
        .steps-track {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            @media (max-width: 992px) {
                flex-direction: column;
            }
        }
        .step-item {
            display: flex;
            align-items: center;
            gap: 3.125rem;
            height: 100%;
            width: 100%;
            @media (max-width: 992px) {
                height: auto;
                gap: 2.5rem;
                margin-bottom: 2.5rem;
                &:last-child {
                    margin-bottom: 0;
                }
            }
            .gradient-border {
                width: 0.5rem;
                height: 29.375rem;
                border: 4px solid;
                position: relative;
                border-image:
                    linear-gradient(180deg,
                        var(--ks-background-body) 0%,
                        var(--step-color) 37.02%,
                        var(--step-color) 65.87%,
                        var(--ks-background-body) 100%) 1;
                &::before,
                &::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                }
                &::before {
                    width: 2.763rem;
                    height: 2.763rem;
                    background: rgba(128, 130, 246, 0.3);
                }
                &::after {
                    width: 0.881rem;
                    height: 0.881rem;
                    background: white;
                    z-index: 1;
                }
                @media (max-width: 992px) {
                    height: 12rem;
                }
            }
            .step-content {
                flex: 1;
                max-width: 29.75rem;
                @media (max-width: 992px) {
                    max-width: none;
                }
                .step-label {
                    font-weight: 600;
                    font-size: 1.15rem;
                    text-transform: capitalize;
                    margin-bottom: 1rem;
                    display: block;
                    background: var(--label-color);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    @supports not (-webkit-text-fill-color: transparent) {
                        color: var(--label-color);
                    }
                    @media (max-width: 992px) {
                        font-size: 1rem;
                        margin-bottom: -0.25rem;
                    }
                }
                h4 {
                    font-weight: 600;
                    font-size: 1.875rem;
                    line-height: 3rem;
                    color: var(--ks-content-primary);
                    margin: 0 0 1.25rem 0;
                    @media (max-width: 992px) {
                        font-size: 1.75rem;
                        line-height: 2.25rem;
                        margin-bottom: 0.75rem;
                    }
                }
                p {
                    font-size: 1.125rem;
                    line-height: 1.625rem;
                    margin: 0;
                    color: var(--ks-content-primary);
                    @media (max-width: 992px) {
                        font-size: 1rem;
                        line-height: 1.5rem;
                    }
                }
            }
            .step-image {
                flex-shrink: 0;
                width: 37.5rem;
                height: 23.188rem;
                display: flex;
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                @media (max-width: 1200px) {
                    width: 31.25rem;
                    height: 19.375rem;
                }
            }
        }
        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.4s ease;
        }
        .fade-enter-from,
        .fade-leave-to {
            opacity: 0;
        }
    }
</style>
