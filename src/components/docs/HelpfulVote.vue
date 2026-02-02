<template>
    <div class="helpful text-center mt-5">
        <p class="mb-0">Was this page helpful?</p>
        <div class="mt-2">
            <div class="d-flex justify-content-center align-items-center gap-3 thumb">
                <button class="btn btn-dark me-3" @click="openModal(true)">
                    <ThumbUpOutline />
                    Yes
                </button>
                <button class="btn btn-dark" @click="openModal(false)">
                    <ThumbDownOutline />
                    No
                </button>
            </div>
        </div>

        <div v-if="showThankYou" class="thank-you text-center mt-3">
            <p>Thank you for your feedback! 👍</p>
        </div>

        <div
            ref="modalRef"
            class="modal fade"
            id="feedbackModal"
            tabindex="-1"
            aria-labelledby="feedbackModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="feedbackModalLabel">Send Feedback</h5>
                        <Close @click="closeModal" />
                    </div>
                    <div class="modal-body">
                        <div v-if="!isSubmitted">
                            <div class="feedback-message mb-4">
                                <div class="feedback-icon mt-3">
                                    <p v-if="currentRating" class="icon">🎉</p>
                                    <p v-else class="icon">😔</p>
                                </div>
                                <p class="feedback-text">{{ feedbackText }}</p>
                            </div>
                            <div class="mb-3">
                                <label for="commentTextarea" class="form-label comment-label">
                                    Share your thoughts (Optional)
                                </label>
                                <textarea
                                    class="form-control"
                                    id="commentTextarea"
                                    rows="2"
                                    v-model="comment"
                                    aria-describedby="commentHelp"
                                ></textarea>
                            </div>
                        </div>
                        <div v-else class="submitted-state text-center py-4">
                            <h5 class="mb-2">
                                Thanks for your feedback, we really appreciate it. 🙏
                            </h5>
                        </div>
                    </div>
                    <div class="modal-footer" v-if="!isSubmitted">
                        <button type="button" class="btn btn-sm btn-secondary" @click="closeModal">
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-sm btn-primary"
                            @click="submitFeedback"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue"
    import posthog from "posthog-js"
    import Close from "vue-material-design-icons/Close.vue"
    import ThumbUpOutline from "vue-material-design-icons/ThumbUpOutline.vue"
    import ThumbDownOutline from "vue-material-design-icons/ThumbDownOutline.vue"

    const comment = ref("")
    const modalRef = ref(null)
    const feedbackText = ref("")
    const isSubmitted = ref(false)
    const showThankYou = ref(false)
    const currentRating = ref(null)

    let bootstrapModal = null

    onMounted(() => {
        if (modalRef.value && window.$bootstrap?.Modal) {
            bootstrapModal = new window.$bootstrap.Modal(modalRef.value)
            modalRef.value.addEventListener("hidden.bs.modal", () => {
                comment.value = ""
                currentRating.value = null
                isSubmitted.value = false
            })
        }
    })

    const openModal = (isHelpful) => {
        currentRating.value = isHelpful
        feedbackText.value = isHelpful
            ? "Great! We're glad this was helpful."
            : "Sorry to hear that. How can we improve?"
        comment.value = ""
        isSubmitted.value = false
        showThankYou.value = false
        posthog.capture("helpful", { positive: currentRating.value })
        bootstrapModal?.show()
    }

    const closeModal = () => {
        bootstrapModal?.hide()
        showThankYou.value = true
        setTimeout(() => {
            showThankYou.value = false
        }, 2000)
    }

    const submitFeedback = () => {
        if (currentRating.value === null) return

        if (comment.value.trim()) {
            posthog.capture("helpful", {
                positive: currentRating.value,
                comment: comment.value.trim(),
            })
        }

        isSubmitted.value = true
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .helpful {
        padding: calc($spacer / 2) $spacer;

        p {
            font-weight: bold;
        }

        .thumb {
            :deep(svg) {
                color: $purple-3;
                position: absolute;
                bottom: -0.15rem;
            }
        }
    }

    .modal-content {
        background-color: var(--ks-background-box);
        border: 1px solid var(--ks-dialog-border);
        color: var(--ks-content-primary);

        .modal-header {
            padding: 10px 16px;
            border-bottom: 1px solid var(--ks-border-secondary);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .modal-footer {
            border-top: none;
        }
    }

    .feedback-text {
        margin-bottom: 1rem;
        color: var(--ks-content-primary);
        font-size: 1rem;
    }

    .feedback-message {
        text-align: center;

        .feedback-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2.5rem;

            .icon {
                font-size: 2.5rem;
            }
        }

        .feedback-text {
            font-size: 1.1rem;
            font-weight: 500;
            line-height: 1.4;
        }
    }

    .submitted-state h5 {
        color: #21ce9c;
        font-weight: 600;
    }

    .thank-you {
        p {
            color: #21ce9c;
            font-weight: 600;
        }
    }

    .form-control {
        background-color: var(--ks-background-body);
        border: 1px solid var(--ks-border-primary);
        color: var(--ks-content-primary);

        &::placeholder {
            color: var(--ks-content-tertiary);
        }
    }

    .comment-label {
        text-align: left;
        display: block;
        color: var(--ks-content-secondary);
    }

    .close-icon {
        font-size: 1.5rem;
        color: var(--ks-dialog-headerbtn);

        &:hover {
            color: var(--ks-dialog-headerbtn-hover);
        }
    }
</style>