import {VisibleElement, Style} from "./VisibleElement";

export default class SearchBar extends VisibleElement
{
    private x: number;
    private y: number;
    
    public constructor()
    {
        super("input", "block");

        this.x = 10;
        this.y = 150;
    }

    private __getDOMElementStyle(): Style
    {
		return {
			position: "absolute",
			top: this.y + "px",
			left: this.x + "px",
		};
    }

    public createDOMElement(): void
    {
        super.createDOMElement();
    }
}