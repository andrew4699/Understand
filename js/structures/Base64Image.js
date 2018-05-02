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
			finished(this.__domElementMeta);
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