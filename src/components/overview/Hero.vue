<template>
    <section class="main-header">
        <div class="hero container">
            <div class="text-block">
                <p class="highlight" data-usal="fade-up">Platform Capabilities</p>
                <h1 data-usal="fade-up">Overview</h1>

                <div class="video-responsive" data-usal="fade-up">
                    <iframe
                        src="https://www.youtube.com/embed/xnGYiWFM2uk?si=Me1gxTBmI-YouP3H"
                        title="Getting Started with Kestra in 5 minutes"
                        allowfullscreen
                    />
                </div>

                <div class="buttons">
                    <a href="/demo" class="btn btn-secondary mb-2" target="_blank" data-usal="zoomin"> Talk to us </a>
                    <a href="/docs/quickstart#start-kestra" class="btn btn-primary ms-3 mb-2" data-usal="zoomin">
                        Get Started!
                    </a>
                </div>
            </div>
        </div>

        <div class="grid" />
        <div class="gradient" />
    </section>
</template>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .main-header {
        position: relative;
        overflow: hidden;
        .grid {
            position: fixed;
            inset: 0;
            background: url("~/assets/teams/gridbg.svg") center/cover no-repeat fixed;
            background-color: var(--ks-background-artwork);
            z-index: -4;
            pointer-events: none;
        }
        .gradient {
            position: fixed;
            inset: 0;
            background: url("/landing/overview/sm-platform-hero.png") right/cover no-repeat;
            z-index: -3;
            @include media-breakpoint-up(md) {
                background: url("/landing/overview/overview-top.png") 35% 0% no-repeat,
                            url("/landing/overview/mix.svg") top right / cover no-repeat;
            }
            @include media-breakpoint-up(lg) {
                background-size: 35% auto, cover;
            }
            @media (max-width: 768px) {
                mix-blend-mode: screen;
            }
        }
        .hero {
            padding: 3.5rem 0;
            @include media-breakpoint-up(md) {
                padding: 6.2rem 0 2rem;
            }
        }
        .text-block {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 0 1.25rem;
            z-index: 10;
        }
        .highlight {
            font-weight: 600;
            font-size: 1.15rem;
            background: linear-gradient(89.75deg, #9f79f3 0.22%, #658af9 99.78%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0;
            @media (max-width: 767px) {
                background: linear-gradient(94.69deg, #51cff7 57.35%, #4782f5 95.94%);
                -webkit-background-clip: text;
                background-clip: text;
            }
        }
        h1 {
            color: #fff;
            font-weight: 600;
            font-size: 2.188rem;
            margin: 0;
            text-align: center;
            @include media-breakpoint-up(md) {
                font-size: 4rem;
                max-width: 50rem;
            }
        }
        .buttons {
            .btn {
                border-radius: 8px;
            }
        }
        .video-responsive {
            width: 100%;
            max-width: 48.375rem;
            margin: 2rem 0;
            border-radius: 0.5rem;
            background: rgba(0, 0, 0, 0.7);
            box-shadow: 0 0 3.125rem rgba(94, 32, 188, 0.3);
            iframe {
                width: 100%;
                aspect-ratio: 16 / 9;
                border: none;
                border-radius: 0.5rem;
                display: block;
            }
        }
    }
</style>