export declare interface Style
{
	[rule: string]: any;
}

export class VisibleElement
{
	private __domElementType: string;
	private __visibleDisplay: string;
	private __domElement?: HTMLElement;

	public constructor(type: string = "div", display: string = "block")
	{
		this.__domElementType = type;
		this.__visibleDisplay = display;
	}

	public setVisible(visible: boolean): void
	{
		if(this.__domElement)
		{
			let display = visible ? this.__visibleDisplay : "none";
			this.__domElement.style.display = display;
		}
		else
		{
			this.createDOMElement();
			this.setVisible(visible);
		}
	}

	public getDOMElement(): HTMLElement | undefined
	{
		return this.__domElement;
	}

	public createDOMElement(): void
	{
		this.__domElement = document.createElement(this.__domElementType);
		this.updateStyles();
		
		document.body.appendChild(this.__domElement);
		//document.body.insertBefore(this.__domElement, document.body.firstChild);
	}

	public getDOMElementStyle(): Style
	{
		return {};
	}

	public updateStyles(): void
	{
		if(typeof this.__domElement === "undefined")
		{
			throw new Error("Attempted to updateStyles on a non-existent DOM element");
		}

		let style = this.getDOMElementStyle();

		for(let attr in style)
		{
			this.__domElement.style[attr] = style[attr];
		}
	}
}