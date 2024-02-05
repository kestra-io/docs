<template>
    <div v-if="widget" class="widget-chat">
        <NuxtLink href="https://kestra.io/slack" target="_blank" class="btn btn-sm btn-primary rounded">
            <slack title=""/>
            Slack <span v-if="online" class="online">{{ onlineText }} members</span>
        </NuxtLink>
    </div>
    <div v-else class="container">
        <Section
            subtitle="Orchestrate Success"
            subtitle-after="Together"
            baseline="Join the slack to share ideas and best practices, get help with technical questions, and discuss Kestra with other developers."
        >
            <div class="row card-group no-shadow mb-2">
                <div class="col-md-4 mb-4">
                    <Card
                        :icon="TooltipQuestion"
                        title="Ask a question"
                        description="Get stuck with the documentation? We're here to help!"
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="HandWave"
                        title="Introduce yourself"
                        description="Welcome to the Kestra community! Let's introduce ourselves!"
                    />
                </div>

                <div class="col-md-4 mb-4">
                    <Card
                        :icon="MessageAlert"
                        title="Share Feedback"
                        description="Discussions about the product, including your feedback, ideas, and dreams."
                    />
                </div>
            </div>
            <div class="text-center ">
                <a href="https://kestra.io/slack" class="btn btn-animated btn-purple-animated me-2" target="_blank"  data-aos="zoom-in">
                    Join our slack
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
import { kestraInstance } from "~/utils/api.js";

export default {
    components: {Slack, Section, Card},
    props: {
        widget: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            online: undefined,
        }
    },
    async mounted() {
        try {
            const memberCount = window.sessionStorage.getItem("slack_member_count")

            if (!memberCount) {
                const { data: { total } } = await kestraInstance.get('/communities/slack')
                window.sessionStorage.setItem("slack_member_count", total)
                this.online = total
            } else {
                this.online = memberCount
            }

        } catch (e) {
            this.online = 0
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

    span.online {
        font-weight: normal;
        font-size: $font-size-xs;
    }
</style>