import UnderstandAPI from "./lib/UnderstandAPI";
import GUI from "./gui/core";
import {ToastType, State as ToastState} from "./gui/components/toasts";
import {objSize} from "./util";

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
    scale: Scale;
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

interface DisplayMetrics
{
    pos: Position;
    size: Size;
}

type Position = [number, number]; // (x, y)
type Size = [number, number]; // (height, width)
type Scale = [number, number]; // (x-scale, y-scale)

const GUI_CONTAINER_ID = "understand-gui-container";
const GUI_INIT_DELAY = 150;
const MIN_IMG_SIZE = 10;

export default class App
{
    private gui: GUI;
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

        setTimeout(this.initGUI.bind(this), GUI_INIT_DELAY);
    }

    private initGUI(): void
    {
        const guiContainer = document.getElementById(GUI_CONTAINER_ID);

        if(!guiContainer)
        {
            throw new Error("Could not find container by id = " + GUI_CONTAINER_ID);
        }

        this.gui = new GUI(guiContainer);
        this.gui.setActiveComponent("toasts");
    }

    private addToast(type: ToastType, body: string): void
    {
        const state = this.gui.getState() as ToastState;
        state.toasts = state.toasts.concat({type, body});
        this.gui.setState(state);
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
        
        return Promise.resolve(content);
    }

    private registerText(loc: ImgData, textInfo: ImgText): void
    {
        console.log("register", loc, textInfo, this.textData[loc.page]);
        //const lastIdx = this.textData[page].divs.length - 1;
        //const el = this.textData[page].divs[lastIdx].cloneNode(true) as HTMLElement;
        const canvas: HTMLCanvasElement | null = document.getElementById("page" + loc.page) as HTMLCanvasElement | null;

        if(!canvas)
        {
            throw new Error("");
        }

        if(!canvas.parentElement)
        {
            throw new Error("");
        }

        const {pos, size} = calculateTextDisplayMetrics(canvas, loc, textInfo);
        console.log("metrics", pos, size);

        const el = document.createElement("div");
        el.innerText = textInfo.text;
        this.textData[loc.page].divs.push(el);

        el.style.top = pos[1] + "px";
        el.style.left = pos[0] + "px";

        const textLayer = document.querySelector(`.page[data-page-number="${loc.page}"] .textLayer`);

        if(!textLayer)
        {
            throw new Error("Text layer not found for page " + loc.page);
        }

        const lastChildIdx = textLayer.children.length - 1;
        textLayer.insertBefore(el, textLayer.children[lastChildIdx]);

        this.textData[loc.page].strings.push(textInfo.text);

        if(typeof this.extraText[loc.page] === "undefined")
        {
            this.extraText[loc.page] = [];
        }

        this.extraText[loc.page].push({size, text: textInfo.text});
        this.checkFinished();
    }

    private checkFinished(): void
    {
        if(objSize(this.imgData) === 1)
        {
            this.addToast(ToastType.SUCCESS, "All images have been processed");
        }
    }

    // Called when the PDF viewer renders an image
    // Begins the pipeline of converting the image to text
    public registerImage(img: Blob, page: number, pos: Position, size: Size, scale: Scale): void
    {
        if(page > 1) return;
        if(size[0] > MIN_IMG_SIZE && size[1] > MIN_IMG_SIZE)
        {
            console.log(img);
            const idx = this.api.recognize(img, this.onImageRecognized.bind(this));
            this.imgData[idx] = {page: page, pos, size, scale};
            console.log(img, page, pos, size, scale);
        }
    }   

    private onImageRecognized(data: ImgRecognizeResponse): void
    {
        const parts = data.parts;
        const rid = data.requestID;

        parts.forEach((part: ImgText) =>
        {
            setTimeout(() =>
            {
                this.registerText(this.imgData[rid], part);
                //delete this.imgData[rid];
            }, 5000);
        });

    }

    public getPdfUrl(): string
    {
        return this.options.pdfUrl;
    }
}

function calculateTextDisplayMetrics(canvas: HTMLCanvasElement, loc: ImgData, textInfo: ImgText): DisplayMetrics
{
    const dom = canvas.parentElement;
    
    if(!dom)
    {
        throw new Error("Canvas parentElement was null when calculating text display metrics");
    }
    
    const wRatio = dom.clientWidth / canvas.width;
    const hRatio = dom.clientHeight / canvas.height;

    const canvasImgOffset: Position =
    [
        wRatio * loc.pos[0],
        hRatio * loc.pos[1],
    ];

    const pos: Position =
    [
        wRatio * (canvasImgOffset[0] + (textInfo.bounds[0].x / loc.scale[0])),
        hRatio * (canvasImgOffset[1] + (textInfo.bounds[0].y / loc.scale[1]))
    ];

    //console.log("m", wRatio, canvasImgOffset[0], textInfo.bounds[0].x, loc.scale[0]);

    const size: Size =
    [
        textInfo.bounds[2].x - textInfo.bounds[0].x,
        textInfo.bounds[2].y - textInfo.bounds[0].y
    ];

    return {pos, size};
}