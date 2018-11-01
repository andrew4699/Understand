import {Position, Size, Scale} from "../../types/vectors";

export default class LoadingIndicator
{
    private domElement: HTMLElement;

    public constructor(page: number, pos: Position, size: Size, scale: Scale)
    {
        this.domElement = document.createElement("div");
        this.domElement.classList.add("understand-loader");
        
        this.domElement.style.left = (pos[0] * scale[0]) + "px";
        this.domElement.style.top = (pos[1] * scale[1]) + "px";
        this.domElement.style.width = (size[0] * scale[0]) + "px";
        this.domElement.style.height = (size[1] * scale[1]) + "px";

        const parent = document.querySelector(`.page[data-page-number="${page}"] .canvasWrapper`);
        parent!.appendChild(this.domElement);
    }

    public remove()
    {
        this.domElement.parentElement!.removeChild(this.domElement);
    }
}