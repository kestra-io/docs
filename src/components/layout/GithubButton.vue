<template>
    <div v-if="!hasError" class="github-button-wrapper mb-1 me-sm-2">
        <a
            class="github-button"
            href="https://github.com/kestra-io/kestra"
            target="_blank"
        >
            <div class="left-part">
                <Github :size="16" />
                <span class="star-text">Star</span>
            </div>
            <div class="right-part">
                <LayoutGithubStargazer v-if="onClient" @api-error="hasError = true" />
                <span v-else class="placeholder"></span>
            </div>
        </a>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from "vue"
    import Github from "vue-material-design-icons/Github.vue"
    import LayoutGithubStargazer from "~/components/layout/GithubStargazer.client.vue"

    const hasError = ref(false)
    const onClient = ref(false)
    onMounted(() => {
        onClient.value = true
    })

    withDefaults(defineProps<{ small?: boolean }>(), { small: false })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .github-button-wrapper {
        display: inline-block;
        vertical-align: middle;
    }

    .github-button {
        display: flex;
        width: 115px;
        min-height: 28px;
        border-radius: 4px;
        overflow: hidden;
        text-decoration: none;
        color: #fff;
        font-size: $font-size-sm;
        font-weight: 600;
        .left-part {
            background: #333336;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            flex: 1;
            color: #fff !important;
            :deep(svg) {
                position: absolute;
                top: -0.05rem;
                bottom: 0;
            }
        }
        .right-part {
            background: #18181B;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 50%;
            color: #fff;
            .placeholder {
                width: 28px;
                height: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                animation: pulse 1.5s infinite;
            }
        }
    }

    @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 0.3; }
        100% { opacity: 0.6; }
    }
</style>