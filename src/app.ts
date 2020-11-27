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

        const isEmpty = (input: string) => input.trim().length === 0

        if (isEmpty(title) || isEmpty(description) || isEmpty(people)) {
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
