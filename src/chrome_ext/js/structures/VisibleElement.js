"use strict";

class VisibleElement
{
	constructor(type, display)
	{
		this.__domElementType = type || "div";
		this.__visibleDisplay = display || "block";
	}

	setVisible(visible)
	{
		if(this.__domElement)
		{
			let display = visible ? this.__visibleDisplay : "none";
			this.__domElement.style.display = display;
		}
		else
		{
			this.__createDOMElement();
			this.setVisible(visible);
		}
	}

	getDOMElement()
	{
		return this.__domElement;
	}

	__createDOMElement()
	{
		this.__domElement = document.createElement(this.__domElementType);
		this.__updateStyles();
		
		document.body.appendChild(this.__domElement);
		//document.body.insertBefore(this.__domElement, document.body.firstChild);
	}

	__updateStyles()
	{
		let style = this.__getDOMElementStyle();

		for(let attr in style)
		{
			this.__domElement.style[attr] = style[attr];
		}
	}
}