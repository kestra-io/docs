// Builds specific, human-readable validation messages from the browser's
// native ValidityState, shared by the site's HubSpot-backed forms.

interface ValidatableField {
    name: string
    type: string
    willValidate: boolean
    validity: ValidityState
    validationMessage: string
}

export function getFieldError(
    field: Pick<ValidatableField, "type" | "validity" | "validationMessage">,
    label?: string,
): string {
    const validity = field.validity
    if (validity.valid) return ""

    if (validity.valueMissing) {
        if (field.type === "checkbox") {
            return "Please check this box to continue."
        }
        return label
            ? `Please enter your ${label.toLowerCase()}.`
            : "Please fill out this field."
    }

    if (validity.typeMismatch && field.type === "email") {
        return "Please enter a valid email address."
    }

    return field.validationMessage || "Please review this field."
}

export function getFormErrors(
    form: HTMLFormElement,
    labels: Record<string, string> = {},
): Record<string, string> {
    const errors: Record<string, string> = {}
    for (const element of Array.from(form.elements)) {
        const field = element as unknown as ValidatableField
        if (!field.name || !field.willValidate || field.validity.valid) {
            continue
        }
        if (!errors[field.name]) {
            errors[field.name] = getFieldError(field, labels[field.name])
        }
    }
    return errors
}
