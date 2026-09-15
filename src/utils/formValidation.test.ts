import { describe, expect, it } from "vitest"
import { getFieldError, getFormErrors } from "~/utils/formValidation"

const validity = (overrides: Partial<ValidityState> = {}): ValidityState =>
    ({
        valid: false,
        valueMissing: false,
        typeMismatch: false,
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        ...overrides,
    }) as ValidityState

const field = (
    type: string,
    overrides: Partial<ValidityState>,
    validationMessage = "",
) => ({ type, validity: validity(overrides), validationMessage })

describe("getFieldError", () => {
    it("returns an empty string for a valid field", () => {
        expect(getFieldError(field("email", { valid: true }))).toBe("")
    })

    it("names the field when a labeled required field is empty", () => {
        expect(
            getFieldError(field("text", { valueMissing: true }), "First Name"),
        ).toBe("Please enter your first name.")
    })

    it("falls back to a generic required message without a label", () => {
        expect(getFieldError(field("text", { valueMissing: true }))).toBe(
            "Please fill out this field.",
        )
    })

    it("asks for a valid email address on a malformed email", () => {
        expect(
            getFieldError(field("email", { typeMismatch: true }), "Email"),
        ).toBe("Please enter a valid email address.")
    })

    it("asks to check a required checkbox", () => {
        expect(getFieldError(field("checkbox", { valueMissing: true }))).toBe(
            "Please check this box to continue.",
        )
    })

    it("falls back to the browser message for other constraint failures", () => {
        expect(
            getFieldError(field("text", { tooShort: true }, "Too short.")),
        ).toBe("Too short.")
    })
})

describe("getFormErrors", () => {
    it("collects one specific message per invalid named field", () => {
        const form = {
            elements: [
                {
                    name: "firstname",
                    willValidate: true,
                    ...field("text", { valueMissing: true }),
                },
                {
                    name: "email",
                    willValidate: true,
                    ...field("email", { typeMismatch: true }),
                },
                {
                    name: "company",
                    willValidate: true,
                    ...field("text", { valid: true }),
                },
                // Unnamed and non-validating controls are skipped.
                {
                    name: "",
                    willValidate: true,
                    ...field("text", { valueMissing: true }),
                },
                {
                    name: "hidden",
                    willValidate: false,
                    ...field("text", { valueMissing: true }),
                },
            ],
        } as unknown as HTMLFormElement

        expect(
            getFormErrors(form, { firstname: "First Name", email: "Email" }),
        ).toEqual({
            firstname: "Please enter your first name.",
            email: "Please enter a valid email address.",
        })
    })
})
