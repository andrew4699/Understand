"use strict";

class Base64Image
{
	constructor(data, onProcessed)
	{
		this.__data = data; // base64 with header included (data:base64,image/jpeg;+asidnflansln)
		this.__createDOMElement(onProcessed);
	}

	getData()
	{
		return this.__data;
	}

	hasBeenProcessed()
	{
		return typeof this.width !== "undefined" && typeof this.height !== "undefined";
	}

	__ensureProcessed()
	{
		if(!this.hasBeenProcessed())
		{
			throw "__ensureProcessed failed";
		}
	}

	/*
		Splits this image into zones and pipes them along with their zones

		When createInstances is false, the images will be returned as a base64 string
			When true, they will be returned as Base64Image objects

		pipe is expected to be a function(image, zone)
	*/
	splitIntoZones(zones, createInstances, pipe)
	{
		if(zones.length === 0)
		{
			throw "Zones was empty when splitting Base64Image into zones";
		}

		let canvas = document.createElement("canvas");
		canvas.width = zones[0].width;
		canvas.height = zones[0].height;

		let ctx = canvas.getContext("2d");

		for(let i = 0; i < zones.length; i++)
		{
			let clipData = this.__getImageClipData(zones[i], this.width, this.height);
			ctx.drawImage(this.__domElement, clipData.x, clipData.y, clipData.width, clipData.height, 0, 0, canvas.width, canvas.height);

			if(createInstances)
			{
				new Base64Image(canvas.toDataURL(), function(img)
				{
					pipe(img, zones[i]);
				});
			}
			else
			{
				pipe(canvas.toDataURL(), zones[i]);
			}

			// DEBUGGING PURPOSES
			//break;
		}

		canvas.remove();
		//finished(parts);
	}

	scaleTo(tarWidth, tarHeight, finished)
	{
		this.__ensureProcessed();

		let canvas = document.createElement("canvas");
		canvas.width = tarWidth;
		canvas.height = tarHeight;

		let ctx = canvas.getContext("2d");
		ctx.drawImage(this.__domElement, 0, 0, tarWidth, tarHeight);
		this.__data = canvas.toDataURL();
		canvas.remove();

		this.__domElement.src = this.__data;
		this.__domElement.onload = finished;

		this.width = tarWidth;
		this.height = tarHeight;
	}

	/*
		Calculates the left and right X bounds for the PDF image

		finished should be a function(leftX, rightX)
	*/
	getPDFBounds(finished)
	{
		this.__ensureProcessed();

		let canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;

		let ctx = canvas.getContext("2d");
		ctx.drawImage(this.__domElement, 0, 0, canvas.width, canvas.height);

		let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		canvas.remove();

		let opts =
		{
			xSpacing: 10,
			ySpacing: 50,
			startX: 20,
			startY: 200,
			maxX: imgData.width - 30,
			maxY: imgData.height - 30,
		};

		let lastPixel;

		Pixel.pipeImageData(imgData, (pixel) =>
		{
			if(typeof lastPixel !== "undefined" && !pixel.colorEquals(lastPixel))
			{
				this.__onFoundPDFLeftBound(imgData, pixel, finished);
				return false;
			}

			lastPixel = pixel;
		}, opts);
	}

	__onFoundPDFLeftBound(imgData, left, finished)
	{
		let opts =
		{
			xSpacing: -10,
			startX: imgData.width - 30,
			startY: left.y,
			minX: 20,
			minY: left.y,
			maxY: left.y,
		};

		let lastPixel;

		Pixel.pipeImageData(imgData, (pixel) =>
		{
			if(typeof lastPixel !== "undefined" && !pixel.colorEquals(lastPixel))
			{
				this.__onFoundPDFRightBound(left, pixel, finished);
				return false;
			}

			lastPixel = pixel;
		}, opts);
	}

	__onFoundPDFRightBound(left, right, finished)
	{
		left.setVisible(true);
		left.setVisibleSize(10);

		right.setVisible(true);
		right.setVisibleSize(10);

		finished(left.x, right.x);
	}

	/*
		Calculates ctx.drawImage clip zone (sx, sy, sWidth, sHeight) based on
		a Zone on the page (x, y, width, height) and the desired image width/height

		The image used is this.__domElement and has different (usually greater) dimensions than
		(desiredWidth, desiredHeight)
	*/
	__getImageClipData(zone, desiredWidth, desiredHeight)
	{
		this.__ensureProcessed();

		let propX = zone.x / desiredWidth,
			propY = zone.y / desiredHeight;

		return {
			x: this.width * propX,
			y: this.height * propY,
			width: zone.width * (this.width / desiredWidth),
			height: zone.height * (this.height / desiredHeight),
		};
	}

	__createDOMElement(finished)
	{
		if(typeof finished === "undefined")
		{
			throw "__createDOMElement requires a finished callback";
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