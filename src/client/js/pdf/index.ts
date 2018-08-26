import * as x from "./web/app";
/*import PDFViewer from "./viewer";

let viewer: PDFViewer;

document.addEventListener("DOMContentLoaded", function()
{
    const url = new URL(window.location.href);

    const container = document.getElementById("understand-pdf-viewer");
    const pdfUrl = url.searchParams.get("pdf");

    if(container && pdfUrl)
    {
        fetch(pdfUrl).then(response => response.blob()).then(function(blob)
        {
            PDFViewer.AwaitImports().then(function()
            {
                viewer = new PDFViewer(container, blob);
            });
        });
    }
});*/