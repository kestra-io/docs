import { pluginGroup } from "~/utils/orchestrationLink"
import { $fetchApiCached } from "~/utils/fetch"

export interface ToolIndexEntry {
    name: string
    pluginClass: string
    count: number
    keywords?: string[]
}

const CORE_PREFIX = "io.kestra.plugin.core."

interface PluginListDef {
    name: string
    title?: string
    group?: string
    tasks?: PluginTaskDef[]
    triggers?: PluginTaskDef[]
    taskRunners?: PluginTaskDef[]
}

function keywordTokens(cls: string, group: string): string[] {
    const tokens = new Set<string>()
    const rest = cls.startsWith(`${group}.`)
        ? cls.slice(group.length + 1)
        : (cls.split(".").pop() ?? "")
    for (const segment of rest.split(".")) {
        tokens.add(segment.toLowerCase())
        for (const word of segment.split(/(?=[A-Z])/)) {
            if (word.length > 2) tokens.add(word.toLowerCase())
        }
    }
    return [...tokens]
}

export async function fetchToolIndex(
    blueprints: { includedTasks?: string[] }[],
): Promise<ToolIndexEntry[]> {
    let plugins: PluginListDef[] = []
    try {
        plugins = await $fetchApiCached<PluginListDef[]>("/plugins")
    } catch {
        return []
    }

    const entries: ToolIndexEntry[] = []
    for (const plugin of plugins) {
        const group = plugin.group
        if (!group || plugin.name === "core") continue

        const defs = [
            ...(plugin.tasks ?? []),
            ...(plugin.triggers ?? []),
            ...(plugin.taskRunners ?? []),
        ]
        const keywords = new Set<string>()
        for (const t of defs) {
            for (const token of keywordTokens(t.cls, group)) {
                keywords.add(token)
            }
        }

        let count = 0
        for (const bp of blueprints) {
            if (
                (bp.includedTasks ?? []).some((t) =>
                    t.startsWith(`${group}.`),
                )
            ) {
                count += 1
            }
        }

        entries.push({
            name: plugin.title ?? plugin.name,
            pluginClass: group,
            count,
            keywords: [...keywords],
        })
    }

    return entries.sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name),
    )
}

interface PluginTaskDef {
    cls: string
    deprecated?: boolean
}

interface PluginSubgroupDef {
    title: string
    subGroup?: string
    tasks?: PluginTaskDef[]
    triggers?: PluginTaskDef[]
    taskRunners?: PluginTaskDef[]
}

const PREFIXED_SIMPLE_NAMES = new Set([
    "Get",
    "Set",
    "Put",
    "Delete",
    "Trigger",
    "GetKeys",
])

export async function fetchCoreToolIndex(
    blueprints: { includedTasks?: string[] }[],
): Promise<ToolIndexEntry[]> {
    let subgroups: PluginSubgroupDef[] = []
    try {
        subgroups = await $fetchApiCached<PluginSubgroupDef[]>(
            "/plugins/subgroups",
        )
    } catch {
        return []
    }

    const countByClass = new Map<string, number>()
    for (const bp of blueprints) {
        for (const cls of new Set(bp.includedTasks ?? [])) {
            if (!cls.startsWith(CORE_PREFIX)) continue
            countByClass.set(cls, (countByClass.get(cls) ?? 0) + 1)
        }
    }

    const entries: ToolIndexEntry[] = []
    const seen = new Set<string>()
    for (const sg of subgroups) {
        if (!sg.subGroup?.startsWith(CORE_PREFIX)) continue
        const defs = [
            ...(sg.tasks ?? []),
            ...(sg.triggers ?? []),
            ...(sg.taskRunners ?? []),
        ]
        for (const t of defs) {
            if (t.deprecated || !t.cls.startsWith(CORE_PREFIX)) continue
            if (seen.has(t.cls)) continue
            seen.add(t.cls)
            const simple = t.cls.split(".").pop() ?? t.cls
            entries.push({
                name: PREFIXED_SIMPLE_NAMES.has(simple)
                    ? `${sg.title} ${simple}`
                    : simple,
                pluginClass: t.cls,
                count: countByClass.get(t.cls) ?? 0,
            })
        }
    }

    return entries.sort(
        (a, b) => b.count - a.count || a.name.localeCompare(b.name),
    )
}

export function blueprintUsesTool(
    blueprint: { includedTasks?: string[] },
    toolPluginClass: string,
): boolean {
    if (toolPluginClass.startsWith(CORE_PREFIX)) {
        return (blueprint.includedTasks ?? []).includes(toolPluginClass)
    }
    const lastSegment = toolPluginClass.split(".").pop() ?? ""
    const isGroup = /^[a-z]/.test(lastSegment)
    const group = isGroup ? toolPluginClass : pluginGroup(toolPluginClass)
    return (blueprint.includedTasks ?? []).some(
        (t) => t === group || t.startsWith(`${group}.`),
    )
}
