import { ref } from "vue"
import { getFormErrors } from "~/utils/formValidation"

// Per-field validation state for the HubSpot-backed forms: `validate` records
// a specific message per invalid field and focuses the first one, `clearError`
// dismisses a field's message as the user edits it.
export function useFormErrors(labels: Record<string, string> = {}) {
    const errors = ref<Record<string, string>>({})

    function clearError(id: string) {
        delete errors.value[id]
    }

    function validate(form: HTMLFormElement): boolean {
        errors.value = getFormErrors(form, labels)
        if (Object.keys(errors.value).length === 0) {
            return true
        }
        ;(form.querySelector(":invalid") as HTMLElement | null)?.focus()
        return false
    }

    return { errors, clearError, validate }
}
