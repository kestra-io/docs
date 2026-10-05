<template>
    <span v-if="stargazersText">{{ stargazersText }}</span>
    <span v-else class="placeholder" style="width: 39px"></span>
</template>

<script setup lang="ts">
    import { $fetchApiCached } from "~/utils/fetch"
    import { ref, onMounted } from "vue"

    const emit = defineEmits(["apiError"])
    const stargazersText = ref<string | undefined>(undefined)

    onMounted(async () => {
        try {
            const { stars } = await $fetchApiCached<{ stars?: number }>(
                "/communities/github/metrics",
            )
            // A zero count only ever means an upstream failure, so hide the badge.
            if (!stars) throw new Error("No stargazer count")
            stargazersText.value = Intl.NumberFormat("en-US").format(stars)
        } catch (error) {
            emit("apiError")
        }
    })
</script>
