/** Opens a `<dialog class="modal">` by selector and signals it, since the
 *  platform fires no event of its own when a dialog is shown. */
export const MODAL_SHOWN_EVENT = "modalshown"

export function openModal(selector: string): HTMLDialogElement | null {
    const dialog = document.querySelector<HTMLDialogElement>(selector)
    if (!dialog) return null
    if (!dialog.open) dialog.showModal()
    dialog.dispatchEvent(new Event(MODAL_SHOWN_EVENT))
    return dialog
}
