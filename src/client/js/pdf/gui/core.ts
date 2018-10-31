import {Component} from "./components/core";
import {Toasts} from "./components/toasts";
import {PdfError} from "./components/error";

type GenericState = Object;

interface ComponentMap
{
    [compName: string]: Component<GenericState>;
}

export default class GUI
{
    private container: HTMLElement;
    private activeComponent: Component<GenericState>;
    private components: ComponentMap;

    public constructor(container: HTMLElement)
    {
        this.container = container;

        const u = this.handleUpdate.bind(this);
        this.components =
        {
            "toasts": new Toasts(u),
            "error": new PdfError(u),
        };
    }

    public setActiveComponent(c: string, state?: Object): void
    {
        if(typeof this.components[c] === "undefined")
        {
            throw new Error("Invalid component name " + c);
        }

        this.activeComponent = this.components[c];

        if(state)
        {
            this.activeComponent.setState(state);
        }
        else
        {
            this.handleUpdate();
        }
    }

    public setState(state: GenericState)
    {
        this.activeComponent.setState(state);
    }

    public getState(): GenericState
    {
        return this.activeComponent.getState();
    }

    private handleUpdate(): void
    {
        this.render();
    }

    private render(): void
    {
        const html: string = this.activeComponent.toHTML();
        this.container.innerHTML = html;

        if(this.activeComponent.postRender)
        {
            this.activeComponent.postRender();
        }
    }
}