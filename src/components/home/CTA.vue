<template>
    <section class="wrapper">
        <div class="container">
            <HomeCard class="side-box">
                <p class="pre-title">Ready to see it in action?</p>
                <h2>Jump in</h2>
                <p class="description">
                    Install Kestra Open-Source and get your first workflow ready in less than 5
                    minutes.
                </p>
                <a href="/docs/quickstart#start-kestra" class="btn btn-md btn-secondary"
                    >Get Started</a
                >
            </HomeCard>
            <HomeCard class="side-box side-box-purple">
                <NuxtImg v-bind="LogoCTA" alt="CTA" class="logo-cta" />
                <p class="pre-title">Schedule a meeting</p>
                <h2>Let's meet</h2>
                <p class="description">
                    Connect with our product specialists and discuss your project requirements.
                </p>
                <a href="/demo" class="btn btn-md btn-primary">Talk to us</a>
            </HomeCard>
        </div>
    </section>
</template>
<script setup lang="ts">
    import HomeCard from "~/components/home/Card.vue"
    import LogoCTA from "./assets/logo-cta.svg"
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .wrapper {
        background: linear-gradient(360deg, #15171e -3.16%, #1a1d26 93.17%);
        padding: 60px 0 16px;

        .container {
            @include media-breakpoint-up(lg) {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }

            margin: 2rem auto;
            color: white;

            .pre-title {
                font-size: 0.9rem;
                text-transform: uppercase;
                font-weight: 300;
            }

            .side-box {
                position: relative;
                z-index: 1;
                padding: 4rem 2rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                margin: 1.5rem 0;

                h2 {
                    font-size: 1.5rem;
                    font-weight: 500;
                    margin: 0.5rem 0;
                }

                .description {
                    font-size: 1rem;
                    margin-bottom: 2rem;
                }

                .pre-title {
                    font-family: "Source Code Pro", monospace;
                    margin-bottom: 0.5rem;
                }
            }

            .side-box-purple {
                border-color: #a950ff;

                .pre-title {
                    color: #cd88ff;
                }
            }

            .logo-cta {
                position: absolute;
                top: -20px;
                right: -70px;
                width: 250px;

                @include media-breakpoint-up(lg) {
                    top: -40px;
                    right: -80px;
                    width: 220px;
                }
            }
        }
    }
</style>