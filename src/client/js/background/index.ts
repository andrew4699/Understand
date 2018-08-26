import {onInterceptPDF, RedirectFunction} from "./intercept";

onInterceptPDF(function(url: string): string
{
	return chrome.extension.getURL("moztest.html");
	//return chrome.extension.getURL("pdf.html?pdf=" + url);
	//return "https://google.com";
});