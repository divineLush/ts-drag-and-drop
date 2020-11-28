/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
        titleInputElement: HTMLInputElement
        descriptionInputElement: HTMLInputElement
        peopleInputElement: HTMLInputElement

        constructor () {
            super('project-input', 'app', 'afterbegin', 'user-input')

            this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement
            this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement
            this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement

            this.configure()
        }

        configure () {
            this.element.addEventListener('submit', this.submitHandler)
        }

        renderContent () {}

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
                const [title, desc, people] = userInput
                projectState.addProject(title, desc, people)
                console.log(title, desc, people)
                this.clearInputs()
            }
        }
    }
}
