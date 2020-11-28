namespace App {
    export interface Validatable {
        value: string | number,
        required?: boolean,
        minLength?: number,
        maxLength?: number,
        min?: number,
        max?: number,
    }

    export const validate = (validatableInput: Validatable) => {
        let isValid = true
        const inputLength = validatableInput.value.toString().trim().length
        const isNumber = typeof validatableInput.value === 'number'

        if (validatableInput.required)
        isValid = isValid && inputLength !== 0

        if (validatableInput.minLength != null)
        isValid = isValid && inputLength > validatableInput.minLength

        if (validatableInput.maxLength != null)
        isValid = isValid && inputLength < validatableInput.maxLength

        if (validatableInput.min != null && isNumber)
        isValid = isValid && inputLength > validatableInput.min

        if (validatableInput.max != null && isNumber)
        isValid = isValid && inputLength < validatableInput.max

        return isValid
    }
}
