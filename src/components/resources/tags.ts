export const ALL_RESOURCES = "$all"

export type ResourceTag =
    | "infrastructure"
    | "data"
    | "ai"
    | "business"
    | "whitepapers"

export const resourceTabs = new Map<string, string>([
    [ALL_RESOURCES, "All resources"],
    ["infrastructure", "Infrastructure"],
    ["data", "Data"],
    ["ai", "AI"],
    ["business", "Business"],
    ["whitepapers", "Whitepapers"],
])

export const tagLabel: Record<ResourceTag, string> = {
    infrastructure: "Infrastructure",
    data: "Data",
    ai: "AI",
    business: "Business",
    whitepapers: "Whitepaper",
}

type TagTheme = { text: string; borderFrom: string; borderTo: string }

export const tagTheme: Record<ResourceTag, TagTheme> = {
    data: { text: "#59BCE6", borderFrom: "#59BCE6", borderTo: "#1F46F0" },
    ai: { text: "#3ADA7A", borderFrom: "#3ADA7A", borderTo: "#85FED1" },
    infrastructure: {
        text: "#E6C359",
        borderFrom: "#E6C359",
        borderTo: "#FFFEE9",
    },
    business: {
        text: "#F1934C",
        borderFrom: "#F1934C",
        borderTo: "#FFE8D1",
    },
    whitepapers: {
        text: "#C77CFF",
        borderFrom: "#C77CFF",
        borderTo: "#F0D1FF",
    },
}

export const tagStyle = (tag: ResourceTag) => {
    const t = tagTheme[tag]
    return `--tag-text: ${t.text}; --tag-border-from: ${t.borderFrom}; --tag-border-to: ${t.borderTo};`
}
