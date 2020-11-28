enum ProjectStatus {
    Active,
    Finished
}

class Project {
    constructor (
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

type Listener<T> = (items: T[]) => void

class State<T> {
    protected listeners: Listener<T>[] = []

    addListener (listenerFn: Listener<T>) {
        this.listeners.push(listenerFn)
    }
}

class ProjectState extends State<Project> {
    private projects: Project[] = []
    private static instance: ProjectState

    private constructor () {
        super()
    }

    static getInstance () {
        if (this.instance)
            return this.instance

        this.instance = new ProjectState()
        return this.instance
    }

    addProject (title: string, description: string, people: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
        )
        this.projects.push(newProject)

        for (const listenerFn of this.listeners)
            listenerFn([...this.projects])
    }
}

const projectState = ProjectState.getInstance()

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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement
    hostElement: T
    element: U

    constructor (
        templateId: string,
        hostElementId: string,
        insertPosition: InsertPosition,
        newElementId?: string
    ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement
        this.hostElement = document.getElementById(hostElementId)! as T

        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as U

        if (newElementId)
            this.element.id = newElementId

        this.attach(insertPosition)
    }

    private attach (insertPosition: InsertPosition) {
        this.hostElement.insertAdjacentElement(insertPosition, this.element)
    }

    abstract configure (): void

    abstract renderContent (): void
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
    private project: Project

    get persons () {
        return this.project.people === 1
            ? 'One person' : `${this.project.people} persons`
    }

    constructor (hostId: string, project: Project) {
        super('single-project', hostId, 'beforeend', project.id)
        this.project = project

        this.renderContent()
    }

    configure () {}

    renderContent () {
        const setContent = (selector: string, content: string) =>
            this.element.querySelector(selector)!.textContent = content

        setContent('h2', this.project.title)
        setContent('h3', this.persons)
        setContent('p', this.project.description)
    }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
    assignedProjects: Project[] = []

    constructor (private type: 'active' | 'finished') {
        super('project-list', 'app', 'beforeend', `${type}-projects`)

        this.configure()
        this.renderContent()
    }

    configure () {
        projectState.addListener((projects: Project[]) => {
            const projectsFilter = (project: Project) => this.type === 'active'
                ? project.status === ProjectStatus.Active
                : project.status === ProjectStatus.Finished
            this.assignedProjects = projects.filter(projectsFilter)
            this.renderProjects()
        })
    }

    renderContent () {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`
    }

    private renderProjects () {
        const listId = `${this.type}-projects-list`
        const listEl = document.getElementById(listId)! as HTMLUListElement
        listEl.innerHTML = '' // we get rid of all list items and rerender

        const ulId = this.element.querySelector('ul')!.id
        for (const projectItem of this.assignedProjects)
            new ProjectItem(ulId, projectItem)
    }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const projectInput = new ProjectInput()
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')
