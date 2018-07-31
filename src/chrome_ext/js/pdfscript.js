"use strict";

const SPLIT_ROWS = 1;
const SPLIT_COLS = 1;

let api;

function onLoad()
{
	if(window.location.href.slice(-4) !== ".pdf")
		return;

	api = new UnderstandAPI("THIS IS A TEST KEY MAKE SURE TO CHANGE IT");
	api.onconnect = scanPage;
	
	bindEvents();
}

function bindEvents()
{
	window.addEventListener("resize", onResize);
}

function onResize(event)
{
	console.log("resize", event);
}

function pipeImagePart(image, zone)
{
	console.log(image);

	api.recognize(image.getData(), function(response)
	{
		const zones = [];
		
		for(let i = 0; i < response.blocks.length; i++)
		{
			const width = response.blocks[i].bounds[1].x - response.blocks[i].bounds[0].x;
			const height = response.blocks[i].bounds[2].y - response.blocks[i].bounds[0].y;

			const zone = new TextZone(response.blocks[i].text,
									  response.blocks[i].bounds[0].x,
									  response.blocks[i].bounds[0].y,
									  width,
									  height);
			
			//zone.setVisible(true);
			zones.push(zone);
		}

		setSearchZones(zones);
	});
}

function scanPage()
{
	takeScreenshot(function(img)
	{
		img.scaleTo(window.innerWidth, window.innerHeight, function()
		{
			let zones = Zone.createFromArea(0, 0, window.innerWidth, window.innerHeight, SPLIT_ROWS, SPLIT_COLS);
			img.splitIntoZones(zones, true, pipeImagePart);
		});
	});
}

/* ============================
		BEGIN THE MADNESS
   ============================ */
setTimeout(onLoad, 2000);