import {onInterceptPDF, RedirectFunction} from "./intercept";

chrome.extension.isAllowedFileSchemeAccess(console.info);

onInterceptPDF(function(url: string): string
{
	const enc = encodeURI(url);
	return chrome.extension.getURL("web/viewer.html?pdf=" + enc);
});