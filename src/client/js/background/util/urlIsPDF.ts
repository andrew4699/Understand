export default function urlIsPDF(url: string): boolean
{
    const structuredUrl = new URL(url);
    return structuredUrl.pathname.endsWith(".pdf");
}