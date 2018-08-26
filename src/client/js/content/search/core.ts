import HTMLSearchBar from "../lib/SearchBar";
import TextZone from "../lib/TextZone";
import SearchEventHandler from "./events";

type PageContent = any;

const SEARCH_UI_NONE = 0;
const SEARCH_UI_CUSTOM = 1;
const SEARCH_UI_STD = 2;

let searchUI = SEARCH_UI_NONE;
let searchZones: TextZone[] = [];

class Search
{
    private content: PageContent;
    private element: HTMLSearchBar;
    private eventHandler: SearchEventHandler;

    public init(content: PageContent)
    {
        this.element = new HTMLSearchBar();
        this.element.createDOMElement();

        this.content = content;

        this.eventHandler = new SearchEventHandler();
        //this.eventHandler.handleShow(document, this.handleShow.bind(this));
        this.eventHandler.handleInput(this.element.getDOMElement()!, this.handleInput.bind(this));
    }

    private handleShow(show: boolean): void
    {
        this.element.setVisible(show);
    }

    private handleInput(text: string): void
    {
        console.log("input", text);

        const lowerText = text.toLowerCase();

        for(let i = 0; i < searchZones.length; i++)
        {
            const zoneText = searchZones[i].getText().toLowerCase();
            const found = zoneText.indexOf(lowerText) > -1;
            searchZones[i].setVisible(found);
        }
    }
}

const searchSingleton = new Search();
export default searchSingleton;