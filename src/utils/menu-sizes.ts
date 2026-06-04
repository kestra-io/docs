type MenuSize = { width: string; height: string }

const menuSizes: Record<string, MenuSize> = {
    product:   {
        width: "305px",
        height: "228px"
    },
    solutions: {
        width: "782px",
        height: "340px"
    },
    resources: {
        width: "285px",
        height: "310px"
    },
    company: {
        width: "305px",
        height: "228px"
    },
}

export function menuSize(name: string): MenuSize {
    return menuSizes[name]
}