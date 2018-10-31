import UnderstandAPI from "./lib/UnderstandAPI";
import GUI from "./gui/core";
import {ToastType, State as ToastState} from "./gui/components/toasts";
import {objSize, strToInt} from "./util";
import { URL_IGNORE_PARAM_KEY, URL_IGNORE_PARAM_VAL } from "../common/ignore_url";

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

interface PerPage<T>
{
    [page: number]: T;
}

interface PdfAddition
{
    loc: ImgData;
    textInfo: ImgText;
    el?: HTMLDivElement; 
}

interface PdfLoadingError
{
    name: string;
    message: string;
}

type Position = [number, number]; // (x, y)
type Size = [number, number]; // (height, width)
type Scale = [number, number]; // (x-scale, y-scale)
type Timer = number;
type PDFFindController = any;

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
    
    private textDivs: HTMLDivElement[][];
    private textStrings: string[][];
    private originalTextItems: number;
    private findController: PDFFindController;

    private cachedCanvas: PerPage<HTMLCanvasElement>;
    private viewerScale: number;
    private updateTimeout?: Timer;
    private additions: PerPage<PdfAddition[]>;

    private processedImages: ProcessedImages;
    
    constructor(options: AppOptions)
    {
        this.api = new UnderstandAPI("todo ADD AN API key plz");
        this.options = options;
        this.imgData = [];
        this.extraText = {};
        this.cachedCanvas = {};
        this.additions = {};
        this.textDivs = [];
        this.textStrings = [];
        this.originalTextItems = 0;
        this.viewerScale = 1;

        this.processedImages = {};

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
        const toasts = state.toasts.concat({type, body});
        this.gui.setState({toasts});
    }

    public onPdfUpdate(scale: number): void
    {
        if(this.viewerScale !== scale)
        {
            this.viewerScale = scale;
            
            if(this.updateTimeout)
            {
                clearTimeout(this.updateTimeout);
            }

            this.updateTimeout = setTimeout(() =>
            {
                this.updateTimeout = undefined;
                this.cachedCanvas = {};
                this.textDivs.length = this.originalTextItems;
                this.textStrings.length = this.originalTextItems;
                this.reinitializeDOM();
            }, 1500);
        }
    }

    private reinitializeDOM(): void
    {
        for(let pg in this.additions)
        {
            if(!this.additions[pg])
            {
                continue;
            }

            const pgNum = strToInt(pg);

            for(let i = 0; i < this.additions[pg].length; i++)
            {
                this.initText(pgNum, i);
                this.updateDOMElement(pgNum, i);
            }
        }
    }

    private updateDOMElement(page: number, idx: number): void
    {
        // Find canvas for the page
        let canvas: HTMLCanvasElement | null = this.cachedCanvas[page];

        if(!canvas)
        {
            canvas = document.getElementById("page" + page) as HTMLCanvasElement;
            
            if(!canvas)
            {
                throw new Error("");
            }

            this.cachedCanvas[page] = canvas;
        }

        if(!canvas.parentElement)
        {
            throw new Error("");
        }

        // Update DOM element
        const {el, loc, textInfo} = this.additions[page][idx];
        const {pos, size} = calculateTextDisplayMetrics(canvas, loc, textInfo, this.viewerScale);
        console.log("metrics", pos, size, this.viewerScale);
        
        if(!el)
        {
            throw new Error("Attempted to update non-existing DOM element (page = " + page + ", idx = " + idx +  ")");
        }

        // Position
        el.style.top = pos[1] + "px";
        el.style.left = pos[0] + "px";

        // Size
        const scaleX = size[0] / el.clientWidth;
        const scaleY = size[1] / el.clientHeight;
        el.style.transform = "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
    }

    public wasImageProcessed(img: string): boolean
    {
        return typeof this.processedImages[img] !== "undefined";
    }

    public setImageProcessed(img: string): void
    {
        this.processedImages[img] = true;
    }

    public setFindController(f: PDFFindController): void
    {
        console.log("FIND CONTROLLER", f);
        this.findController = f;
    }

    public setTextData(page: number, divs: HTMLDivElement[], strings: string[]): void
    {
        console.log("setTextData", divs, strings);
        this.textDivs[page] = divs;
        this.textStrings[page] = strings;
        this.originalTextItems = divs.length;
    }

    // Middleware for getting the text content on a page
    // Used for adding custom text elements to the search
    public hookGetTextContent(page: number, content: any)
    {
        if(typeof this.additions[page] !== "undefined")
        {
            this.additions[page].forEach((e: PdfAddition): void =>
            {
                const cpy =
                {
                    initialized: false,
                    str: e.textInfo.text,
                    width: e.loc.size[0] * this.viewerScale,
                    height: e.loc.size[1] * this.viewerScale,
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

    // Creates the DOM element and appends the text string & div to the PDF viewer list
    private initText(page: number, idx: number): void
    {
        const {loc, textInfo} = this.additions[page][idx];

        // Create text element
        const el = document.createElement("div");
        el.innerText = textInfo.text;
        
        this.additions[page][idx].el = el;
        
        // Store in PDF viewer
        this.textDivs[loc.page].push(el);
        this.textStrings[loc.page].push(textInfo.text);

        const textLayer = document.querySelector(`.page[data-page-number="${loc.page}"] .textLayer`);

        if(!textLayer)
        {
            throw new Error("Text layer not found for page " + loc.page);
        }
        
        const lastChildIdx = textLayer.children.length - 1;
        textLayer.insertBefore(el, textLayer.children[lastChildIdx]);
    }

    private clearFindControllerCache(): void
    {
        this.findController.startedTextExtraction = false;
        this.findController.dirtyMatch = true;
    }

    private registerText(loc: ImgData, textInfo: ImgText): void
    {
        console.log("register", loc, textInfo);
        const canvas: HTMLCanvasElement | null = document.getElementById("page" + loc.page) as HTMLCanvasElement | null;

        if(!canvas)
        {
            throw new Error("");
        }

        if(!canvas.parentElement)
        {
            throw new Error("");
        }
        
        // Add space to make phrases search-able
        textInfo.text += " ";

        // Store this addition for later
        const data: PdfAddition =
        {
            loc,
            textInfo,
        };
        
        if(typeof this.additions[loc.page] === "undefined") // first addition on this page
        {
            this.additions[loc.page] = [];
        }

        this.additions[loc.page].push(data);
        
        // Update search results
        if(this.findController)
        {
            this.clearFindControllerCache();
        }

        const idx = this.additions[loc.page].length - 1;

        this.initText(loc.page, idx);
        this.updateDOMElement(loc.page, idx);
        //this.checkFinished();
    }

    private checkFinished(): void
    {
        if(objSize(this.imgData) === 1)
        {
            this.addToast(ToastType.SUCCESS, "All images have been processed");
        }
    }

    // Set the "Ignore Understand" param and reload the URL
    private loadNormally(): void
    {
        const pdfUrl = this.getPdfUrl();
        const redirect = new URL(pdfUrl);
        redirect.searchParams.set(URL_IGNORE_PARAM_KEY, URL_IGNORE_PARAM_VAL);
        window.location.href = redirect.href;
    }

    // Called when the PDF viewer receives an error while loading
    public onLoadingError(error: PdfLoadingError): void
    {
        this.gui.setActiveComponent("error");
        this.gui.setState({error, loadNormally: this.loadNormally.bind(this)});

    }

    // Called when the PDF viewer renders an image
    // Begins the pipeline of converting the image to text
    public registerImage(img: Blob, page: number, pos: Position, size: Size, scale: Scale): void
    {

        if(page > 1) return; // TODO: make sure to remove this

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

function calculateTextDisplayMetrics(canvas: HTMLCanvasElement, loc: ImgData, textInfo: ImgText, viewerScale: number): DisplayMetrics
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
        loc.pos[0],
        loc.pos[1],
    ];

    const pos: Position =
    [
        viewerScale * wRatio * (canvasImgOffset[0] + (textInfo.bounds[0].x / loc.scale[0])),
        viewerScale * hRatio * (canvasImgOffset[1] + (textInfo.bounds[0].y / loc.scale[1])),
    ];

    //console.log("m", wRatio, canvasImgOffset[0], textInfo.bounds[0].x, loc.scale[0]);

    const size: Size =
    [
        viewerScale * (textInfo.bounds[2].x - textInfo.bounds[0].x),
        viewerScale * (textInfo.bounds[2].y - textInfo.bounds[0].y),
    ];

    return {pos, size};
}