import {Component, UpdateHandler} from "./core";

interface State
{
    error: string;
    attachedEventListener: boolean;
    loadNormally?: () => void;
}

const normalViewId: string = "understand-error-button";

export class PdfError extends Component<State>
{
    public constructor(u: UpdateHandler)
    {
        super(u);
        this.state = {error: "", attachedEventListener: false};
    }
    
    public onUpdate(prevState: State): void
    {
        
    }

    public toHTML(): string
    {
        return `<div class="understand-error-container">
            <div class="understand-error">
                <div class="understand-error-title">
                    There was an error loading this PDF
                </div>
                
                <div class="understand-error-text">
                    ${this.state.error}
                </div>

                <button id="${normalViewId}">Load Normally</button>
            </div>
        </div>`;
    }

    public postRender(): void
    {
        if(!this.state.attachedEventListener)
        {
            this.state.attachedEventListener = true;

            if(this.state.loadNormally)
            {
                document.getElementById(normalViewId)!.addEventListener("click", this.state.loadNormally);
            }
        }
    }
}