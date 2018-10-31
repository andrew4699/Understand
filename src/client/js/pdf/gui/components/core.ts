export declare type UpdateHandler = () => void;

export declare interface Component<T extends Object>
{
    onUpdate?(prevState: T): void;
    postRender?(): void;
}

export abstract class Component<T extends Object>
{
    protected state: T;
    private updateHandler: UpdateHandler;

    public constructor(updateHandler: UpdateHandler)
    {
        this.state = {} as T;
        this.updateHandler = updateHandler;
    }

    public setState(state: T)
    {
        const prevState: T = this.state;
        this.state = Object.assign({}, state);

        if(this.onUpdate)
        {
            this.onUpdate(prevState);
        }

        this.updateHandler();
    }

    public getState(): T
    {
        return Object.assign({}, this.state);
    }

    public abstract toHTML(): string;
}