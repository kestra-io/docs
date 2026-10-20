<template>
    <div class="action">
        <button
            type="button"
            class="link-button"
            :disabled="!ready || hasErrors"
            @click="download"
        >
            Download CSV
        </button>
        <span class="status" role="status">{{
            hasErrors ? "Fix the inputs to download the CSV." : csvStatus
        }}</span>
    </div>
    <div class="action share">
        <button
            ref="shareButton"
            type="button"
            class="link-button"
            :disabled="!ready"
            @click="share"
        >
            Copy link with these numbers
        </button>
        <span class="status" aria-hidden="true">{{ shareStatus }}</span>
        <input
            v-if="fallbackUrl"
            ref="fallback"
            class="form-control link-box"
            type="text"
            readonly
            :value="fallbackUrl"
            aria-label="Shareable link"
            @focus="fallback?.select()"
        />
    </div>
</template>

<script setup lang="ts">
    import { computed, nextTick, ref, useTemplateRef } from "vue"
    import { refAutoReset } from "@vueuse/core"
    import { CSV_FILENAME, buildCsvFile } from "~/utils/vra-calculator"
    import { copyWithFeedback } from "~/utils/code-copy"
    import { useCalculator } from "../calculatorStore"

    const { shareAnchor } = defineProps<{ shareAnchor: string }>()

    const { inputs, result, ready, shareUrl } = useCalculator()

    const hasErrors = computed(() => result.value.errors.length > 0)
    const csvStatus = refAutoReset("", 4000)
    const shareStatus = refAutoReset("", 4000)
    const fallbackUrl = ref("")
    const fallback = useTemplateRef<HTMLInputElement>("fallback")
    const shareButton = useTemplateRef<HTMLButtonElement>("shareButton")

    function download() {
        try {
            const csv = buildCsvFile(inputs.value, new Date())
            const href = URL.createObjectURL(
                new Blob([csv], { type: "text/csv;charset=utf-8;" }),
            )
            const link = document.createElement("a")
            Object.assign(link, { href, download: CSV_FILENAME })
            document.body.appendChild(link)
            link.click()
            link.remove()
            setTimeout(() => URL.revokeObjectURL(href), 1000)
            csvStatus.value = "CSV downloaded."
        } catch {
            csvStatus.value = "Download blocked by the browser."
        }
    }

    async function share() {
        const url = shareUrl(shareAnchor)
        if (await copyWithFeedback(shareButton.value!, url, "Link copied.")) {
            fallbackUrl.value = ""
            shareStatus.value = "Link copied."
            return
        }
        fallbackUrl.value = url
        shareStatus.value = "Copy the link below."
        await nextTick()
        fallback.value?.focus()
    }
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;

    .action {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &.share {
            flex-wrap: wrap;
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
            font-size: $font-size-xs;
        }
    }
</style>
