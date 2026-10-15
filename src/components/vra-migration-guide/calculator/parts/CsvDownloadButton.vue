<template>
    <div class="csv-download">
        <button
            type="button"
            class="link-button"
            :disabled="disabled || blocked"
            @click="download"
        >
            Download CSV
        </button>
        <span class="status" role="status">{{
            blocked ? BLOCKED_STATUS : status
        }}</span>
    </div>
</template>

<script setup lang="ts">
    import { refAutoReset } from "@vueuse/core"
    import { downloadTextFile } from "../browser"

    const props = defineProps<{
        getFile: () => { filename: string; content: string }
        disabled?: boolean
        blocked?: boolean
    }>()

    const BLOCKED_STATUS = "Fix the inputs to download the CSV."

    const status = refAutoReset("", 4000)

    function download() {
        const { filename, content } = props.getFile()
        const ok = downloadTextFile(
            filename,
            content,
            "text/csv;charset=utf-8;",
        )
        status.value = ok
            ? "CSV downloaded."
            : "Download blocked by the browser."
    }
</script>

<style scoped lang="scss">
    @use "/src/components/vra-migration-guide/shared" as *;
    .csv-download {
        display: flex;
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
</style>
