<template>
    <section class="agnostic">
        <div class="container">
            <header class="header-content">
                <h2>Language-Agnostic Workflows</h2>
                <h2 class="subheading">At Any Scale</h2>
            </header>

            <div
                id="workflow-steps"
                class="workflow-steps"
                ref="workflowContainer"
                :class="{ 'section-active': isInWorkflowSection }"
            >
                <div class="workflow-track">
                    <div v-if="!isMobile" class="workflow-step">
                        <div
                            class="gradient-border"
                            :class="`${workflowSteps[currentStep]?.id}-border`"
                        ></div>
                        <div
                            class="step-content"
                            :key="`content-${currentStep}`"
                            data-usal="fade-u duration-600 ease-out-cubic"
                        >
                            <span
                                class="step-label"
                                :class="`${workflowSteps[currentStep]?.id}-label`"
                                >{{ workflowSteps[currentStep]?.label }}</span
                            >
                            <h4>{{ workflowSteps[currentStep]?.title }}</h4>
                            <p>{{ workflowSteps[currentStep]?.description }}</p>
                        </div>
                        <div class="step-image">
                            <NuxtImg
                                :src="workflowSteps[currentStep]?.image"
                                :alt="workflowSteps[currentStep]?.alt"
                                width="600"
                                height="371"
                            />
                        </div>
                    </div>

                    <template v-else>
                        <div
                            v-for="(step, index) in workflowSteps"
                            :key="step.id"
                            class="workflow-step"
                            :data-step="index + 1"
                            :class="{ active: index === currentStep }"
                        >
                            <div class="gradient-border" :class="`${step.id}-border`"></div>
                            <div class="step-content">
                                <span class="step-label" :class="`${step.id}-label`">{{
                                    step.label
                                }}</span>
                                <h4>{{ step.title }}</h4>
                                <p>{{ step.description }}</p>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <footer class="footer">
                <p>
                    With native triggers, declarative flows, and built-in monitoring, Kestra gives
                    you a clear path from workflow creation to reliable execution across your stack
                </p>
                <div class="buttons">
                    <a href="/demo" class="btn btn-secondary mb-2" target="_blank"> Talk to us </a>
                    <a href="/docs/quickstart#start-kestra" class="btn btn-primary ms-3 mb-2">
                        Get Started!
                    </a>
                </div>
            </footer>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref, computed, watch, onUnmounted } from "vue"
    import {
        useWindowScroll,
        useEventListener,
        useElementBounding,
        useWindowSize,
    } from "@vueuse/core"
    import { usePluginsCount } from "~/composables/usePluginsCount"

    const { totalPlugins } = usePluginsCount()

    const workflowContainer = ref<HTMLElement>()
    const currentStep = ref(0)
    const isScrolling = ref(false)
    const isInWorkflowSection = ref(false)
    const isExiting = ref(false)
    const lastExitTime = ref(0)
    const hasCompletedSteps = ref(false)

    const touchStartY = ref(0)
    const touchStartX = ref(0)
    const isTouching = ref(false)

    const { y: scrollY } = useWindowScroll()
    const { width: windowWidth } = useWindowSize()

    const { top, bottom, height } = useElementBounding(workflowContainer)

    const workflowSteps = computed(() => [
        {
            id: "design",
            label: "Design",
            title: "Declare your Workflows",
            description:
                "Orchestrate all your processes with declarative YAML or directly from the UI. Design scalable workflows quickly, without boilerplate.",
            image: "/landing/overview/design.png",
            alt: "Design workflows",
        },
        {
            id: "connect",
            label: "Connect",
            title: "Plug to Any Tool",
            description: `Integrate with ${totalPlugins.value} plugins covering databases, APIs, cloud services, file systems, and more. No custom wrappers needed.`,
            image: "/landing/overview/connect.png",
            alt: "Connect to tools",
        },
        {
            id: "trigger",
            label: "Trigger",
            title: "Event Driven or Real Time",
            description:
                "Schedule executions, react to real-time events, or call workflows through API and webhooks. Native event-driven orchestration.",
            image: "/landing/overview/trigger.png",
            alt: "Event driven triggers",
        },
        {
            id: "run",
            label: "Run",
            title: "Execute at Any Scale",
            description:
                "Parallelize tasks, manage dependencies, handle retries. Kestra runs every step with precision and resilience.",
            image: "/landing/overview/run.png",
            alt: "Execute at scale",
        },
        {
            id: "observe",
            label: "Observe",
            title: "Stay in Control, Always",
            description:
                "Full observability over every execution. Access logs, outputs, and metrics in real time to debug faster and improve performance.",
            image: "/landing/overview/observe.png",
            alt: "Stay in control",
        },
    ])

    const isMobile = computed(() => {
        return windowWidth.value <= 992
    })

    const isSectionCentered = computed(() => {
        if (!workflowContainer.value) return false

        const viewportHeight = window.innerHeight
        const sectionCenter = top.value + height.value / 2
        const viewportCenter = viewportHeight / 2
        const centerDistance = Math.abs(sectionCenter - viewportCenter)

        const isNearlyCentered = centerDistance < viewportHeight * 0.1
        const isWellPositioned =
            top.value < viewportHeight * 0.5 && bottom.value > viewportHeight * 0.2
        const visibleHeight = Math.min(bottom.value, viewportHeight) - Math.max(top.value, 0)
        const visibility = visibleHeight / height.value

        return isNearlyCentered && isWellPositioned && visibility > 0.6
    })

    const resetScrollState = () => {
        isInWorkflowSection.value = false
        document.body.style.overflow = ""
        isExiting.value = true
        lastExitTime.value = Date.now()
        isTouching.value = false

        setTimeout(() => {
            isExiting.value = false
            if (hasCompletedSteps.value) {
                setTimeout(() => {
                    hasCompletedSteps.value = false
                }, 3000)
            }
        }, 1200)
    }

    const setInitialStep = (deltaY: number) => {
        currentStep.value = deltaY > 0 ? 0 : workflowSteps.value.length - 1
    }

    const handleStepNavigation = (deltaY: number) => {
        if (deltaY > 0) {
            if (currentStep.value < workflowSteps.value.length - 1) {
                currentStep.value++
            } else {
                hasCompletedSteps.value = true
                resetScrollState()
            }
        } else if (deltaY < 0) {
            if (currentStep.value > 0) {
                currentStep.value--
            } else {
                resetScrollState()
            }
        }
    }

    const handleKeyboardEvent = (event: KeyboardEvent) => {
        if (isExiting.value || window.innerWidth <= 992 || isTouching.value) return

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            const inSection = isSectionCentered.value

            if (inSection && !isInWorkflowSection.value && !hasCompletedSteps.value) {
                event.preventDefault()
                event.stopPropagation()

                if (!isScrolling.value) {
                    isInWorkflowSection.value = true
                    document.body.style.overflow = "hidden"
                    const deltaY = event.key === "ArrowDown" ? 1 : -1
                    setInitialStep(deltaY)

                    isScrolling.value = true

                    setTimeout(() => {
                        isScrolling.value = false
                    }, 400)
                }
            } else if (isInWorkflowSection.value) {
                event.preventDefault()
                event.stopPropagation()

                if (!isScrolling.value) {
                    const deltaY = event.key === "ArrowDown" ? 1 : -1
                    handleStepNavigation(deltaY)

                    isScrolling.value = true

                    setTimeout(() => {
                        isScrolling.value = false
                    }, 400)
                }
            }
        }
    }

    const handleWheelEvent = (event: WheelEvent) => {
        if (isExiting.value || window.innerWidth <= 992 || isTouching.value) return

        const inSection = isSectionCentered.value

        if (inSection && !isInWorkflowSection.value && !hasCompletedSteps.value) {
            event.preventDefault()
            event.stopPropagation()

            if (!isScrolling.value) {
                isInWorkflowSection.value = true
                document.body.style.overflow = "hidden"
                setInitialStep(event.deltaY)

                isScrolling.value = true

                setTimeout(() => {
                    isScrolling.value = false
                }, 400)
            }
        } else if (isInWorkflowSection.value) {
            event.preventDefault()
            event.stopPropagation()

            if (!isScrolling.value) {
                handleStepNavigation(event.deltaY)

                isScrolling.value = true

                setTimeout(() => {
                    isScrolling.value = false
                }, 400)
            }
        } else {
            if (isInWorkflowSection.value) {
                resetScrollState()
            }
        }
    }

    const handleTouchStart = (event: TouchEvent) => {
        if (isExiting.value || window.innerWidth <= 992) return

        const touch = event.touches[0]
        touchStartY.value = touch.clientY
        touchStartX.value = touch.clientX
        isTouching.value = true
    }

    const handleTouchMove = (event: TouchEvent) => {
        if (isExiting.value || window.innerWidth <= 992 || !isTouching.value) return

        const inSection = isSectionCentered.value

        if (inSection || isInWorkflowSection.value) {
            event.preventDefault()
        }
    }

    const handleTouchEnd = (event: TouchEvent) => {
        if (isExiting.value || window.innerWidth <= 992 || !isTouching.value) return

        const touch = event.changedTouches[0]
        const deltaY = touchStartY.value - touch.clientY
        const deltaX = Math.abs(touchStartX.value - touch.clientX)

        const minSwipeDistance = 50

        if (Math.abs(deltaY) < minSwipeDistance || deltaX > Math.abs(deltaY)) {
            isTouching.value = false
            return
        }

        const inSection = isSectionCentered.value

        if (inSection && !isInWorkflowSection.value && !hasCompletedSteps.value) {
            event.preventDefault()
            event.stopPropagation()

            if (!isScrolling.value) {
                isInWorkflowSection.value = true
                document.body.style.overflow = "hidden"
                setInitialStep(deltaY)

                isScrolling.value = true

                setTimeout(() => {
                    isScrolling.value = false
                }, 400)
            }
        } else if (isInWorkflowSection.value) {
            event.preventDefault()
            event.stopPropagation()

            if (!isScrolling.value) {
                handleStepNavigation(deltaY)

                isScrolling.value = true

                setTimeout(() => {
                    isScrolling.value = false
                }, 400)
            }
        }

        isTouching.value = false
    }

    const handlePageScroll = () => {
        if (
            isInWorkflowSection.value &&
            !isSectionCentered.value &&
            !isExiting.value &&
            !isTouching.value
        ) {
            resetScrollState()
        }
    }

    watch(scrollY, () => {
        handlePageScroll()
    })

    useEventListener("wheel", handleWheelEvent, { passive: false })
    useEventListener("keydown", handleKeyboardEvent)
    useEventListener("touchstart", handleTouchStart, { passive: false })
    useEventListener("touchmove", handleTouchMove, { passive: false })
    useEventListener("touchend", handleTouchEnd, { passive: false })

    onUnmounted(() => {
        resetScrollState()
        isExiting.value = false
        isTouching.value = false
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    $step-colors: (
        design: #7751f4,
        connect: #ff694b,
        trigger: #51f485,
        run: #f4c951,
        observe: #c051f4,
    );

    $label-colors: (
        design: linear-gradient(89.75deg, #9f79f3 0.22%, #658af9 99.78%),
        connect: #ff694b,
        trigger: #21ce9c,
        run: #f4c951,
        observe: #c051f4,
    );

    .agnostic {
        background: #15171e;
        padding: 5rem 0;

        .container {
            margin: 0 auto;
            padding: 0 1.25rem;
        }

        .header-content {
            text-align: left;
            margin-bottom: 5rem;

            h2 {
                font-size: 3rem;
                font-weight: 600;
                color: $white;

                &.subheading {
                    background: linear-gradient(89.89deg, #9f79f3 37.64%, #658af9 63.06%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            }
        }

        .workflow-steps {
            position: relative;
            height: 31.25rem;
            overflow: hidden;
            transition: all 0.3s ease;
            @media screen and (min-width: 992px) {
                padding: 0 1.25rem;
            }
        }

        .scroll-hint {
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 10;
            backdrop-filter: blur(10px);

            .hint-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;

                .hint-text {
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: color 0.3s ease;
                }

                .progress {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.875rem;
                    background: transparent;

                    .current {
                        font-weight: 600;
                        transition: color 0.3s ease;
                    }

                    .separator,
                    .total {
                        color: #94a3b8;
                    }
                }
            }
        }

        .workflow-track {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .workflow-step {
            display: flex;
            align-items: center;
            gap: 3.125rem;
            position: relative;
            height: 31.25rem;
            width: 100%;

            .gradient-border {
                width: 0.5rem;
                height: 29.375rem;
                border-radius: 0.5rem;
                position: relative;
                border: 4px solid;
                transition: border-image 0.5s ease;

                @each $step, $color in $step-colors {
                    &.#{$step}-border {
                        border-image: linear-gradient(
                                180deg,
                                #16181f 0%,
                                #{$color} 37.02%,
                                #{$color} 65.87%,
                                #16181f 100%
                            )
                            1;
                    }
                }

                &::before {
                    content: "";
                    position: absolute;
                    width: 2.763rem;
                    height: 2.763rem;
                    background: #8082f64d;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }

                &::after {
                    content: "";
                    position: absolute;
                    width: 0.881rem;
                    height: 0.881rem;
                    background: $white;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1;
                }

                @media (max-width: 992px) {
                    height: 12rem;
                }
            }

            .step-content {
                flex: 1;
                max-width: 29.75rem;

                .step-label {
                    font-weight: 600;
                    font-size: 1.15rem;
                    color: #94a3b8;
                    text-transform: capitalize;
                    margin-bottom: 1rem;
                    display: block;

                    @each $step, $color in $label-colors {
                        &.#{$step}-label {
                            @if $step ==design {
                                background: #{$color};
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                                background-clip: text;
                            } @else {
                                color: #{$color};
                            }
                        }
                    }
                }

                h4 {
                    font-weight: 600;
                    font-size: 1.875rem;
                    line-height: 3rem;
                    color: $white;
                    margin: 0 0 1.25rem 0;
                }

                p {
                    font-weight: 400;
                    font-size: 1.125rem;
                    line-height: 1.625rem;
                    color: #e1e1e1;
                    margin: 0;
                }
            }

            .step-image {
                flex-shrink: 0;
                width: 37.5rem;
                height: 23.188rem;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
        }

        .footer {
            margin-top: 5.625rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.688rem;
            border-radius: 1rem;
            padding: 2rem;
            background: linear-gradient(180deg, #21242e 0%, #1a1c24 100%);
            border: 1px solid;
            border-image-source: linear-gradient(180deg, #2b313e 0%, #131725 100%);
            text-align: center;

            p {
                font-size: 1.15rem;
                line-height: 1.875rem;
                color: $white;
                font-weight: 700;
                max-width: 48.313rem;
                margin: 0;
            }

            .buttons {
                text-align: center;
                white-space: nowrap;

                .btn {
                    border-radius: 8px;
                }
            }
        }

        @media (max-width: 1200px) {
            .workflow-step {
                gap: 2.5rem;

                .step-content {
                    max-width: 25rem;
                }

                .step-image {
                    width: 31.25rem;
                    height: 19.375rem;
                }
            }
        }

        @media (max-width: 992px) {
            .workflow-steps {
                height: auto;
                overflow: visible;
                touch-action: pan-y;
            }

            .workflow-track {
                transform: none !important;
                height: auto;
                flex-direction: column;
            }

            .workflow-step {
                gap: 2.5rem;
                height: auto;
                opacity: 1 !important;

                &:last-child {
                    margin-bottom: 0;
                }

                .step-content {
                    flex: 1;
                    max-width: none;

                    .step-label {
                        font-size: 1rem;
                        margin-bottom: -0.25rem;
                    }

                    h4 {
                        font-size: 1.75rem;
                        line-height: 2.25rem;
                        margin: 0 0 0.75rem 0;
                    }

                    p {
                        font-size: 1rem;
                        line-height: 1.5rem;
                        color: #dee0e4;
                        margin: 0;
                    }
                }

                .step-image {
                    display: none;
                }
            }
        }
    }
</style>