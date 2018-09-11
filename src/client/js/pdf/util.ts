export function blobWithHeader(header: string, blob: Blob): Blob
{
    return new Blob([header.length.toString(), header, blob]);
}

export function objSize(obj: Object): number
{
    return Object.keys(obj).length;
}