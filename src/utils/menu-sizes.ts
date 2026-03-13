type MenuSize = { width: string; height: string }

const menuSizes: Record<string, MenuSize> = {
    product:   {
        width: "305px",
        height: "260px"
    },
    solutions: {
        width: "782px",
        height: "240px"
    },
    resources: {
        width: "285px",
        height: "260px"
    },
}

export function menuSize(name: string): MenuSize {
    return menuSizes[name]
}