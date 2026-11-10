import { openModal } from "~/utils/modal"

// Declarative modal triggers: `data-modal-target="#id"` opens that <dialog>.
// Close fallbacks for browsers without invoker commands or `closedby="any"`.
document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null
    if (!target) return

    const trigger = target.closest<HTMLElement>("[data-modal-target]")
    if (trigger?.dataset.modalTarget) {
        openModal(trigger.dataset.modalTarget)
        return
    }

    const closer = target.closest<HTMLElement>('[command="close"][commandfor]')
    if (closer) {
        const dialog = document.getElementById(
            closer.getAttribute("commandfor") ?? "",
        )
        if (dialog instanceof HTMLDialogElement && dialog.open) dialog.close()
        return
    }

    // The `.modal-dialog` gutter ignores pointer events, so scrim clicks land
    // on the dialog itself.
    if (
        target instanceof HTMLDialogElement &&
        target.matches(".ks-dialog[open]")
    )
        target.close()
})
