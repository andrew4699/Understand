"use strict";

class SearchBar extends VisibleElement
{
    constructor()
    {
        super("input", "block");

        this.x = "10px";
        this.y = "150px";
    }

    __getDOMElementStyle()
    {
		return {
			position: "absolute",
			top: this.y,
			left: this.x,
		};
    }

    __createDOMElement()
    {
        super.__createDOMElement();
    }
}