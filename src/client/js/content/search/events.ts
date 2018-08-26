type ShowCallback = (show: boolean) => void;
type InputCallback = (input: string) => void;

const KEY_F: number = 70;

export default class SearchEventHandler
{
    public handleShow(elem: HTMLElement, callback: ShowCallback): void
    {
        elem.addEventListener("keydown", function(event: KeyboardEvent): void
        {
            if(event.keyCode === KEY_F && event.ctrlKey)
            {
                //callback();
                /*let elem = searchBar.getDOMElement();

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
                }*/
            }
        });
    }

    public handleInput(elem: HTMLElement, callback: InputCallback): void
    {
        elem.addEventListener("keyup", function(event: KeyboardEvent): void
        {
            const value = (event.target as HTMLInputElement).value;
            callback(value);
        });
    }
}