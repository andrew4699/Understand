"use strict";

function takeScreenshot(finished)
{
	chrome.runtime.sendMessage({query: "takeScreenshot"}, function(response)
	{
		new Base64Image(response.img, function(img)
		{
			finished(img);
		});
	});
}

function toArray(val)
{
	if(!Array.isArray(val))
	{
		return [val];
	}
	else return val;
}