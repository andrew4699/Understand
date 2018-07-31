"use strict";

class TextZone extends Zone
{
    constructor(text, x, y, width, height)
    {
        super(x, y, width, height);
        this.text = text;
    }

    getText()
    {
        return this.text;
    }

    __createDOMElement()
    {
        super.__createDOMElement();

        this.__textChildDOM = document.createElement("div");
        this.__updateTextChildStyle();

        this.__domElement.appendChild(this.__textChildDOM);
    }

    __updateTextChildStyle()
    {
        this.__textChildDOM.innerText = this.text;

        // apply style
        const style = this.__getTextChildDOMStyle();

        for(let attr in style)
		{
			this.__textChildDOM.style[attr] = style[attr];
        }
    }

    __getTextChildDOMStyle()
    {
        return {
            position: "absolute",
            "font-size": "16px",
            color: "transparent",
            "pointer-events": "auto",
        };
    }
}