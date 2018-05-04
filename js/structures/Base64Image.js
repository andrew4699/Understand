"use strict";

class Base64Image
{
	constructor(data)
	{
		this.__data = data; // base64 with header included (data:base64,image/jpeg;+asidnflansln)
	}

	getInfo(finished)
	{
		if(this.__domElement)
		{
			if(typeof finished !== "undefined")
			{
				finished(this.__domElementMeta);
			}

			return this.__domElementMeta;
		}
		else
		{
			this.__createDOMElement(() =>
			{
				this.getInfo(finished)
			});
			
		}
	}

	splitIntoZones(zones, width, height, finished)
	{
		if(zones.length === 0)
		{
			throw "Zones was empty when splitting Base64Image into zones";
		}

		if(this.__domElement)
		{
			let parts = [];

			let canvas = document.createElement("canvas");
			canvas.width = zones[0].width;
			canvas.height = zones[0].height;

			document.body.appendChild(canvas);

			let ctx = canvas.getContext("2d");

			for(let i = 0; i < zones.length; i++)
			{
				let clipData = this.__getImageClipData(zones[i], width, height);
				ctx.drawImage(this.__domElement, clipData.x, clipData.y, clipData.width, clipData.height, 0, 0, canvas.width, canvas.height);
				parts.push(canvas.toDataURL());
			}

			finished(parts);
			return parts;
		}
		else
		{
			this.__createDOMElement(() =>
			{
				this.splitIntoZones(zones, width, height, finished);
			});
		}
	}

	scaleTo(width, height)
	{
		/* 
			TODO: HAVE .onProcessed AND getInfo IN THE CONSTRUCTOR
		alfnalkdsnfasasfd
		adsfknaksldfna
		adskfnalsdnfk
		asdlkfnasldnf
		adskfnlasdlf
		*/

		let canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		let ctx = canvas.getContext("2d");
		ctx.drawImage(this.__domElement)
	}

	/*
		Calculates the left and right X bounds for the PDF image

		finished should be a function(leftX, rightX)
	*/
	getPDFBounds(finished)
	{
		this.getInfo((info) =>
		{
			if(!this.__domElement)
			{
				throw "__domElement was undefined when trying to get PDF bounds";
			}

			let canvas = document.createElement("canvas");
			canvas.width = info.width;
			canvas.height = info.height;

			let ctx = canvas.getContext("2d");
			ctx.drawImage(this.__domElement, 0, 0);

			let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			
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
		});
	}

	__onFoundPDFLeftBound(imgData, left, finished)
	{
		console.log(left);

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
		/*console.log(left, right);

		let info = this.getInfo();

		let sPixel = left.scale(info.width, info.height, window.innerWidth, window.innerHeight);
		let s2Pixel = right.scale(info.width, info.height, window.innerWidth, window.innerHeight);
		sPixel.setVisible(true);
		sPixel.setVisibleSize(10);

		s2Pixel.setVisible(true);
		s2Pixel.setVisibleSize(10);*/
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
		if(!this.__domElement)
		{
			throw "__getImageClipData requires __domElement to be created";
		}

		let propX = zone.x / desiredWidth,
			propY = zone.y / desiredHeight;

		return {
			x: this.__domElementMeta.width * propX,
			y: this.__domElementMeta.height * propY,
			width: zone.width * (this.__domElementMeta.width / desiredWidth),
			height: zone.height * (this.__domElementMeta.height / desiredHeight),
		};
	}

	__createDOMElement(finished)
	{
		this.__domElement = new Image();
		this.__domElement.src = this.__data;

		this.__domElement.onload = () =>
		{
			this.__domElementMeta =
			{
				width: this.__domElement.width,
				height: this.__domElement.height,
			};

			finished();
		};
	}
}