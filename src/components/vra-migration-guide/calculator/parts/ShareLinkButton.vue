<template>
    <div class="share-link">
        <button
            ref="button"
            type="button"
            class="link-button"
            :disabled="disabled"
            @click="share"
        >
            Copy link with these numbers
        </button>
        <span class="status" aria-hidden="true">{{ status }}</span>
        <input
            v-if="fallbackUrl"
            ref="fallback"
            class="form-control link-box"
            type="text"
            readonly
            :value="fallbackUrl"
            aria-label="Shareable link"
            @focus="($event.target as HTMLInputElement).select()"
        />
    </div>
</template>

<script setup lang="ts">
    import { refAutoReset } from "@vueuse/core"
    import { nextTick, ref, useTemplateRef } from "vue"
    import { copyWithFeedback } from "~/utils/code-copy"

    const props = defineProps<{
        getUrl: () => string | null
        disabled?: boolean
    }>()

    const status = refAutoReset("", 4000)
    const fallbackUrl = ref("")
    const fallback = useTemplateRef<HTMLInputElement>("fallback")
    const button = useTemplateRef<HTMLButtonElement>("button")

    async function share() {
        const url = props.getUrl()
        if (!url) return
        if (
            button.value &&
            (await copyWithFeedback(button.value, url, "Link copied."))
        ) {
            fallbackUrl.value = ""
            status.value = "Link copied."
            return
        }
        fallbackUrl.value = url
        status.value = "Copy the link below."
        await nextTick()
        fallback.value?.focus()
    }
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .share-link {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
    }

    .link-button {
        @include calc-link-button;
        @include guide-focus-ring;
    }

    .status {
        @include calc-status;
    }

    .link-box {
        @include calc-form-field;
        width: 100%;
        font-size: $font-size-xs;
    }
</style>
