import Zone from "./Zone";
import {Style} from "./VisibleElement";

export default class TextZone extends Zone
{
    private text: string;
    private __textChildDOM: HTMLDivElement;

    public constructor(text: string, x: number, y: number, width: number, height: number)
    {
        super(x, y, width, height);
        this.text = text;
    }

    public getText(): string
    {
        return this.text;
    }

    public createDOMElement(): void
    {
        super.createDOMElement();

        const domElement = this.getDOMElement();

        if(domElement)
        {
            this.__textChildDOM = document.createElement("div");
            this.__updateTextChildStyle();

            domElement.appendChild(this.__textChildDOM);
        }
    }

    private __updateTextChildStyle(): void
    {
        this.__textChildDOM.innerText = this.text;

        // apply style
        const style = this.__getTextChildDOMStyle();

        for(let attr in style)
		{
			this.__textChildDOM.style[attr] = style[attr];
        }
    }

    private __getTextChildDOMStyle(): Style
    {
        return {
            position: "absolute",
            "font-size": "16px",
            color: "transparent",
            "pointer-events": "auto",
        };
    }
}