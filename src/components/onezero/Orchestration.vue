<template>
    <section class="feature-bg">
        <div class="container">
            <p class="title-block" data-usal="fade-u">
                Why Use
                <span class="gradient"> Declarative Orchestration </span>
                For AI Agents
            </p>

            <div class="features" data-usal="fade-u delay-50">
                <div
                    v-for="(feature, index) in features"
                    :key="feature.title"
                    class="feature"
                    :data-usal="`zoomin delay-${100 + index * 50}`"
                >
                    <NuxtImg :src="feature.image" :alt="feature.title" class="feature-image" />
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.description }}</p>
                </div>
            </div>

            <div class="achievement" data-usal="fade-u delay-250">
                <img
                    src="/landing/onezero/quote.svg"
                    alt="Pioneered"
                    data-usal="zoomin delay-300"
                />
                <h3 data-usal="fade-u delay-350">
                    We pioneered declarative orchestration. With 1.0, AI elevates that paradigm;
                    teams express intent in natural language while maintaining full governance.
                </h3>
                <div class="profile" data-usal="fade-u delay-400">
                    <NuxtImg
                        v-bind="EDarrasImg"
                        alt="Edarras"
                        class="profile-img"
                    />
                    <div class="profile-text">
                        <h6 class="profile-name">Emmanuel Darras</h6>
                        <p class="profile-title">CEO & Co-Founder</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import EDarrasImg from "~/assets/teams/edarras-sm.png"
    const features = [
        {
            title: "Define Goals, Not Tasks",
            description:
                "Describe the desired outcome and constraints; let agents handle the execution details.",
            image: "/landing/onezero/goals.png",
        },
        {
            title: "Autonomous by Design",
            description:
                "Agents can choose the next best action dynamically, while the declarative model ensures repeatable version-controlled code.",
            image: "/landing/onezero/autonomous.png",
        },
        {
            title: "Governed And Auditable",
            description:
                "Every decision is logged and observable, so you keep oversight without limiting your iteration speed.",
            image: "/landing/onezero/governed.png",
        },
    ]
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .feature-bg {
        background-color: #ffffff;

        .container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            flex-direction: column;
            text-align: center;
            position: relative;
            padding: 4rem 1.25rem;

            .title-block {
                width: 100%;
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 0;

                @include media-breakpoint-down(md) {
                    font-size: 1.5rem;
                }

                .gradient {
                    background: linear-gradient(90deg, #8c4bff 0%, #658af9 100%);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .features {
                display: grid;
                margin-top: 2rem;
                background-color: #f7f7f8;
                border-radius: 1rem;
                border: 1px solid $white-1;

                @include media-breakpoint-up(xl) {
                    grid-template-columns: repeat(3, minmax(350px, 1fr));
                    padding: 2rem 0;
                }

                .feature {
                    padding: 2rem;
                    border-bottom: 1px solid $white-1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;

                    @include media-breakpoint-up(xl) {
                        padding: 1rem 2rem 0;
                        border: none;
                        border-right: 1px solid $white-1;
                    }

                    &:last-child {
                        border: none;
                    }

                    &-image {
                        width: 90px;
                        height: 90px;
                        object-fit: contain;
                        margin-bottom: 1.2rem;
                    }

                    h3 {
                        white-space: nowrap;
                        font-size: 20px;
                        font-weight: 600;
                        color: $black-1;
                    }

                    p {
                        font-size: 14px;
                        font-weight: 400;
                        color: $black-9;
                    }
                }
            }

            .achievement {
                max-width: 764px;
                text-align: left;
                padding: 2rem 0;

                h3 {
                    font-size: 39px;
                    font-weight: 600;
                    color: $black-9;
                    margin: 2.5rem 0;
                    line-height: 132%;
                    text-wrap: balance;
                    white-space: pre-line;
                }

                .profile {
                    display: flex;
                    gap: 20px;

                    &-img {
                        width: 50px;
                        height: 50px;
                        flex-shrink: 0;
                        border-radius: 5rem;
                    }

                    &-text {
                        &-name {
                            font-weight: 700;
                            color: $black-2;
                            font-size: $font-size-md;
                            line-height: 1.2;
                            margin-bottom: 0.25rem;
                        }

                        &-title {
                            color: $black-10;
                            font-size: $font-size-xs;
                            line-height: 20px;
                            margin: 0;
                        }
                    }
                }
            }

            @media (max-width: 768px) {
                [data-usal] {
                    transform: none !important;
                    transition: none !important;
                    opacity: 1 !important;
                }
            }
        }
    }
</style>