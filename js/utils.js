function takeScreenshot(finished)
{
	chrome.runtime.sendMessage({query: "takeScreenshot"}, function(response)
	{
		finished(new Base64Image(response.img));
	});
}