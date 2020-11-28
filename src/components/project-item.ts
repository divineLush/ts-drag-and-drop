/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../models/drag-drop.ts" />

namespace App {
    export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
        private project: Project

        get persons () {
            return this.project.people === 1
            ? 'One person' : `${this.project.people} persons`
        }

        constructor (hostId: string, project: Project) {
            super('single-project', hostId, 'beforeend', project.id)
            this.project = project

            this.configure()
            this.renderContent()
        }

        @AutoBind
        dragStartHandler (event: DragEvent) {
            event.dataTransfer!.setData('text/plain', this.project.id)
            event.dataTransfer!.effectAllowed = 'move'
        }

        @AutoBind
        dragEndHandler (event: DragEvent) {
            console.log(event)
        }

        configure () {
            this.element.addEventListener('dragstart', this.dragStartHandler)
            this.element.addEventListener('dragend', this.dragEndHandler)
        }

        renderContent () {
            const setContent = (selector: string, content: string) =>
            this.element.querySelector(selector)!.textContent = content

            setContent('h2', this.project.title)
            setContent('h3', this.persons)
            setContent('p', this.project.description)
        }
    }
}
