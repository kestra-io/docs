import type { CollectionEntry } from "astro:content";
import type { NavigationItem } from "~/components/docs/RecursiveNavSidebar.vue"
export type { NavigationItem } from "~/components/docs/RecursiveNavSidebar.vue"

const navigationTree = {
    "Get Started with Kestra": [
        "Quickstart",
        "Installation Guide",
        "Tutorial",
        "Architecture",
        "Contribute to Kestra",
        "User Interface",
        // "Video Tutorials"
    ],
    "Build with Kestra": [
        "Workflow Components",
        "Concepts",
        "Multi-Language Script Tasks",
        "AI Tools",
        "No-Code",
        "Version Control & CI/CD",
        "Plugin Developer Guide",
        "How-to Guides",
    ],
    "Scale with Kestra": [
        "Cloud & Enterprise Edition",
        "Kestra Task Runners – Offload and Isolate Compute",
        // "Worker Groups",
        "Best Practices",
    ],
    "Manage Kestra": ["Administrator Guide", "Migration Guide", "Performance"],
    "Reference Docs": [
        "Configuration",
        "Releases & LTS Policy",
        "Expressions",
        "API Reference",
        "Terraform Provider",
        "Kestra CLI",
    ],
}

export function getNavigationTree(
    docsPages: CollectionEntry<"docs">[],
) {
    // build the initial tree structure by finding each title in the navigationTree
    // then build the navigation tree
    const navigationTreeResult: NavigationItem[] = []
    for (const [section, titles] of Object.entries(navigationTree)) {
        const sectionPage = docsPages.find(
            (page) => section === page.data.title || section === page.data.sidebarTitle,
        )
        const sectionNode: NavigationItem = {
            title: section,
            isSection: true,
            path: sectionPage ? `/docs/${sectionPage.id}` : "#",
            sidebarTitle: sectionPage?.data?.sidebarTitle,
            children: titles
                .map((title) => {
                    const page = docsPages.find(
                        (page) => title === page.data.sidebarTitle || title === page.data.title,
                    )
                    return page
                        ? {
                              title: page.data.title,
                              sidebarTitle: page.data.sidebarTitle,
                              path: `/docs/${page.id}`,
                              children: recursivelyBuildChildren(page.id, docsPages),
                              hideSubMenus: Boolean(page.data.hideSubMenus),
                              hideSidebar: Boolean(page.data.hideSidebar),
                          }
                        : undefined
                })
                .filter((a) => a !== undefined),
        }
        navigationTreeResult.push(sectionNode)
    }

    return navigationTreeResult
}

function recursivelyBuildChildren(
    parentId: string,
    docsPages: CollectionEntry<"docs">[],
): NavigationItem[] | undefined {
    const children = docsPages.filter((page) => {
        const parentPath = parentId.endsWith("/") ? parentId : parentId + "/"
        return (
            page.id.startsWith(parentPath) &&
            page.id !== parentId &&
            !page.id.slice(parentPath.length).includes("/")
        )
    })

    if (children.length === 0) {
        return undefined
    }

    return children.map((child) => ({
        title: child.data.title,
        sidebarTitle: child.data.sidebarTitle,
        path: `/docs/${child.id}`,
        children: recursivelyBuildChildren(child.id, docsPages),
    }))
}