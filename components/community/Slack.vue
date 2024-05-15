<template>
    <div v-if="widget" class="widget-chat">
        <NuxtLink href="https://kestra.io/slack" target="_blank" class="btn btn-sm btn-primary rounded">
            <slack title=""/>
            Slack <ClientOnly><span v-if="online" class="online">{{ onlineText }} members</span></ClientOnly>
        </NuxtLink>
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
                        description="Got stuck? The #help channel is here to support you."
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
                <a href="https://kestra.io/slack" class="btn btn-animated btn-purple-animated me-2" target="_blank"  data-aos="zoom-in">
                    Join our Slack
                </a>
            </div>
        </Section>
    </div>
</template>

<script setup>
    import TooltipQuestion from "vue-material-design-icons/TooltipQuestion.vue";
    import HandWave from "vue-material-design-icons/HandWave.vue";
    import MessageAlert from "vue-material-design-icons/MessageAlert.vue";
</script>

<script>
import Section from '../../components/layout/Section.vue';
import Card from '../card/Card.vue';
import Slack from "vue-material-design-icons/Slack.vue";
import {useApi} from "~/composables/useApi.js";

export default {
    components: {Slack, Section, Card},
    setup() {
        return {useApi}
    },
    props: {
        widget: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            online: 0,
        }
    },
    async mounted() {
        if (process.client) {
            try {
                const memberCount = window.sessionStorage.getItem("slack_member_count")

                if (!memberCount) {
                    const {data: {total}} = await useApi().get('/communities/slack')
                    window.sessionStorage.setItem("slack_member_count", total)
                    this.online = total
                } else {
                    this.online = memberCount
                }

            } catch (e) {
            }
        }
    },

    computed: {
        onlineText() {
            return this.online === undefined ? "" : Intl.NumberFormat('en-US').format(this.online);
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

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