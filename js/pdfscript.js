"use strict";

const SPLIT_ROWS = 5;
const SPLIT_COLS = 5;

let api;

function onLoad()
{
	if(window.location.href.slice(-4) !== ".pdf")
		return;

	api = new UnderstandAPI("THIS IS A TEST KEY MAKE SURE TO CHANGE IT");
	console.log("load");
	
	bindEvents();
	scanPage();
}

function bindEvents()
{
	window.addEventListener("resize", onResize);
}

function onResize(event)
{
	console.log("resize", event);
}

function scanPage()
{
	takeScreenshot(function(img)
	{
		img.scaleTo(window.innerWidth, window.innerHeight);
		
		img.getPDFBounds(function(leftX, rightX)
		{
			console.log(leftX, rightX);

			let zones = Zone.createFromArea(window.innerWidth, window.innerHeight, SPLIT_ROWS, SPLIT_COLS);
			//console.log(zones);

			for(let i = 0; i < zones.length; i++)
			{
				//zones[i].setVisible(true);
			}

			/*img.splitIntoZones(zones, window.innerWidth, window.innerHeight, function(parts)
			{
				api.recognize(parts, function())
			});*/
		});
	});
}

/* ============================
		BEGIN THE MADNESS
   ============================ */
setTimeout(onLoad, 2000);