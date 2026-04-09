import type { Plugin } from "@kestra-io/ui-libs"

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

export interface Arborescence {
    name: string
    group: string
    title: string
    subGroups: Array<{ name: string; title: string; [k: string]: string | string[] }>
}

export interface BlueprintPreview {
    id: number
    title: string
    tags: string[]
    includedTasks: string[]
}

