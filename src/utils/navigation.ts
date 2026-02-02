export interface NavItem {
    path?: string
    title?: string
    sidebarTitle?: string
    children?: NavItem[]
    isSection?: boolean
    isPage?: boolean
    group?: string
}

export function prevNext(
    navigation: NavItem[],
    path: string,
): { prev: NavItem | null | undefined; next: NavItem | null | undefined } {
    let prev: NavItem | undefined
    let next: NavItem | undefined
    let found = false

    const recursiveFetch = (current: NavItem) => {
        if (current.children) {
            for (const item of current.children.filter((item) => item.path !== current.path)) {
                if (next && prev) {
                    break
                }

                if (found && !next && !item.isSection) {
                    next = item
                }

                if (item.path === path) {
                    found = true
                }

                if (!found && !item.isSection) {
                    prev = item
                }

                recursiveFetch(item)
            }
        }
    }

    recursiveFetch(navigation[0])

    if (!found) {
        // we're at a section's root
        prev = undefined
        next = navigation[0].children?.[1]
    } else if (prev === undefined) {
        prev = navigation[0]
    }

    if (prev && !prev.path && prev === navigation[0]) {
        prev = { ...prev, path: "/docs", title: prev.title ?? "Docs" }
    }

    return { prev, next }
}

export const recursivePages = (item: NavItem): string[] => {
    const paths: string[] = []
    if (item?.isPage ?? item) {
        paths.push(item.path!)
    }
    if (item?.children) {
        paths.push(
            ...item.children.flatMap((child) => {
                return recursivePages(child)
            }),
        )
    }

    return paths
}

export const generatePageNames = (item: NavItem): Record<string, string> => {
    const result: Record<string, string> = {}
    function traverse(item: NavItem) {
        if (item?.path && item?.title) {
            result[item.path] = item.sidebarTitle ?? item.title
        }
        if (item?.children) {
            item.children.forEach((child) => traverse(child))
        }
    }
    traverse(item)
    return result
}