interface BlueprintTag {
    id?: string
    name: string
}

interface Blueprint {
    id: number
    title: string
    includedTasks: string[]
    tags?: string[]
    namespace: string
    name: string
    description: string
    tasks: Array<{ id: string; type: string }>
    tags: Array<string>
    createdAt: string
    updatedAt: string
}

interface Window {
    dataLayer: Array<any>
    astroClientConfig: { slug: string }
    $bootstrap: { Modal: any; Collapse: any; Tooltip: any }
    __hsUserToken: string
    _hsq: Array<any>
}

interface Story {
    id: string
    title: string
    excerpt?: string
    description: string
    heroImage: string
    logo?: string
    logoDark?: string
    kpi1: string
    kpi2: string
    kpi3: string
    quote: string
    quotePerson: string
    quotePersonTitle: string
    industry: string
    headquarter: string
    solution: string
    tasks: string[]
    content: string
    companyName: string
    featuredImage: string
    whatNext?: string //TODO: in API
}

interface PluginInformation {
    name?: string
    subGroupTitle?: string
    className?: string
    elementCounts: number
    blueprints?: number
    title: string
    description?: string
    categories?: string[]
    icon?: string
    subGroup?: string
}

type KVNamespace = import("@cloudflare/workers-types").KVNamespace
type ENV = {
    ISR_CACHE: KVNamespace
}

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>

declare namespace App {
    interface Locals extends Runtime {
        // Add custom locals here
    }
}