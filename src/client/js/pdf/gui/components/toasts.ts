import {Component, UpdateHandler} from "./core";

export enum ToastType
{
    INFO = 1,
    SUCCESS = 2,
    ERROR = 3,
}

interface Toast
{
    type: ToastType;
    body: string;
    removalQueued?: boolean;
}

export declare interface State
{
    toasts: Toast[];
}

const TOAST_REMOVAL_TIME = 3000;

export class Toasts extends Component<State>
{
    public constructor(u: UpdateHandler)
    {
        super(u);
        this.state = {toasts: []};
    }

    private queueToastRemoval(toast: Toast): void
    {
        toast.removalQueued = true;

        setTimeout(() =>
        {
            this.removeToast(toast);
        }, TOAST_REMOVAL_TIME);
    }

    private removeToast(toast: Toast): void
    {
        const idx = this.state.toasts.indexOf(toast);

        if(idx === -1)
        {
            throw new Error("Failed to remove toast. Possible re-use of Toast object.");
        }

        const newToasts = this.state.toasts.slice();
        newToasts.splice(idx, 1);
        this.setState({toasts: newToasts});
    }
    
    public onUpdate(prevState: State): void
    {
        // Queue new toasts for removal
        for(let i = 0; i < this.state.toasts.length; i++)
        {
            if(!this.state.toasts[i].removalQueued)
            {
                this.queueToastRemoval(this.state.toasts[i]);
            }
        }
    }

    public toHTML(): string
    {
        const toasts: string = this.state.toasts.map(function(t: Toast)
        {
            return `<div class="understand-toast">
                <div class="understand-toast-icon">
                    ${getToastIcon(t.type)}
                </div>

                <div class="understand-toast-body">
                    ${t.body}
                </div>
            </div>`;
        }).join("");

        return `<div class="understand-toasts">
            ${toasts}
        </div>`;
    }
}

function getToastIcon(type: ToastType): string
{
    switch(type)
    {
        case ToastType.INFO:
        {
            return `<div class="understand-icon-info">
                <svg class="understand-icon understand-icon-cloud-check"><use xlink:href="#icon-cloud-check"></use></svg>
            </div>`;
        }

        case ToastType.SUCCESS:
        {
            return `<div class="understand-icon-success">
                <svg class="understand-icon understand-icon-cloud-check"><use xlink:href="#icon-cloud-check"></use></svg>
            </div>`;
        }

        case ToastType.ERROR:
        {
            return `<div class="understand-icon-error">
                <svg class="understand-icon understand-icon-cloud-check"><use xlink:href="#icon-cloud-check"></use></svg>
            </div>`;
        }

        default:
        {
            return "";
        }
    }
}