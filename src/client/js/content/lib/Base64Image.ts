export declare type ImageProcessedHandler = (img: Base64Image) => void;

export class Base64Image
{
	private __data: string; // base64
	private width?: number;
	private height?: number;
	private __domElement: HTMLImageElement;

	public constructor(data: string, onProcessed: ImageProcessedHandler)
	{
		this.__data = data; // base64 with header included (data:base64,image/jpeg;+asidnflansln)
		this.__createDOMElement(onProcessed);
	}

	public getData(): string
	{
		return this.__data;
	}

	public hasBeenProcessed(): boolean
	{
		return typeof this.width !== "undefined" && typeof this.height !== "undefined";
	}

	private __ensureProcessed(): void
	{
		if(!this.hasBeenProcessed())
		{
			throw new Error("__ensureProcessed failed");
		}
	}

	public scaleTo(tarWidth: number, tarHeight: number, finished: () => void): void
	{
		this.__ensureProcessed();

		let canvas = document.createElement("canvas");
		canvas.width = tarWidth;
		canvas.height = tarHeight;

		let ctx = canvas.getContext("2d");

		if(ctx && this.__domElement)
		{
			ctx.drawImage(this.__domElement, 0, 0, tarWidth, tarHeight);
			this.__data = canvas.toDataURL();
			canvas.remove();

			this.__domElement.src = this.__data;
			this.__domElement.onload = finished;

			this.width = tarWidth;
			this.height = tarHeight;
		}
	}
	
	private __createDOMElement(finished: ImageProcessedHandler): void
	{
		if(typeof finished === "undefined")
		{
			throw new Error("__createDOMElement requires a finished callback");
		}

		this.__domElement = new Image();
		this.__domElement.src = this.__data;

		this.__domElement.onload = () =>
		{
			this.width = this.__domElement.width;
			this.height = this.__domElement.height;

			finished(this);
		};
	}
}