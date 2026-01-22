<template>
    <div class="left">
        <div class="content">
            <div class="block" v-for="block in infos" :key="block.title">
                <p class="title">{{ block.title }}</p>
                <p class="sub">{{ block.value }}</p>
            </div>
            <div class="block">
                <p class="title mb-2">Data Stack</p>
                <div class="d-flex flex-column gap-2 justify-content-start">
                    <div class="card task">
                        <div class="body">
                            <div
                                class="icon-wrapper kestra-icon"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Kestra"
                            >
                                <img
                                    src="/landing/usecases/stories/monograme-kestra.svg"
                                    alt="Kestra"
                                />
                            </div>
                            <p class="card-title">Kestra</p>
                        </div>
                    </div>
                    <div class="card task" v-for="task in story.tasks" :key="task">
                        <div class="body">
                            <TaskIcon :cls="task" />
                            <p class="card-title">
                                {{ task.split(".").pop() ?? "" }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="block pt-2 w-100 d-flex justify-content-center">
                <a href="/demo" class="btn btn-gradient mx-auto"> Book a demo </a>
            </div>
        </div>
        <div class="socials">
            <a v-for="link in SOCIALS" :key="link.href" :href="link.href" target="_blank">
                <component :is="link.icon" />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"
    import Twitter from "~/components/icons/TwitterXIcon.vue"
    import Linkedin from "vue-material-design-icons/Linkedin.vue"
    import BlueSky from "~/components/icons/BlueSkyIcon.vue"

    const props = defineProps<{
        story: Story
        content: any
    }>()

    const infos = computed(() => [
        {
            title: "Industry",
            value: props.story.industry,
        },
        {
            title: "Headquarter",
            value: props.story.headquarter,
        },
        {
            title: "Solution",
            value: props.story.solution,
        },
    ])

    const SOCIALS = [
        {
            href: "https://twitter.com/kestra_io",
            icon: Twitter,
        },
        {
            href: "https://www.linkedin.com/company/kestra",
            icon: Linkedin,
        },
        {
            href: "https://web-cdn.bsky.app/profile/kestra.io",
            icon: BlueSky,
        },
    ]
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .left {
        @include media-breakpoint-up(lg) {
            min-width: 315px;
        }
        width: 100%;
        height: fit-content;
        position: static;
        margin-bottom: 3rem;

        @media (min-width: 992px) {
            position: sticky;
            top: 100px;
        }

        .content {
            border-radius: 0.5rem;
            border: 1px solid #d4d4d4;
            padding: 2rem;
            background: $white;

            .block {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
                width: 100%;
                margin-bottom: 1.3125rem;

                &:last-child {
                    margin-bottom: 0;
                }

                .title {
                    font-size: 0.875rem;
                    font-weight: 700;
                    color: $black-2;
                    margin: 0;
                }

                .sub {
                    font-size: 0.875rem;
                    font-weight: 400;
                    color: $white-5;
                    margin: 0;
                    line-height: 1.25rem;
                    text-wrap: balance;
                }

                .card {
                    border: none;
                    background-color: transparent;
                    box-shadow: none;
                    width: 100%;
                    padding: 0;

                    .body {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        padding: 0;
                        gap: 1rem;
                    }

                    .card-title {
                        font-size: 0.875rem;
                        font-weight: 500;
                        margin: 0;
                        color: $black-2;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 200px;
                    }

                    &.task {
                        background-color: transparent;

                        :deep(.icon-wrapper) {
                            width: 1.75rem;
                            height: 1.75rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .kestra-icon {
                            background: $black;
                            border-radius: 0.25rem;
                        }

                        img {
                            width: 1.75rem;
                            height: 1.75rem;
                            object-fit: contain;
                        }
                    }
                }

                .btn-gradient {
                    position: relative;
                    color: $white;
                    background:
                        linear-gradient(180deg, #694eff 0%, #5233ff 104.54%) padding-box,
                        linear-gradient(262.72deg, #ffffff 15.19%, #e8c8c8 37.92%, #838383 76.01%)
                            border-box;
                    border-radius: $border-radius-lg;
                    border: 1px solid transparent;
                    box-shadow:
                        0 0 0.625rem #dce0f980,
                        0 0 0.875rem #be62ff inset,
                        0.125rem 0.125rem 0.6875rem #0000001a;
                }
            }
        }

        .socials {
            margin-top: 0.25rem;
            align-self: flex-start;
            display: flex;
            gap: 0.625rem;

            a {
                color: $black-1;

                &:hover {
                    color: $purple-27;
                }
            }
        }
    }
</style>