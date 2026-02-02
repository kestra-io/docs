<template>
    <section class="main-header">
        <div class="hero container">
            <div class="text-block">
                <p class="highlight">Platform Capabilities</p>
                <h1>Overview</h1>

                <div class="video-responsive">
                    <iframe
                        src="https://www.youtube.com/embed/xnGYiWFM2uk?si=Me1gxTBmI-YouP3H"
                        title="Getting Started with Kestra in 5 minutes"
                        allowfullscreen
                    />
                </div>

                <div class="buttons">
                    <a href="/demo" class="btn btn-secondary mb-2" target="_blank"> Talk to us </a>
                    <a href="/docs/quickstart#start-kestra" class="btn btn-primary ms-3 mb-2">
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

        .grid {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            background: url("~/assets/teams/gridbg.svg") center/cover no-repeat fixed;
            z-index: -4;
            pointer-events: none;
        }

        .gradient {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            background: url("/landing/overview/sm-platform-hero.png") right/cover no-repeat;
            z-index: -3;

            @include media-breakpoint-up(md) {
                background-image:
                    url("/landing/overview/overview-top.png"), url("/landing/overview/mix.svg");
                background-position:
                    35% 0%,
                    top right;
                background-size:
                    0,
                    cover contain;
            }

            @include media-breakpoint-up(lg) {
                background-size:
                    35% auto,
                    cover;
            }

            @media (max-width: 768px) {
                mix-blend-mode: screen;
            }
        }

        .hero {
            @include media-breakpoint-up(md) {
                padding: 6.2rem 0 2rem;
            }
            padding: 3.5rem 0;
            position: relative;
        }

        .text-block {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
            gap: 10px;

            @media screen and (min-width: 768px) {
                gap: 1rem;
            }

            padding: 0 20px;

            .highlight {
                font-weight: 600;
                font-size: 1.15rem;
                line-height: 1.75rem;
                background: linear-gradient(94.69deg, #51cff7 57.35%, #4782f5 95.94%);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
                margin-bottom: 0;

                @include media-breakpoint-up(md) {
                    background: linear-gradient(89.75deg, #9f79f3 0.22%, #658af9 99.78%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: transparent;
                }
            }
        }

        h1 {
            color: white;
            text-align: center;
            max-width: 100%;
            font-weight: 600;
            padding: 0;
            margin: 0;
            font-size: 35px;

            @include media-breakpoint-up(md) {
                font-size: 4rem;
                max-width: 800px;
            }
        }

        p {
            max-width: fit-content;
            font-weight: 400;
            font-size: 1rem;
            line-height: 1.5rem;
            text-align: center;
            color: $black-1;
            white-space: normal;
            margin-bottom: 0;
        }

        .buttons {
            text-align: center;
            white-space: nowrap;

            .btn {
                border-radius: 8px;
            }
        }

        .video-responsive {
            position: relative;
            width: 100%;
            max-width: 774px;
            margin: 2rem 0;
            border-radius: 0.5rem;
            background: linear-gradient(
                179.38deg,
                rgba(0, 0, 0, 0.7) 0.54%,
                rgba(0, 0, 0, 0) 22.93%
            );
            box-shadow:
                0 2px 4px rgba(94, 32, 188, 0.98),
                0 7px 7px rgba(94, 32, 188, 0.85),
                0 17px 10px rgba(94, 32, 188, 0.5),
                0 30px 12px rgba(94, 32, 188, 0.15),
                0 46px 13px rgba(94, 32, 188, 0.02);

            iframe {
                width: 100%;
                aspect-ratio: 16 / 9;
                border: none;
                border-radius: 0.5rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                display: block;
            }
        }
    }
</style>