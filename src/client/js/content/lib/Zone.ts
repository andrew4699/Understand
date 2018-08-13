import {VisibleElement, Style} from "./VisibleElement";

export default class Zone extends VisibleElement
{
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	private __internalID: number;
	private static __nextInternalID: number = 1;

	public constructor(x: number, y: number, width: number, height: number)
	{
		super("div", "flex");
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.__internalID = Zone.__nextInternalID;
		Zone.__nextInternalID++;
	}

	public __getDOMElementStyle(): Style
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

	public static createFromArea(startX: number, startY: number, endX: number, endY: number, rows: number, columns: number): Zone[]
	{
		let zones: Zone[] = [], x = startX, y = startY;

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