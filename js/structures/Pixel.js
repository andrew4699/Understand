"use strict";

const DOM_ELEMENT_TYPE = "div";

class Pixel extends VisibleElement
{
	constructor(x, y, r, g, b, a)
	{
		super();
		this.__visibleSize = 1;

		this.x = x;
		this.y = y;
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	colorEquals(pix, testAlpha)
	{
		if(typeof testAlpha === "undefined")
		{
			testAlpha = true;
		}

		return pix instanceof Pixel && this.r === pix.r && this.g === pix.g &&
			   						   this.b === pix.b && (this.a === pix.a || !testAlpha);
	}

	scale(oldWidth, oldHeight, newWidth, newHeight)
	{
		let propX = this.x / oldWidth,
			propY = this.y / oldHeight;

		return new Pixel(newWidth * propX, newHeight * propY, this.r, this.g, this.b, this.a);
	}

	setVisibleSize(size)
	{
		this.__visibleSize = size;

		if(this.__domElement)
		{
			this.__updateStyles();
		}
	}

	__getDOMElementStyle()
	{
		return {
			position: "absolute",
			top: (this.y - (this.__visibleSize / 2)) + "px",
			left: (this.x - (this.__visibleSize / 2)) + "px",
			background: "red",
			width: this.__visibleSize + "px",
			height: this.__visibleSize + "px",
		};
	}

	// Converts a canvas coordinate (x, y) to it's imageData.data index
	static __getImageDataIndexFromPosition(x, y, width)
	{
		return (x * 4) + (y * width * 4);
	}

	/*
		Converts canvas context.getImageData into pixels, sending each one
		through the pipe function until it returns false
	*/
	static pipeImageData(imgData, pipe, userOpts)
	{
		if(imgData.data.length % 4 != 0)
		{
			throw "imgData not in group of 4";
		}

		if(imgData.data.length / 4 != (imgData.width * imgData.height))
		{
			throw "imgData doesn't match width and height";
		}

		let opts = {xSpacing: 1, ySpacing: 1, startX: 0, startY: 0, minX: 0, minY: 0, maxX: imgData.width, maxY: imgData.height};

		if(typeof userOpts !== "undefined")
		{
			opts = Object.assign(opts, userOpts);
		}

		let x = opts.startX, y = opts.startY, p, i;

		while(y < imgData.height && y >= opts.minY && y <= opts.maxY)
		{
			while(x < imgData.width && x >= opts.minX && x <= opts.maxX)
			{
				i = Pixel.__getImageDataIndexFromPosition(x, y, imgData.width);
				p = new Pixel(x, y, imgData.data[i], imgData.data[i + 1], imgData.data[i + 2], imgData.data[i + 3]);

				let pipeResult = pipe(p);

				if(pipeResult === false)
				{
					return;
				}

				x += opts.xSpacing;
			}

			x = opts.minX;
			y += opts.ySpacing;
		}
	}
}