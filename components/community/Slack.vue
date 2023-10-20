<template>
    <div v-if="widget" class="widget-chat">
        <NuxtLink href="https://kestra.io/slack" target="_blank" class="btn btn-sm btn-primary rounded">
            <slack title=""/>
            Slack <span v-if="online" class="online">{{ onlineText }} members</span>
        </NuxtLink>
    </div>
    <div v-else class="container">
        <Section
            class="with-shadow"
            title="Slack community"
            subtitle="Orchestrate Success Together"
            baseline="Join the slack to share ideas and best practices, get help with technical questions, and discuss Kestra with other developers (and even the founders)."
        >
            <div class="row card-group card-centered no-shadow mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="fade-left">
                        <div class="card-body">
                                <span class="card-icon">
                                    <TooltipQuestion />
                                </span>
                            <h4 class="card-title">Ask a question</h4>
                            <p class="card-text">Get stuck with the documentation? We're here to help!</p>
                            <p class="channel">#help</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card" data-aos="fade-right">
                        <div class="card-body">
                                <span class="card-icon">
                                    <HandWave />
                                </span>
                            <h4 class="card-title">Introduce yourself</h4>
                            <p class="card-text">Welcome to the Kestra community! Let's introduce ourselves!</p>
                            <p class="channel">#introductions</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card"  data-aos="fade-left">
                        <div class="card-body">
                                <span class="card-icon">
                                    <MessageAlert />
                                </span>
                            <h4 class="card-title">Share Feedback</h4>
                            <p class="card-text">Discussions about the product, including your feedback, ideas, and dreams.</p>
                            <p class="channel">#feedback-and-requests</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center ">
                <a href="https://kestra.io/slack" class="btn btn-primary me-2" target="_blank"  data-aos="zoom-in">
                    Join our slack
                </a>
            </div>
        </Section>
    </div>
</template>

<script>
import Section from '~/components/layout/Section.vue';
import TooltipQuestion from "vue-material-design-icons/TooltipQuestion.vue";
import HandWave from "vue-material-design-icons/HandWave.vue";
import MessageAlert from "vue-material-design-icons/MessageAlert.vue";
import Slack from "vue-material-design-icons/Slack.vue";
import { kestraInstance } from "~/utils/api.js";

export default {
    components: {Slack, Section, TooltipQuestion, HandWave, MessageAlert},
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


span.online {
    font-weight: normal;
    font-size: $font-size-xs;
}
</style>