export interface Source {
    title: string
    url: string
    path: string
}

const KESTRA_PATTERNS = {
    docs: /\[([^\]]+)\]\(([^)]*\/docs\/[^)]+)\)/g,
    plugins: /\[([^\]]+)\]\(([^)]*\/plugins\/[^)]+)\)/g,
    blogs: /\[([^\]]+)\]\(([^)]*\/blogs\/[^)]+)\)/g,
}

function createPath(url: string, type: string): string {
    const pathPart = url.replace(/^(https:\/\/kestra\.io)?\/\w+\//, "")
    return `${type} > ${pathPart.replace(/\//g, " > ")}`
}

export function extractSourcesFromMarkdown(content: string): Source[] {
    const sources: Source[] = []

    Object.entries(KESTRA_PATTERNS).forEach(([type, regex]) => {
        let match
        while ((match = regex.exec(content)) !== null) {
            const [, title, url] = match
            const fullUrl = url.startsWith("/") ? `https://kestra.io${url}` : url
            sources.push({
                title: title.trim(),
                url: fullUrl,
                path: createPath(url, type),
            })
        }
    })

    return sources.filter(
        (source, index, self) => index === self.findIndex((s) => s.url === source.url),
    )
}

export function isInternalLink(url: string): boolean {
    return url.startsWith("/") || url.startsWith("#")
}