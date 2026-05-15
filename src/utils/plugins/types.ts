import type { Plugin } from "./plugin"

export interface TocLink {
    id: string
    depth: number
    text: string
    children?: TocLink[]
}

export interface PluginPage {
    body: {
        group?: string
        plugins?: Plugin[]
        toc?: { links: TocLink[] }
        jsonSchema?: unknown
    }
    title?: string
    description?: string
    longDescription?: string
}

export interface PluginPageWithToc extends PluginPage {
    body: {
        toc: { links: TocLink[] }
    } & PluginPage["body"]
}

export interface BlueprintPreview {
    id: number
    title: string
    tags: string[]
    includedTasks: string[]
}

