export function sanitizeForMarkdown(str: string): string {
    return str
        .replace(/(```)(?:bash|yaml|js|console|json)(\n) *([\s\S]*?```)/g, "$1$2$3")
        .replace(/(?<!:):(?![: /])/g, ": ")
}
