import urlIsPDF from "./util/urlIsPDF";
import { URL_IGNORE_PARAM_KEY, URL_IGNORE_PARAM_VAL } from "../common/ignore_url";

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
                if(urlIsPDF(request.url) && !isURLIgnored(request.url))
                {
                    return {redirectUrl: callback(request.url)};
                }
            }
        }
    }

    // CLicked the extension icon
    chrome.browserAction.onClicked.addListener(function(tab)
    {
        if(tab.url)
        {
            chrome.tabs.update({url: callback(tab.url)});
        }
    });

    // Intercept web requests
    chrome.webRequest.onBeforeRequest.addListener(interceptRequest,
        {
            urls: ["*://*/*", "file://*/*"]
        },
        ['blocking']
    );
}

function isURLIgnored(url: string): boolean
{
    const urlData = new URL(url);
    return urlData.searchParams.get(URL_IGNORE_PARAM_KEY) === URL_IGNORE_PARAM_VAL;
}