import { openModal } from "~/utils/modal"

// Declarative modal triggers: `data-modal-target="#id"` opens that <dialog>.
document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null
    const trigger = target?.closest<HTMLElement>("[data-modal-target]")
    if (!trigger?.dataset.modalTarget) return
    openModal(trigger.dataset.modalTarget)
})
