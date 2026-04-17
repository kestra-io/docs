<template>
    <span v-if="stargazersText">{{ stargazersText }}</span>
    <span v-else class="placeholder" style="width: 39px"></span>
</template>

<script setup lang="ts">
    import { $fetch } from "~/utils/fetch"
    import { ref, onMounted } from "vue"

    const emit = defineEmits(["apiError"])
    const stargazersText = ref<string | undefined>(undefined)

    onMounted(async () => {
        try {
            const response = await $fetch<{ stargazers: number }>("/api/github")
            stargazersText.value = Intl.NumberFormat("en-US").format(
                response.stargazers,
            )
        } catch (error) {
            emit("apiError")
        }
    })
</script>
