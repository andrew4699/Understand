import {onInterceptPDF, RedirectFunction} from "./intercept";

onInterceptPDF(function(url: string): string
{
	const enc = encodeURI(url);
	return chrome.extension.getURL("web/viewer.html?pdf=" + enc);
});