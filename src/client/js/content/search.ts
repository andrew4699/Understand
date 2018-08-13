import SearchBar from "./lib/SearchBar";
import TextZone from "./lib/TextZone";

const KEY_F = 70;

const SEARCH_UI_NONE = 0;
const SEARCH_UI_CUSTOM = 1;
const SEARCH_UI_STD = 2;

let searchUI = SEARCH_UI_NONE;
const searchBar = new SearchBar();
let searchZones: TextZone[] = [];

// handle searching
function search(text: string): void
{
    const lowerText = text.toLowerCase();

    for(let i = 0; i < searchZones.length; i++)
    {
        const zoneText = searchZones[i].getText().toLowerCase();
        const found = zoneText.indexOf(lowerText) > -1;
        searchZones[i].setVisible(found);
    }
}

// handle data
export function setSearchZones(zones: TextZone[]): void
{
    searchZones = zones;
}

// handle opening/closing the search bar
document.addEventListener("keydown", function(event)
{
    if(event.keyCode === KEY_F && event.ctrlKey)
    {
        let elem = searchBar.getDOMElement();

        if(event.target === elem)
        {
            searchBar.setVisible(false);
        }
        else
        {
            searchBar.setVisible(true);
            elem = searchBar.getDOMElement(); // if set to visible for the first time, the elem. just got created
            
            if(elem)
            {
                elem.focus();
            }

            // prevent default search dialog
            event.preventDefault();
        }
    }
});

// handle input
document.addEventListener("keyup", function(event)
{
    const elem = searchBar.getDOMElement();

    if(event.target === elem)
    {
        const value = (event.target as HTMLInputElement).value;
        search(value);
    }
});