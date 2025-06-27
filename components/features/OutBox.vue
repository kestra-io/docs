<template>
    <section class="main">
        <div class="container">
            <div class="content-wrapper">
                <div class="content">
                    <h1 class="title">Out of the Box Features</h1>
                    <h1 class="title highlight">Add New Workflows in Minutes.</h1>
                    <div class="features-grid">
                        <div 
                            v-for="(feature, index) in features" 
                            :key="index" 
                            class="feature-item"
                        >
                            <h5>{{ feature.title }}</h5>
                            <p class="feature-text">
                                {{ feature.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="images-container d-none d-xl-block">
            <div class="fivetran-image">
                <NuxtImg src="/landing/features/fivetran.png" alt="Fivetran" />
            </div>
            <div class="code-image">
                <NuxtImg src="/landing/features/code.png" alt="Code" />
            </div>
        </div>
        <div class="ellipse-container  d-none d-xl-block">
            <NuxtImg src="/landing/features/ellipse_box.png" alt="Ellipse Box" />
        </div>
    </section>
</template>

<script setup lang="ts">
interface Feature {
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        title: 'Declarative Workflow Definition',
        description: 'Strong typing with autocompletion, support through YAML and blueprints, and an intuitive UI with live topology views. Everything to build, validate, and visualize workflows.'
    },
    {
        title: 'Code Faster Without Boilerplate',
        description: 'Spend less time babysitting orchestration code. Define task dependencies in a natural order, run steps sequentially, in parallel, or conditionally all without digging through complex logic.'
    },
    {
        title: 'Event-Driven Workflow Execution',
        description: 'Run workflows on a schedule or trigger them automatically in response to real-time events like new data, files, messages, or completed workflows.'
    },
    {
        title: 'API First Design',
        description: 'Automate anything, execute and monitor workflows in real time, see executions start instantly, follow task progress live, and access logs and results as they happen.'
    }
];
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

.main {
    background-color: #15171e;
    overflow: hidden;
    position: relative;
    height: 100vh;
    display: flex;
    align-items: start;
    margin-top: -1.5rem;

    @include media-breakpoint-up(lg) {
        height: 681px;
    }

    .container {
        position: relative;
        z-index: 1;
        margin: 0 auto;
        padding: 0 1rem;
        flex: 1;

        .content-wrapper {
            width: 100%;

            @include media-breakpoint-up(xl) {
                width: 50%;
            }
        }

        .content {
            color: $white;
            padding-top: 5rem;

            .title {
                font-weight: 600;
                font-size: 2rem;
                line-height: 2.25rem;
                @include media-breakpoint-up(lg) {
                    line-height: 3rem;
                    margin-bottom: -.5rem;
                }
                &.highlight {
                    background: linear-gradient(90.21deg, #8C4BFF 36.32%, #658AF9 63.11%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    color: transparent;
                }
            }

            .features-grid {
                display: grid;
                gap: 29px;
                grid-template-columns: 1fr;
                margin-top: 3rem;

                @include media-breakpoint-up(md) {
                    grid-template-columns: repeat(2, 1fr);
                }

                @media (min-width: 1370px) {
                    grid-template-columns: repeat(2, 308px);
                }

                .feature-item {
                    h5 {
                        font-weight: 700;
                        font-size: 16px;
                        line-height: 24px;
                        margin-bottom: 0.5rem;
                    }

                    .feature-text {
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 22px;
                        color: #e1e1e1;
                        margin: 0;
                    }
                }
            }
        }
    }

    .images-container {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;
        width: 800px;
        height: 100%;

        .fivetran-image,
        .code-image {
            position: absolute;
            right: 0;

            img {
                width: 600px;
                max-width: none;
            }
        }

        .fivetran-image {
            top: 120px;

            img {
                height: 254.54px;
            }
        }

        .code-image {
            top: 320px;

            img {
                height: 417.65px;
            }
        }
    }

    .ellipse-container {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 0;

        img {
            max-width: none;
            height: auto;
        }
    }
}
</style>