import { cachedLoader } from "~/utils/search/loaders"

export type PreviewSection = "docs" | "blogs"

export type ContentPreviewPage = {
    title: string
    html: string
    assets: PreviewAssets
}

const pages = cachedLoader(async (path) => {
    const [section, ...id] = path.split("/")
    const url = `/${section}-preview/${id.join("/")}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${url} answered ${response.status}`)
    return previewPage(await response.text(), path)
})

const pathOf = (section: PreviewSection, id: string) => `${section}/${id}`

export const isContentPreviewLoaded = (section: PreviewSection, id: string) =>
    pages.isLoaded(pathOf(section, id))

export const loadContentPreview = (section: PreviewSection, id: string) =>
    pages.load(pathOf(section, id))

// Links in the fragment are relative to the page itself, not to the page the popup is open on.
export function pageLink(href: string, path: string, origin: string) {
    const url = new URL(href, `${origin}/${path}`)
    return url.origin === origin
        ? url.pathname + url.search + url.hash
        : url.href
}

export const youtubeVideoId = (src: string) =>
    src.match(/youtube(?:-nocookie)?\.com\/embed\/(?!videoseries)([\w-]+)/)?.[1]

function embedLink(page: Document, frame: Element) {
    const src = frame.getAttribute("src") ?? ""
    const videoId = youtubeVideoId(src)
    const link = page.createElement("a")
    link.target = "_blank"
    link.rel = "noopener"
    if (videoId) {
        link.className = "doc-video"
        link.href = `https://www.youtube.com/watch?v=${videoId}`
        link.innerHTML =
            `<img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="Watch the video" loading="lazy" />` +
            `<span class="doc-video-play" aria-hidden="true"></span>`
    } else {
        link.className = "doc-embed"
        link.href = src
        link.textContent =
            frame.getAttribute("title") ||
            new URL(src, window.location.origin).hostname
    }
    return link
}

export type PreviewAssets = {
    stylesheets: string[]
    scripts: string[]
    styles: string[]
}

const PREVIEW_STYLE_ATTR = "data-search-preview-style"

function previewAssets(page: Document): PreviewAssets {
    return {
        stylesheets: [
            ...page.querySelectorAll(
                'link[rel="stylesheet"][href^="/_astro/"]',
            ),
        ].map((link) => link.getAttribute("href") ?? ""),
        scripts: [...page.querySelectorAll('script[src^="/_astro/ec."]')].map(
            (script) => script.getAttribute("src") ?? "",
        ),
        styles: [...page.querySelectorAll("style")]
            .map((style) => style.textContent ?? "")
            .filter(Boolean),
    }
}

export function adoptPreviewAssets({
    stylesheets,
    scripts,
    styles,
}: PreviewAssets) {
    for (const href of stylesheets) {
        if (!document.querySelector(`link[href="${href}"]`)) {
            document.head.appendChild(
                Object.assign(document.createElement("link"), {
                    rel: "stylesheet",
                    href,
                }),
            )
        }
    }
    for (const src of scripts) {
        if (!document.querySelector(`script[src="${src}"]`)) {
            document.head.appendChild(
                Object.assign(document.createElement("script"), {
                    type: "module",
                    src,
                }),
            )
        }
    }
    const present = new Set(
        [...document.head.querySelectorAll(`style[${PREVIEW_STYLE_ATTR}]`)].map(
            (style) => style.textContent,
        ),
    )
    for (const css of styles) {
        if (present.has(css)) continue
        const style = document.createElement("style")
        style.setAttribute(PREVIEW_STYLE_ATTR, "")
        style.textContent = css
        document.head.appendChild(style)
    }
}

function sanitize(content: Element) {
    content
        .querySelectorAll("link, script, style")
        .forEach((element) => element.remove())
    for (const element of content.querySelectorAll("*")) {
        for (const { name, value } of [...element.attributes]) {
            if (name.startsWith("on") || /^\s*javascript:/i.test(value)) {
                element.removeAttribute(name)
            }
        }
    }
}

function previewPage(html: string, path: string): ContentPreviewPage {
    const page = new DOMParser().parseFromString(html, "text/html")
    const content = page.querySelector(".bd-content")
    if (!content) throw new Error(`The ${path} preview has no content`)
    const origin = window.location.origin

    const assets = previewAssets(page)
    sanitize(content)
    for (const link of content.querySelectorAll("a[href]")) {
        link.setAttribute(
            "href",
            pageLink(link.getAttribute("href") ?? "", path, origin),
        )
    }
    for (const media of content.querySelectorAll("img[src], source[src]")) {
        media.setAttribute(
            "src",
            pageLink(media.getAttribute("src") ?? "", path, origin),
        )
    }
    for (const frame of content.querySelectorAll("iframe")) {
        const embed = frame.closest(".video-container") ?? frame
        embed.replaceWith(embedLink(page, frame))
    }

    return {
        title: page.querySelector("h1")?.textContent?.trim() ?? "",
        html: content.innerHTML,
        assets,
    }
}
