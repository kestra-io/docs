/**
 * Lightweight vanilla JS collapse replacing Bootstrap Collapse.
 *
 * Toggles the 'show' class on the target element and keeps aria-expanded in
 * sync on the trigger button (matching Bootstrap's behaviour so existing CSS
 * continues to work).
 *
 * Auto-inits from data-collapse-toggle / data-collapse-target attributes.
 * Programmatic API mirrors Bootstrap: show(), hide(), toggle(), getInstance(), getOrCreateInstance().
 */

const _instances = new WeakMap()

class Collapse {
    constructor(el, options = {}) {
        if (_instances.has(el)) return _instances.get(el)
        this._el = el
        this._options = options
        _instances.set(el, this)
    }

    show() {
        this._el.classList.add('show')
        this._syncTriggers(true)
    }

    hide() {
        this._el.classList.remove('show')
        this._syncTriggers(false)
    }

    toggle() {
        if (this._el.classList.contains('show')) {
            this.hide()
        } else {
            this.show()
        }
    }

    /** Keep aria-expanded on any declarative triggers pointing at this element. */
    _syncTriggers(expanded) {
        const id = this._el.id
        if (!id) return
        document.querySelectorAll(`[data-collapse-target="#${id}"]`).forEach((trigger) => {
            trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false')
        })
    }

    static getInstance(el) {
        return _instances.get(el) ?? null
    }

    static getOrCreateInstance(el, options = {}) {
        return _instances.get(el) ?? new Collapse(el, options)
    }
}

// Auto-init declarative triggers: data-collapse-toggle / data-collapse-target
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-collapse-toggle]')
    if (!trigger) return
    const targetSelector = trigger.getAttribute('data-collapse-target')
    if (!targetSelector) return
    const targetEl = document.querySelector(targetSelector)
    if (!targetEl) return

    const instance = Collapse.getOrCreateInstance(targetEl)
    instance.toggle()

    const expanded = targetEl.classList.contains('show')
    trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false')
})

window.$collapse = { Collapse }
