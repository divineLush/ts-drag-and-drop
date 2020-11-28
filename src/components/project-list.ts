import Component from './base-component.js'
import ProjectItem from './project-item.js'
import { DragTarget } from '../models/drag-drop.js'
import { ProjectStatus, Project } from '../models/project.js'
import { AutoBind } from '../decorators/autobind.js'
import { projectState } from '../state/project-state.js'

export default class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[] = []

    constructor (private type: 'active' | 'finished') {
        super('project-list', 'app', 'beforeend', `${type}-projects`)

        this.configure()
        this.renderContent()
    }

    switchElementStyles (enable: boolean) {
        const classList = this.element.querySelector('ul')!.classList
        if (enable)
        classList.add('droppable')
        else
        classList.remove('droppable')
    }

    @AutoBind
    dragOverHandler (event: DragEvent) {
        const isPlainText = event.dataTransfer &&
        event.dataTransfer.types[0] === 'text/plain'
        if (isPlainText) {
            event.preventDefault() // i want dropHandler to fire
            this.switchElementStyles(true)
        }
    }

    @AutoBind
    dropHandler (event: DragEvent) {
        const projectId = event.dataTransfer!.getData('text/plain')
        const projectStatus = this.type === 'active'
        ? ProjectStatus.Active : ProjectStatus.Finished

        projectState.moveProject(projectId, projectStatus)
    }

    @AutoBind
    dragLeaveHandler (event: DragEvent) {
        console.log(event)
        this.switchElementStyles(false)
    }

    configure () {
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)

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
