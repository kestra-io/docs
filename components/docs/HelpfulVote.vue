<template>
    <div class="helpful text-center mt-5">
        <p class="mb-0">Was this page helpful?</p>
        <div class="mt-2" v-if="!showThankYou">
            <button class="btn btn-dark me-3" @click="ratePage(true)">
                <ThumbUpOutline />
                Yes
            </button>
            <button class="btn btn-dark" @click="ratePage(false)">
                <ThumbDownOutline />
                No
            </button>
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
        methods: {
            ratePage(isHelpful) {
              const result = posthog.capture('helpful', {"positive": isHelpful});
              if (result) {
                this.showThankYou = true;
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
    }
</style>