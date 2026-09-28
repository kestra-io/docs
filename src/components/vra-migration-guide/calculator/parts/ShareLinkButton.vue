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
    import { nextTick, ref, useTemplateRef } from "vue"
    import { copyText } from "../browser"
    import { useTransientStatus } from "./useTransientStatus"

    const props = defineProps<{
        /** Builds the link to the current state; null before hydrate */
        getUrl: () => string | null
        disabled?: boolean
    }>()

    const { status, show } = useTransientStatus()
    const fallbackUrl = ref("")
    const fallback = useTemplateRef<HTMLInputElement>("fallback")

    async function share() {
        const url = props.getUrl()
        if (!url) return
        if (await copyText(url)) {
            fallbackUrl.value = ""
            show("Link copied.")
            return
        }
        // Clipboard refused: show the link to copy by hand, as the reference does.
        fallbackUrl.value = url
        show("Copy the link below.")
        await nextTick()
        fallback.value?.select()
    }
</script>

<style scoped lang="scss">
    .share-link {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
    }

    .status {
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);
    }

    .link-box {
        --ks-form-bg: var(--ks-background-input, var(--ks-background-body));
        --ks-form-color: var(--ks-content-primary);
        --ks-form-border-color: var(--ks-border-primary);
        width: 100%;
        font-size: $font-size-xs;
    }
</style>
