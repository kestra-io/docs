<template>
    <div v-if="widget" class="widget-chat">
        <a
            v-if="mounted"
            href="https://kestra.io/slack"
            target="_blank"
            class="btn btn-sm btn-primary rounded"
        >
            <Slack title="" />
            Slack
            <span v-if="online" class="online">{{ onlineText }} members</span>
        </a>
    </div>
    <div v-else class="container">
        <Section
            subtitle="Orchestrate Success"
            subtitle-after="Together"
            baseline="Join our Slack Community to share ideas and best practices, get help with technical questions, and discuss with other developers."
        >
            <div class="row card-group no-shadow mb-2">
                <div class="col-md-4 mb-4">
                    <Card
                        :icon="TooltipQuestion"
                        title="Ask a question"
                        description="Stuck? The #help channel is here to support you."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="HandWave"
                        title="Say Hi"
                        description="New to the community? Tell us about yourself and how you're using Kestra in the #introductions channel."
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="MessageAlert"
                        title="Share Feedback"
                        description="Something you'd like to see improved? The #feedback-and-requests channel is a great place to share your thoughts."
                    />
                </div>
            </div>
            <div class="text-center">
                <a
                    v-if="mounted"
                    href="https://kestra.io/slack"
                    class="btn btn-animated btn-purple-animated me-2"
                    target="_blank"
                    data-usal="zoomin"
                >
                    Join our Slack
                </a>
            </div>
        </Section>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, onMounted } from "vue"
    import TooltipQuestion from "vue-material-design-icons/TooltipQuestion.vue"
    import HandWave from "vue-material-design-icons/HandWave.vue"
    import MessageAlert from "vue-material-design-icons/MessageAlert.vue"
    import Section from "~/components/layout/Section.vue"
    import Card from "~/components/card/Card.vue"
    import Slack from "vue-material-design-icons/Slack.vue"

    const props = defineProps<{ widget?: boolean; online?: number }>()

    const mounted = ref(false)

    onMounted(() => {
        mounted.value = true
    })

    const onlineText = computed(() => {
        return props.online === undefined ? "" : Intl.NumberFormat("en-US").format(props.online)
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    :deep(section) {
        .baseline {
            font-size: $h6-font-size !important;
        }
    }

    .container {
        border-bottom: $block-border;
    }

    .widget-chat {
        a {
            background-color: $primary-1;
            border-color: $primary-1;
        }
    }

    span.online {
        font-weight: normal;
        font-size: $font-size-xs;
    }
</style>