<template>
    <div class="csv-download">
        <button
            type="button"
            class="btn btn-sm btn-primary"
            :disabled="disabled"
            @click="download"
        >
            Download CSV
        </button>
        <span class="status" role="status">{{ status }}</span>
    </div>
</template>

<script setup lang="ts">
    import { downloadTextFile } from "../browser"
    import { useTransientStatus } from "./useTransientStatus"

    const props = defineProps<{
        /** Builds the file from the current state at click time */
        getFile: () => { filename: string; content: string }
        disabled?: boolean
    }>()

    const { status, show } = useTransientStatus()

    function download() {
        const { filename, content } = props.getFile()
        const ok = downloadTextFile(
            filename,
            content,
            "text/csv;charset=utf-8;",
        )
        show(ok ? "CSV downloaded." : "Download blocked by the browser.")
    }
</script>

<style scoped lang="scss">
    .csv-download {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .status {
        font-size: $font-size-sm;
        color: var(--ks-content-secondary);
    }
</style>
