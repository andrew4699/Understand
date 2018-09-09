import UnderstandAPI from "./lib/UnderstandAPI";

interface AppOptions
{
    pdfUrl: string;
}

interface ImgText
{
    text: string;
    bounds: ImgBound[]; // always 4 bounds
}

interface ImgData
{
    page: number;
    pos: Position;
    size: Size;
    text?: string;
}

interface ExtraText
{
    size: Size;
    text: string;
}

interface ExtraTextList
{
    [page: number]: ExtraText[];
}

interface ImgRecognizeResponse
{
    parts: ImgText[];
    requestID: number;
}

interface ImgBound
{
    x: number;
    y: number;
}

interface ProcessedImages
{
    // key is not actually a string, its an Image
    [img: string]: boolean;
}

interface PdfTextData
{
    [page: number]: PdfTextItems;
}

interface PdfTextItems
{
    divs: HTMLElement[];
    strings: string[];
}

type Position = [number, number]; // (x, y)
type Size = [number, number]; // (height, width)

const MIN_IMG_SIZE = 10;

export default class App
{
    private api: UnderstandAPI;
    private options: AppOptions;
    private imgData: ImgData[];
    private extraText: ExtraTextList;

    private processedImages: ProcessedImages;
    private textData: PdfTextData;
    
    constructor(options: AppOptions)
    {
        this.api = new UnderstandAPI("todo ADD AN API key plz");
        this.options = options;
        this.imgData = [];
        this.extraText = {};

        this.processedImages = {};
        this.textData = {};
    }

    public wasImageProcessed(img: string): boolean
    {
        return typeof this.processedImages[img] !== "undefined";
    }

    public setImageProcessed(img: string): void
    {
        this.processedImages[img] = true;
    }

    public setTextData(page: number, divs: HTMLElement[], strings: string[]): void
    {
        this.textData[page] = {divs, strings};
    }

    // Middleware for getting the text content on a page
    // Used for adding custom text elements to the search
    public hookGetTextContent(page: number, content: any)
    {
        if(typeof this.extraText[page] !== "undefined")
        {
            this.extraText[page].forEach(function(e: ExtraText): void
            {
                const cpy =
                {
                    initialized: false,
                    str: e.text,
                    width: e.size[0],
                    height: e.size[1],
                    vertical: false,
                    lastAdvanceWidth: 0,
                    lastAdvanceHeight: 0,
                    textAdvanceScale: 0,
                    spaceWidth: 0,
                    fakeSpaceMin: Infinity,
                    fakeMultiSpaceMin: Infinity,
                    fakeMultiSpaceMax: -0,
                    textRunBreakAllowed: false,
                    transform: null,
                    fontName: null
                };
                
                content.items.push(cpy);
            });
        }
        
        //console.log("itms", content.items);
        return Promise.resolve(content);
    }

    private registerText(page: number, origin: Position, size: Size, data: ImgText): void
    {
        console.log("register", page, origin, data, this.textData[page]);
        //const lastIdx = this.textData[page].divs.length - 1;
        //const el = this.textData[page].divs[lastIdx].cloneNode(true) as HTMLElement;
        const canvas: HTMLCanvasElement | null = document.getElementById("page" + page) as HTMLCanvasElement | null;

        if(!canvas)
        {
            throw new Error("");
        }

        if(!canvas.parentElement)
        {
            throw new Error("");
        }

        const widthRatio = (canvas.parentElement.clientWidth / canvas.width),
              heightRatio = (canvas.parentElement.clientHeight / canvas.height);

        const adjustedOrigin: Position = [
            origin[0] * widthRatio,
            origin[1] * heightRatio,
        ];

        /*const domRelativePosition: Position = [
            adjustedOrigin[0] + (data.bounds[0].x * (1 / widthRatio)),
            adjustedOrigin[1] + (data.bounds[0].y * (1 / heightRatio)),
        ];*/

        console.log(data.bounds[0].x, size[0], canvas.parentElement.clientWidth, adjustedOrigin[0]);
        const domRelativePosition: Position = [
            ((data.bounds[0].x / size[0]) * canvas.parentElement.clientWidth) - (adjustedOrigin[0] / 2),
            ((data.bounds[0].y / size[1]) * canvas.parentElement.clientHeight) - (adjustedOrigin[1] / 2),
        ];

        const ssize: Size = [
            (data.bounds[2].x - data.bounds[0].x) * (1 / widthRatio),
            (data.bounds[2].y - data.bounds[0].y) * (1 / heightRatio),
        ];

        console.log(adjustedOrigin, domRelativePosition, size, [widthRatio, heightRatio], canvas.parentElement)

        const el = document.createElement("div");
        el.innerText = data.text;
        this.textData[page].divs.push(el);

        el.style.top = domRelativePosition[1] + "px";
        el.style.left = domRelativePosition[0] + "px";

        const textLayer = document.querySelector(`.page[data-page-number="${page}"] .textLayer`);

        if(!textLayer)
        {
            throw new Error("Text layer not found for page " + page);
        }

        const lastChildIdx = textLayer.children.length - 1;
        textLayer.insertBefore(el, textLayer.children[lastChildIdx]);

        this.textData[page].strings.push(data.text);

        if(typeof this.extraText[page] === "undefined")
        {
            this.extraText[page] = [];
        }

        this.extraText[page].push({size, text: data.text})
    }

    // Called when the PDF viewer renders an image
    // Begins the pipeline of converting the image to text
    public registerImage(img: Blob, page: number, pos: Position, size: Size): void
    {
        if(page > 1) return;
        if(size[0] > MIN_IMG_SIZE && size[1] > MIN_IMG_SIZE)
        {
            console.log(img);
            const idx = this.api.recognize(img, this.onImageRecognized.bind(this));
            this.imgData[idx] = {page: page, pos, size};
            console.log(img, page, pos, size);
        }
    }   

    private onImageRecognized(data: ImgRecognizeResponse): void
    {
        const parts = data.parts;
        const rid = data.requestID;

        const {page, pos, size} = this.imgData[rid];

        parts.forEach((part: ImgText) =>
        {
            setTimeout(() =>
            {
                this.registerText(page, pos, size, part);
            }, 5000);
        });
    }

    public getPdfUrl(): string
    {
        return this.options.pdfUrl;
    }
}