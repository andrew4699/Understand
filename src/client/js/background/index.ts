import {onInterceptPDF, RedirectFunction} from "./intercept";

onInterceptPDF(function(url: string): string
{
	return chrome.extension.getURL("web/viewer.html?pdf=" + url);
	//return "https://google.com";
});