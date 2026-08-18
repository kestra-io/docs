<template>
    <span v-if="stargazersText">{{ stargazersText }}</span>
    <span v-else class="placeholder" style="width: 39px"></span>
</template>

<script setup lang="ts">
    import { $fetch } from "~/utils/fetch"
    import { ref, onMounted } from "vue"

    const emit = defineEmits(["apiError"])
    const props = defineProps<{ initial?: string }>()

    // Starts from the build-time value so there is no placeholder flash, and no
    // empty slot for a crawler to read.
    const stargazersText = ref<string | undefined>(props.initial)

    onMounted(async () => {
        try {
            const response = await $fetch<{ stargazers: number }>("/api/github")
            stargazersText.value = Intl.NumberFormat("en-US").format(
                response.stargazers,
            )
        } catch (error) {
            // With a build-time value already on screen, a failed refresh is not
            // worth hiding the button for.
            if (!props.initial) emit("apiError")
        }
    })
</script>
