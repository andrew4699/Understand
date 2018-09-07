/*import UnderstandAPI from "./lib/UnderstandAPI";
import {Base64Image} from "./lib/Base64Image";
import Zone from "./lib/Zone";
import TextZone from "./lib/TextZone";
import {takeScreenshot} from "./utils";
import search from "./search/core";

const SPLIT_ROWS = 1;
const SPLIT_COLS = 1;

let api: UnderstandAPI;

function onLoad(): void
{
	if(window.location.href.slice(-4) !== ".pdf")
		return;

	api = new UnderstandAPI("THIS IS A TEST KEY MAKE SURE TO CHANGE IT");
	api.onconnect = scanPage;
	
	bindEvents();
}

function bindEvents(): void
{
	window.addEventListener("resize", onResize);
}

function onResize(event: Event): void
{
	console.log("resize", event);
}

function recognizeImage(image: Base64Image): void
{
	console.log(image);

	api.recognize(image.getData(), function(response)
	{
		const zones: TextZone[] = [];
		
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

		search.init(zones);
	});
}

function scanPage()
{
	takeScreenshot(function(img)
	{
		img.scaleTo(window.innerWidth, window.innerHeight, function()
		{
			recognizeImage(img);
		});
	});
}

/* ============================
		BEGIN THE MADNESS
   ============================ */
//setTimeout(onLoad, 2000);