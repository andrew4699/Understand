import urlIsPDF from "./util/urlIsPDF";

export declare type RedirectFunction = (url: string) => void;

type InterceptCallback = (url: string) => string;
type ChromeWebRequest = any;
type ChromeWebRequestRedirect = any;

export function onInterceptPDF(callback: InterceptCallback): void
{
    function interceptRequest(request: ChromeWebRequest): ChromeWebRequestRedirect | undefined
    {
        if(request && request.url)
        {
            if(request.type === "main_frame") // new page/site is loading in main window
            {
                if(urlIsPDF(request.url))
                {
                    return {redirectUrl: callback(request.url)};
                }
            }
        }
    }

    chrome.webRequest.onBeforeRequest.addListener(interceptRequest, {urls: ["*://*/*"]}, ['blocking']);
}