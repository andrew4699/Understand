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
		let zones = Zone.createFromArea(window.innerWidth, window.innerHeight, SPLIT_ROWS, SPLIT_COLS);
		/*console.log(zones);

		for(let i = 0; i < zones.length; i++)
		{
			zones[i].setVisible(false);
		}*/

		let parts = img.splitIntoZones(zones, window.innerWidth, window.innerHeight);
		console.log(parts);
	});
}

/* ============================
		BEGIN THE MADNESS
   ============================ */
onLoad();