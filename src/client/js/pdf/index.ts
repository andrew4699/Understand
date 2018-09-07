import App from "./app";

const _window = (window as any);

(function main()
{
    const options =
    {
        pdfUrl: getPDFUrl()
    };

    _window._UnderstandChromeApp = new App(options);
})();

function getPDFUrl(): string
{
    const url = new URL(window.location.href);
    const pdf = url.searchParams.get("pdf");

    if(!pdf)
    {
        throw new Error("No PDF could be extracted from the URL");
    }

    return pdf;
}