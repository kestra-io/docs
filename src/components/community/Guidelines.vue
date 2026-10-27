<template>
    <section class="guidelines">
        <div class="container">
            <div class="header">
                <div>
                    <h2 data-usal="fade-r">Community Guidelines</h2>
                    <p data-usal="fade-l">The Kestra community is a friendly and welcoming place for everyone.</p>
                </div>
                <div class="actions">
                    <a href="/slack" class="btn btn-primary">
                        Join our Slack <ArrowRight />
                    </a>
                    <a href="https://www.reddit.com/r/kestra_io/" target="_blank" rel="noopener" class="btn btn-secondary">
                        Join our Reddit
                    </a>
                </div>
            </div>

            <div class="guide-list">
                <div
                    v-for="(item, index) in FAQ_ITEMS"
                    :key="index"
                    class="guide-item"
                    :class="{ active: activeIndex === index }"
                >
                    <div class="guide-header" @click="toggle(index)">
                        <h3 data-usal="fade-r">{{ item.title }}</h3>
                        <span class="icon">
                            <Plus v-if="activeIndex !== index" />
                            <Minus v-else />
                        </span>
                    </div>
                    <div class="wrapper">
                        <div class="content" v-html="item.content" />
                    </div>
                </div>
            </div>
            <p>
                If you have any questions, don't hesitate to ask us on
                <a href="https://kestra.io/slack" target="_blank">Slack <OpenInNew /></a>
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import Plus from "vue-material-design-icons/Plus.vue";
    import Minus from "vue-material-design-icons/Minus.vue";
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue";
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue";

    const FAQ_ITEMS = [
        {
            title: "Be respectful to the Kestra community",
            content: "Be respectful towards other members of this Slack Community. Do not harass others. <br/> Assume positive intent.",
        },
        {
            title: "Make it easy to help you",
            content: `<ul>
                <li>Please share relevant flows (YAML), logs and stack traces <a target='_blank' href='https://slack.com/intl/en-gb/help/articles/202288908-Format-your-messages'>formatted</a> in code blocks (no screenshots, please).</li>
                <li>Please share how you have deployed Kestra:
                    <ol type='a'>
                        <li>Deployment choices (Standalone, Docker, Kubernetes, etc.).</li>
                        <li>The version of Kestra.</li>
                        <li>Your OS and its version.</li>
                    </ol>
                </li>
            </ul>`
        },
        {
            title: "Use relevant channels",
            content: "Refrain from asking questions multiple times across different channels.",
        },
        {
            title: "Don't spam",
            content: "While we'll do our best to help you, there is no guaranteed timeline to answer your question. <br /> If you need support with SLA guarantees, <a href='https://kestra.io/demo' target='_blank'>reach out to us.</a>",
        }
    ];

    const activeIndex = ref<number | null>(0);

    const toggle = (index: number) => {
        activeIndex.value = activeIndex.value === index ? null : index;
    };
</script>

<style lang="scss" scoped>


    section.guidelines {
        padding-top: 120px;
        padding-bottom: 120px;
        margin: 0 auto;
        border-bottom: 1px solid var(--ks-border-primary);
        background: var(--ks-background-primary);

        .container {
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 2rem;

            @include media-breakpoint-down(lg) {
                flex-direction: column;
                align-items: flex-start;
            }

            h2 {
                margin-bottom: 0.5rem;
            }

            p {
                margin-bottom: 0;
            }

            .actions {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                flex-shrink: 0;
            }

            .btn {
                display: inline-flex;
                align-items: center;
                gap: 0.625rem;

                :deep(svg) {
                    width: 1rem;
                    height: 1rem;
                }
            }

            .btn-primary {
                color: var(--ks-content-primary-inverse, #fff);
            }

            .btn-secondary {
                color: var(--ks-content-primary);
            }
        }

        .guide-list {
            display: flex;
            flex-direction: column;

            .guide-item {
                background: var(--ks-background-purple-light);
                transition: background 0.3s ease;

                &.active {
                    background: var(--ks-background-purple-hover);

                    .guide-header {
                        padding-bottom: 0.75rem;
                    }

                    .wrapper {
                        max-height: 1000px;
                    }
                }

                .guide-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 2rem;
                    cursor: pointer;
                    transition: padding 0.3s ease;

                    h3 {
                        margin: 0;
                        color: var(--ks-content-primary);
                    }

                    .icon {
                        display: flex;
                        align-items: center;
                        color: var(--ks-content-primary);
                        font-weight: 700;
                        font-size: 1.5rem;
                    }
                }

                .wrapper {
                    max-height: 0;
                    transition: max-height 0.3s ease;
                    overflow: hidden;

                    .content {
                        padding: 0 2rem 2rem;

                        :deep(ul), :deep(ol) {
                            padding-left: 1.5rem;
                            margin-bottom: 0;
                        }

                        :deep(a) {
                            color: var(--ks-content-link);
                        }

                        p {
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }

        a {
            color: var(--ks-content-link);
        }

        > .container > p a {
            text-decoration: underline;
            text-underline-offset: 0.2em;
        }
    }
</style>
