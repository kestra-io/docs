<template>
    <div class="container">
        <Section
            title="Slack community"
            subtitle="Orchestrate Success Together"
        >
            <p>
                Join the slack to share ideas and best practices, get help with technical questions, and discuss Kestra with other developers (and even the founders).
            </p>

            <div class="row card-group card-centered mb-2">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <TooltipQuestion />
                                </span>
                            <h5 class="card-title">
                                Ask a question
                            </h5>
                            <p class="card-text">Get stuck with the documentation, We're here to help!</p>
                            <p class="channel">#help</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <HandWave />
                                </span>
                            <h5 class="card-title">Introduce yourself</h5>
                            <p class="card-text">Welcome to the Kestra community! Let's introduce ourselves!</p>
                            <p class="channel">#introductions</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <div class="card shadow-lg">
                        <div class="card-body">
                                <span class="card-icon">
                                    <MessageAlert />
                                </span>
                            <h5 class="card-title">Share Feedback</h5>
                            <p class="card-text">Discussions about the product, including your feedback, ideas, and dreams.</p>
                            <p class="channel">#feedback-and-requests</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center ">
                <a href="https://api.kestra.io/v1/communities/slack/redirect" class="btn btn-lg btn-primary me-2" target="_blank">
                    Join our slack
                </a>
            </div>
        </Section>
    </div>
</template>

<script>
    import Section from '../../components/layout/Section.vue';
    import TooltipQuestion from "vue-material-design-icons/TooltipQuestion.vue";
    import HandWave from "vue-material-design-icons/HandWave.vue";
    import MessageAlert from "vue-material-design-icons/MessageAlert.vue";
    export default {
        components: {Section, TooltipQuestion, HandWave, MessageAlert}
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .card-body {
        .channel {
            color: $purple-14;
        }
    }
</style>