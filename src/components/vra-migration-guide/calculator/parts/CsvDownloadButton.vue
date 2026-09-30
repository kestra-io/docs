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
    import { refAutoReset } from "@vueuse/core"
    import { downloadTextFile } from "../browser"

    const props = defineProps<{
        /** Builds the file from the current state at click time */
        getFile: () => { filename: string; content: string }
        disabled?: boolean
    }>()

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

    .status {
        @include calc-status;
    }
</style>
