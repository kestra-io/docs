/**
 * Lightweight vanilla JS modal replacing Bootstrap Modal.
 *
 * Fires 'modal:shown' and 'modal:hidden' custom DOM events (replacing
 * Bootstrap's 'shown.bs.modal' / 'hidden.bs.modal').
 *
 * Auto-inits from data-modal-toggle / data-modal-target attributes.
 * Programmatic API mirrors Bootstrap: show(), hide(), getInstance(), getOrCreateInstance().
 */

const _instances = new WeakMap()

class Modal {
    constructor(el) {
        if (_instances.has(el)) return _instances.get(el)
        this._el = el
        this._backdrop = null
        this._onKeydown = (e) => { if (e.key === 'Escape') this.hide() }
        _instances.set(el, this)
    }

    show() {
        const el = this._el
        el.style.display = 'block'
        el.setAttribute('aria-hidden', 'false')
        el.setAttribute('aria-modal', 'true')
        document.body.classList.add('modal-open')

        this._backdrop = document.createElement('div')
        this._backdrop.className = 'modal-backdrop fade'
        document.body.appendChild(this._backdrop)

        // Trigger reflow so the fade transition plays
        // eslint-disable-next-line no-unused-expressions
        this._backdrop.offsetHeight

        requestAnimationFrame(() => {
            this._backdrop.classList.add('show')
            el.classList.add('show')
        })

        document.addEventListener('keydown', this._onKeydown)
        this._backdrop.addEventListener('click', () => this.hide())

        // Fire after CSS transition (~300 ms)
        setTimeout(() => {
            el.dispatchEvent(new CustomEvent('modal:shown', { bubbles: true }))
        }, 300)
    }

    hide() {
        const el = this._el
        el.classList.remove('show')

        if (this._backdrop) {
            this._backdrop.classList.remove('show')
        }

        document.removeEventListener('keydown', this._onKeydown)

        setTimeout(() => {
            el.style.display = 'none'
            el.setAttribute('aria-hidden', 'true')
            el.removeAttribute('aria-modal')
            document.body.classList.remove('modal-open')

            if (this._backdrop) {
                this._backdrop.remove()
                this._backdrop = null
            }

            el.dispatchEvent(new CustomEvent('modal:hidden', { bubbles: true }))
        }, 150)
    }

    static getInstance(el) {
        return _instances.get(el) ?? null
    }

    static getOrCreateInstance(el) {
        return _instances.get(el) ?? new Modal(el)
    }
}

// Auto-init declarative triggers: data-modal-toggle / data-modal-target
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-toggle]')
    if (!trigger) return
    const targetSelector = trigger.getAttribute('data-modal-target')
    if (!targetSelector) return
    const targetEl = document.querySelector(targetSelector)
    if (!targetEl) return
    e.preventDefault()
    Modal.getOrCreateInstance(targetEl).show()
})

window.$modal = { Modal }
