<template>
    <div class="helpful text-center mt-5">
        <p class="mb-0">Was this page helpful?</p>
        <div class="mt-2" v-if="!showThankYou">
            <div class="d-flex justify-content-center align-items-center gap-3">
                <button class="btn btn-dark me-3" @click="ratePage(true)">
                    <ThumbUpOutline />
                    Yes
                </button>
                <button class="btn btn-dark" @click="ratePage(false)">
                    <ThumbDownOutline />
                    No
                </button>
                <div class="comment-input-container">
                    <input 
                        v-model="comment" 
                        type="text" 
                        class="form-control comment-input" 
                        placeholder="Optional comment..."
                        @keyup.enter="ratePageWithComment"
                    />
                    <button 
                        v-if="comment.trim()" 
                        class="btn btn-sm btn-outline-secondary ms-2" 
                        @click="ratePageWithComment"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
        <div v-else>
            <span class="text-white">Thank you!</span>
        </div>
    </div>
</template>

<script setup>
    import ThumbUpOutline from "vue-material-design-icons/ThumbUpOutline.vue";
    import ThumbDownOutline from "vue-material-design-icons/ThumbDownOutline.vue";
</script>

<script>
    import posthog from 'posthog-js'

    export default {
        data() {
            return {
                showThankYou: false,
                comment: '',
                lastRating: null
            }
        },
        methods: {
            ratePage(isHelpful) {
                this.lastRating = isHelpful;
                if (this.comment.trim()) {
                    this.ratePageWithComment();
                } else {
                    this.sendFeedback(isHelpful, '');
                }
            },
            ratePageWithComment() {
                if (this.lastRating !== null) {
                    this.sendFeedback(this.lastRating, this.comment.trim());
                }
            },
            sendFeedback(isHelpful, comment) {
                const eventData = {
                    "positive": isHelpful
                };
                
                if (comment) {
                    eventData.comment = comment;
                }
                
                const result = posthog.capture('helpful', eventData);
                if (result) {
                    this.showThankYou = true;
                    this.comment = '';
                    this.lastRating = null;
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .helpful {
        padding: calc($spacer/2) calc($spacer);

        p {
            font-weight: bold;
        }
        
        .comment-input-container {
            display: flex;
            align-items: center;
            max-width: 300px;
        }
        
        .comment-input {
            min-width: 200px;
            font-size: 0.9rem;
        }
    }
</style>