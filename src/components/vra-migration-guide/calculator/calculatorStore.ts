import { computed, effectScope, onMounted, reactive, watch } from "vue"
import { useMounted, useStorage, type StorageLike } from "@vueuse/core"
import {
    SHARE_PARAM,
    STORAGE_KEY,
    compute,
    currencyFromLocale,
    decodeShareState,
    encodeShareState,
    resolveInputs,
    type CalcInputs,
    type CalcResult,
    type InputKey,
    type NumericInputKey,
} from "~/utils/vra-calculator"

/** What the server renders: the engine defaults. */
const SSR_INPUTS: Readonly<CalcInputs> = Object.freeze(resolveInputs())
const SSR_RESULT: CalcResult = compute(SSR_INPUTS)

/**
 * Module-level, so every island on the page shares it. Saves in the share-link
 * encoding, and saves nothing while the state equals the defaults.
 */
export function createCalculatorStore(storage?: StorageLike) {
    const inputs = reactive<CalcInputs>(resolveInputs())
    const result = computed(() => compute(inputs))
    let hydrated = false

    /** Defaults, with the currency picked from the visitor's locale. */
    function baseline(overrides?: Partial<CalcInputs> | null): CalcInputs {
        const locale = navigator.languages?.[0] ?? navigator.language
        return resolveInputs({ cur: currencyFromLocale(locale), ...overrides })
    }

    /** Loads saved state, then saves every change. */
    function persist() {
        const saved = useStorage<string | null>(STORAGE_KEY, null, storage, {
            onError: () => {},
        })
        Object.assign(inputs, baseline(decodeShareState(saved.value)))
        watch(inputs, () => {
            const encoded = encodeShareState(inputs)
            const isDefault = encoded === encodeShareState(baseline())
            saved.value = isDefault ? null : encoded
        })
    }

    /**
     * Loads and starts saving state on the first call. Every call applies a
     * `?kvc=` link and strips it, so a reload never brings back stale numbers.
     */
    function hydrate() {
        // Detached, so saving outlives the island that hydrated first.
        if (!hydrated) effectScope(true).run(persist)
        hydrated = true
        const url = new URL(location.href)
        const param = url.searchParams.get(SHARE_PARAM)
        if (param === null) return
        url.searchParams.delete(SHARE_PARAM)
        history.replaceState(history.state, "", url)
        const shared = decodeShareState(param)
        if (shared) Object.assign(inputs, baseline(shared))
    }

    function update<K extends InputKey>(key: K, value: CalcInputs[K]) {
        inputs[key] = value
    }

    function shareUrl(anchor: string): string {
        const url = new URL(location.href)
        url.searchParams.set(SHARE_PARAM, encodeShareState(inputs))
        url.hash = anchor
        return url.toString()
    }

    return { inputs, result, hydrate, update, shareUrl }
}

export type CalculatorStore = ReturnType<typeof createCalculatorStore>

export const calculatorStore = createCalculatorStore()

/**
 * Renders the SSR snapshot until mounted, even if the store is already live,
 * so hydration never mismatches; then hydrates the store and goes live.
 */
export function useCalculator(store: CalculatorStore = calculatorStore) {
    const ready = useMounted()
    onMounted(store.hydrate)

    const inputs = computed<Readonly<CalcInputs>>(() =>
        ready.value ? store.inputs : SSR_INPUTS,
    )
    const result = computed<CalcResult>(() =>
        ready.value ? store.result.value : SSR_RESULT,
    )

    function field(key: NumericInputKey) {
        return {
            modelValue: inputs.value[key],
            invalid: !!result.value.invalid[key],
            "onUpdate:modelValue": (value: CalcInputs[typeof key]) =>
                store.update(key, value),
        }
    }

    return { ...store, inputs, result, ready, field }
}
