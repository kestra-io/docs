import { computed, effectScope, reactive, ref, watch } from "vue"
import {
    CSV_FILENAME,
    STORAGE_KEY,
    buildCsvFile,
    compute,
    currencyFromLocale,
    decodeShareState,
    encodeShareState,
    resolveInputs,
    type CalcInputs,
    type InputKey,
} from "~/utils/vra-calculator"
import {
    readShareParam,
    readStored,
    withShareParam,
    withoutShareParam,
    writeStored,
    type BrowserEnv,
} from "./browser"

/**
 * One calculator state for every view on the page. Astro hydrates each island
 * as its own Vue app, but they import the same module, so a module-level
 * store is what the 3.2.2 and 7.2 views share.
 *
 * The store starts at the engine defaults and never reads the browser on its
 * own: `hydrate()` is called from `onMounted` (see useCalculator.ts) with the
 * browser environment. Precedence on the first hydrate: a `?kvc=` share link,
 * then saved state, then the defaults with the visitor's locale currency.
 *
 * Storage holds the state in the share-link encoding, so saved values go
 * through the same sanitizing decoder as links. State equal to the defaults is
 * not stored at all, so a reset (or never touching the calculator) leaves
 * nothing behind.
 */
export function createCalculatorStore() {
    const inputs = reactive<CalcInputs>(resolveInputs())
    const result = computed(() => compute(inputs))
    const hydrated = ref(false)

    let env: BrowserEnv | null = null
    const persistence = effectScope(true)

    /** Defaults, with the currency picked from the visitor's locale. */
    function baseline(overrides?: Partial<CalcInputs> | null): CalcInputs {
        const cur = currencyFromLocale(env?.locales())
        return resolveInputs({ cur, ...overrides })
    }

    function assign(next: CalcInputs) {
        Object.assign(inputs, next)
    }

    function save() {
        if (!env) return
        const encoded = encodeShareState(inputs)
        const isDefault = encoded === encodeShareState(baseline())
        writeStored(env.storage, STORAGE_KEY, isDefault ? null : encoded)
    }

    /**
     * Applies a `?kvc=` link if the URL has one, then removes it from the URL:
     * the state now lives in storage, and a later reload or a copied page URL
     * must not bring back numbers the visitor has since changed. An unreadable
     * link is removed and ignored.
     */
    function applyShareLink(): boolean {
        if (!env) return false
        const href = env.href()
        const param = readShareParam(href)
        if (param === null) return false
        env.replaceUrl(withoutShareParam(href))
        const shared = decodeShareState(param)
        if (!shared) return false
        assign(baseline(shared))
        save()
        return true
    }

    /**
     * Connects the store to the browser. The first call loads saved state and
     * starts saving changes; every call picks up a `?kvc=` link in the URL,
     * so arriving on the page through ClientRouter with a link still works.
     */
    function hydrate(browserEnv: BrowserEnv | null) {
        if (!browserEnv) return
        if (!hydrated.value) {
            env = browserEnv
            assign(
                baseline(
                    decodeShareState(readStored(env.storage, STORAGE_KEY)),
                ),
            )
            persistence.run(() => watch(inputs, save, { deep: true }))
            hydrated.value = true
        }
        applyShareLink()
    }

    function setInput<K extends InputKey>(key: K, value: CalcInputs[K]) {
        inputs[key] = value
    }

    function reset() {
        assign(baseline())
    }

    function shareUrl(anchor?: string): string | null {
        if (!env) return null
        return withShareParam(env.href(), encodeShareState(inputs), anchor)
    }

    function csvFile(generatedOn: Date) {
        return {
            filename: CSV_FILENAME,
            content: buildCsvFile(inputs, generatedOn),
        }
    }

    function dispose() {
        persistence.stop()
    }

    return {
        inputs,
        result,
        hydrated,
        hydrate,
        setInput,
        reset,
        shareUrl,
        csvFile,
        dispose,
    }
}

export type CalculatorStore = ReturnType<typeof createCalculatorStore>

export const calculatorStore = createCalculatorStore()
