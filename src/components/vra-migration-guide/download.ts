/** The gated PDF dialog, opened via `data-modal-target` (scripts/modal.ts). */
export const DOWNLOAD_DIALOG_ID = "guide-download"
export const DOWNLOAD_DIALOG_TARGET = `#${DOWNLOAD_DIALOG_ID}`

/** The demo form dialog: every in-page link to /demo on the vRA pages opens it. */
export const DEMO_DIALOG_ID = "book-demo"
export const DEMO_DIALOG_TARGET = `#${DEMO_DIALOG_ID}`

export const GUIDE_DOWNLOAD = {
    hubspotFormId: "3b11593b-4c99-4ad4-960d-1297e5087478",
    guideUrl: "https://hs.kestra.io/hubfs/kestra-vmware-vra-migration-guide.pdf",
    withCompany: true,
    submissionIdentifier: "vRA Migration Guide",
    pageUri: "resources/migration/vra",
    event: "vra_migration_guide_download",
}

/**
 * The Migration Assistant's help request: the same dialog and HubSpot form as
 * the guide, without the download. The submission identifier tells them apart.
 */
export const HELP_DIALOG_ID = "migration-assistant-help"
export const HELP_DIALOG_TARGET = `#${HELP_DIALOG_ID}`

export const HELP_REQUEST = {
    hubspotFormId: "3b11593b-4c99-4ad4-960d-1297e5087478",
    submissionIdentifier: "Migration Assistant vRA help",
    pageUri: "resources/migration/vra/assistant",
    withCompany: true,
    event: "migration_assistant_vra_help_request",
    title: "Get Help Running It",
    submitLabel: "Request help",
    thankYouTitle: "Thanks, we'll be in touch.",
    thankYouText:
        "One of our engineers will email you to set up a session, on a call or on a sanitized copy of your export.",
}
