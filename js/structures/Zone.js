"use strict";

const DOM_ELEMENT_TYPE = "div";

class Zone
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.__internalID = Zone.__nextInternalID;
		Zone.__nextInternalID++;
	}

	setVisible(visible)
	{
		if(this.__domElement)
		{
			let display = visible ? "flex" : "none";
			this.__domElement.style.display = display;
		}
		else
		{
			this.__createDOMElement();
			this.setVisible(visible);
		}
	}

	__createDOMElement()
	{
		this.__domElement = document.createElement(DOM_ELEMENT_TYPE);

		let textNode = document.createTextNode(this.__internalID);
		this.__domElement.appendChild(textNode);

		let style = this.__getDOMElementStyle();

		for(let attr in style)
		{
			this.__domElement.style[attr] = style[attr];
		}

		document.body.appendChild(this.__domElement);
	}

	__getDOMElementStyle()
	{
		return {
			position: "absolute",
			top: this.y,
			left: this.x,
			width: this.width,
			height: this.height,
			border: "solid 2px red",
			"pointer-events": "none",
			"align-items": "center",
			"justify-content": "center",
			"font-size": "48px",
		};
	}

	static createFromArea(width, height, rows, columns)
	{
		let zones = [], x = 0, y = 0;

		let zoneWidth = width / columns,
			zoneHeight = height / rows;

		while(y < height)
		{
			while(x < width)
			{
				let z = new Zone(x, y, zoneWidth, zoneHeight);
				zones.push(z);

				x += zoneWidth;
			}
			
			x = 0;
			y += zoneHeight;
		}

		return zones;
	}
}

Zone.__nextInternalID = 1;