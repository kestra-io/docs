/** The gated PDF dialog, opened via `data-modal-target` (scripts/modal.ts). */
export const DOWNLOAD_DIALOG_ID = "guide-download"
export const DOWNLOAD_DIALOG_TARGET = `#${DOWNLOAD_DIALOG_ID}`

export const GUIDE_DOWNLOAD = {
    hubspotFormId: "3b11593b-4c99-4ad4-960d-1297e5087478",
    guideUrl: "/vra-migration-guide.pdf",
    submissionIdentifier: "vRA Migration Guide",
    pageUri: "resources/migration/vra",
    event: "vra_migration_guide_download",
}

/**
 * The Migration Assistant's help request: the same dialog and form, without the
 * download. Its HubSpot form is not created yet.
 */
export const HELP_DIALOG_ID = "migration-assistant-help"
export const HELP_DIALOG_TARGET = `#${HELP_DIALOG_ID}`

export const HELP_REQUEST = {
    hubspotFormId: "TODO-migration-assistant-help-form-id",
    submissionIdentifier: "Migration Assistant vRA help",
    pageUri: "resources/migration/vra/assistant",
    event: "migration_assistant_vra_help_request",
    title: "Get Help Running It",
    submitLabel: "[Submit label TBC]",
    thankYouTitle: "[Confirmation copy TBC]",
    thankYouText: "",
}
