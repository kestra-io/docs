import { openModal } from "~/utils/modal"

// Declarative modal triggers: `data-modal-target="#id"` opens that <dialog>.
// Closing is declarative too, as fallbacks for browsers without invoker
// commands or `closedby="any"`: a `command="close"` button closes its
// `commandfor` dialog, and a click on a common/Dialog.astro shell's own scrim
// or on the `.modal-dialog` gutter around its `.modal-content` closes it.
// Other overlays keep their own scrim handling.
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

    const dialog = target.closest<HTMLDialogElement>("dialog.ks-dialog")
    if (
        dialog?.open &&
        (target === dialog || target.classList.contains("modal-dialog"))
    ) {
        dialog.close()
    }
})
