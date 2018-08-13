import {Base64Image, ImageProcessedHandler} from "./lib/Base64Image";

export function takeScreenshot(finished: ImageProcessedHandler): void
{
	chrome.runtime.sendMessage({query: "takeScreenshot"}, function(response)
	{
		new Base64Image(response.img, finished);
	});
}

export function toArray<T>(val: T): T[]
{
	if(!Array.isArray(val))
	{
		return [val];
	}
	else return val;
}