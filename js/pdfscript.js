"use strict";

const SPLIT_ROWS = 3;
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

	image.scaleTo(image.width * 4, image.height * 4, function()
	{
		api.recognize(image.getData(), function(response)
		{
			console.log(response);
			zone.setVisible(true);
		});
	});
}

function scanPage()
{
	takeScreenshot(function(img)
	{
		img.scaleTo(window.innerWidth, window.innerHeight, function()
		{
			img.getPDFBounds(function(leftX, rightX)
			{
				console.log(leftX, rightX);

				let zones = Zone.createFromArea(leftX, 0, rightX, window.innerHeight, SPLIT_ROWS, SPLIT_COLS);

				for(let i = 0; i < zones.length; i++)
				{
					//zones[i].setVisible(true);
				}

				img.splitIntoZones(zones, true, pipeImagePart);
			});
		});
	});
}

/* ============================
		BEGIN THE MADNESS
   ============================ */
setTimeout(onLoad, 2000);