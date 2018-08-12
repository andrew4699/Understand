"use strict";

class Zone extends VisibleElement
{
	constructor(x, y, width, height)
	{
		super("div", "flex");
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.__internalID = Zone.__nextInternalID;
		Zone.__nextInternalID++;
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

	static createFromArea(startX, startY, endX, endY, rows, columns)
	{
		let zones = [], x = startX, y = startY;

		let zoneWidth = (endX - startX) / columns,
			zoneHeight = (endY - startY) / rows;

		while(y < endY)
		{
			while(x < endX)
			{
				let z = new Zone(x, y, zoneWidth, zoneHeight);
				zones.push(z);

				x += zoneWidth;
			}
			
			x = startX;
			y += zoneHeight;
		}

		return zones;
	}
}

Zone.__nextInternalID = 1;