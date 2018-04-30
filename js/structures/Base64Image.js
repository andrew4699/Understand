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
			let info =
			{
				width: this.__domElement.width,
				height: this.__domElement.height
			};

			finished(info);
		}
		else
		{
			this.__createDOMElement(() =>
			{
				this.getInfo(finished)
			});
			
		}
	}

	splitIntoZones(zones, width, height)
	{
		if(zones.length === 0)
		{
			throw "Zones was empty when splitting Base64Image into zones";
		}

		if(this.__domElement)
		{
			let canvas = document.createElement("canvas");
			canvas.width = zones[0].width;
			canvas.height = zones[0].height;

			let ctx = canvas.getContext("2d");

			for(let i = 0; i < zones.length; i++)
			{
				let clipData = this.__getImageClipData(zones[i], width, height);
				ctx.drawImage(this.__domElement, clipData.x, clipData.y, clipData.width, clipData.height, 0, 0);
			}
		}
		else
		{
			this.__createDOMElement(() =>
			{
				this.splitIntoZones(zones, width, height);
			});
		}
	}

	__getImageClipData()
	{
		if(!this.__domElement)
		{
			throw "__getImageClipData requires __domElement to be created";
		}

		return {
			x: imgWidth * propX,
			y: imgHeight * propY,
			width: 
			height: 
		};
	}

	__createDOMElement(finished)
	{
		this.__domElement = new Image();
		this.__domElement.src = this.__data;

		this.__domElement.onload = function()
		{
			finished()
		};
	}
}