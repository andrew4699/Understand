// Importing pdfjs with pdf_viewer was a huge pain
let pdfjs: any,
    pdfViewer: any;

let importsFinished = import("pdfjs-dist").then(function(lib)
{
    pdfjs = lib;
    (window as any)["pdfjs-dist/build/pdf"] = lib;
    
    return import("pdfjs-dist/web/pdf_viewer").then(function(viewer)
    {
        pdfViewer = viewer;
    });
});

export default class PDFViewer
{
    private viewer: any;
    
    constructor(container: HTMLElement, pdf: Blob)
    {
        this.viewer = new pdfViewer.PDFViewer({container});
        console.log(this.viewer);
        
        const reader = new FileReader();
        reader.readAsDataURL(pdf);
        
        reader.onload = () => this.onDataRead(reader.result as string);
    }

    public static AwaitImports()
    {
        return importsFinished;
    }

    private onDataRead(pdf: string): void
    {
        const data = pdf.replace("data:application/pdf;", "");

        /*const data = atob('JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
        'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
        'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
        'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
        'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
        'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
        'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
        'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
        'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
        'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
        'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
        'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
        'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');*/
        
        console.log(data);

        pdfjs.getDocument({url: "http://www.orimi.com/pdf-test.pdf"}).promise.then((doc: any) =>
        {
            console.log(doc);
            this.viewer.setDocument(doc);
        });
    }
}