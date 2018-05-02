"use strict";

function takeScreenshot(finished)
{
	chrome.runtime.sendMessage({query: "takeScreenshot"}, function(response)
	{
		finished(new Base64Image(response.img));
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