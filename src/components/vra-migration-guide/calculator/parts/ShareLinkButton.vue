<template>
    <div class="share-link">
        <button
            type="button"
            class="btn btn-sm btn-secondary"
            :disabled="disabled"
            @click="share"
        >
            Copy a link with these numbers
        </button>
        <span class="status" role="status">{{ status }}</span>
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
    import { refAutoReset, useClipboard } from "@vueuse/core"
    import { nextTick, ref, useTemplateRef } from "vue"

    const props = defineProps<{
        getUrl: () => string | null
        disabled?: boolean
    }>()

    const { copy, isSupported } = useClipboard()
    const status = refAutoReset("", 4000)
    const fallbackUrl = ref("")
    const fallback = useTemplateRef<HTMLInputElement>("fallback")

    async function share() {
        const url = props.getUrl()
        if (!url) return
        if (isSupported.value) {
            await copy(url)
            fallbackUrl.value = ""
            status.value = "Link copied."
            return
        }
        fallbackUrl.value = url
        status.value = "Copy the link below."
        await nextTick()
        fallback.value?.select()
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

    .status {
        @include calc-status;
    }

    .link-box {
        @include calc-form-field;
        width: 100%;
        font-size: $font-size-xs;
    }
</style>
