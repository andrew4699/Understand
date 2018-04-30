chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.query === "takeScreenshot")
	{
		chrome.tabs.captureVisibleTab(null, {}, function(img)
		{
			sendResponse({img});
		});
	
		return true;
	}
});