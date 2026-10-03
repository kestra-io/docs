// The gated PDF of the full guide. Every "Download the PDF" button opens the
// dialog in DownloadDialog.astro through the global `data-modal-target`
// handler (src/scripts/modal.ts).
export const DOWNLOAD_DIALOG_ID = "guide-download"
export const DOWNLOAD_DIALOG_TARGET = `#${DOWNLOAD_DIALOG_ID}`

export const GUIDE_DOWNLOAD = {
    hubspotFormId: "3b11593b-4c99-4ad4-960d-1297e5087478",
    guideUrl: "/vra-migration-guide.pdf",
    submissionIdentifier: "vRA Migration Guide",
    pageUri: "resources/migration/vra",
    event: "vra_migration_guide_download",
}
