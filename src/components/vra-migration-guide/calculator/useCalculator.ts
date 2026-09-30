import { computed, onMounted, readonly, ref } from "vue"
import {
    compute,
    resolveInputs,
    type CalcInputs,
    type CalcResult,
    type InputKey,
} from "~/utils/vra-calculator"
import { getBrowserEnv } from "./browser"
import { calculatorStore, type CalculatorStore } from "./calculatorStore"

/** What the server renders: the engine defaults. */
const SSR_INPUTS: Readonly<CalcInputs> = Object.freeze(resolveInputs())
const SSR_RESULT: CalcResult = compute(SSR_INPUTS)

/**
 * The calculator state for one view.
 *
 * Until the view has mounted it renders the fixed SSR snapshot, whatever the
 * store holds. That keeps the first client render identical to the server
 * HTML even when the store is already hydrated, e.g. after a ClientRouter
 * navigation back to the page, so hydration never mismatches. On mount it
 * hydrates the store (idempotent across views) and switches to live state.
 */
export function useCalculator(store: CalculatorStore = calculatorStore) {
    const mounted = ref(false)

    const inputs = computed<Readonly<CalcInputs>>(() =>
        mounted.value ? store.inputs : SSR_INPUTS,
    )
    const result = computed<CalcResult>(() =>
        mounted.value ? store.result.value : SSR_RESULT,
    )

    onMounted(() => {
        store.hydrate(getBrowserEnv())
        mounted.value = true
    })

    function update<K extends InputKey>(key: K, value: CalcInputs[K]) {
        store.setInput(key, value)
    }

    /** v-bind helper for a field: its value, invalid state and update handler. */
    function field(key: Exclude<InputKey, "cur">) {
        return {
            modelValue: inputs.value[key],
            invalid: !!result.value.invalid[key],
            "onUpdate:modelValue": (value: CalcInputs[typeof key]) =>
                update(key, value),
        }
    }

    return {
        inputs,
        result,
        ready: readonly(mounted),
        update,
        field,
        shareUrl: store.shareUrl,
        csvFile: store.csvFile,
    }
}
