interface Validatable {
    value: string | number,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number,
}

const validate = (validatableInput: Validatable) => {
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

const AutoBind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get () {
            return originalMethod.bind(this)
        }
    }

    return adjDescriptor
}

class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    element: HTMLFormElement
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor () {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
        this.hostElement = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as HTMLFormElement
        this.element.id = 'user-input'

        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement

        this.configure()
        this.attach()
    }

    private gatherUserInput (): [string, string, number] | void {
        const title = this.titleInputElement.value
        const description = this.descriptionInputElement.value
        const people = this.peopleInputElement.value

        const titleValidatable: Validatable = {
            value: title,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: description,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: people,
            required: true,
            min: 1,
            max: 5
        }
        const isFormValid = !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)

        if (isFormValid) {
            alert('Invalid input')
            return
        }

        return [title, description, +people]
    }

    private clearInputs () {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''
    }

    @AutoBind
    private submitHandler (event: Event) {
        event.preventDefault()
        const userInput = this.gatherUserInput()

        if (Array.isArray(userInput)) {
            const [title, descritption, people] = userInput
            console.log(title, descritption, people)
            this.clearInputs()
        }
    }

    private configure () {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }

    private attach () {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}

const projectInput = new ProjectInput()
