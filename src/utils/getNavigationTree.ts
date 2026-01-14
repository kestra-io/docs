import type { NavigationItem } from "~/components/docs/RecursiveNavSidebar.vue";

const navigationTree = {
    "Get Started with Kestra": [
        "Quickstart",
        "Tutorial",
        "Architecture",
        "Installation Guide",
        "Contribute to Kestra",
        "User Interface"
        // "Video Tutorials"
    ],
    "Build with Kestra": [
        "Concepts",
        "Workflow Components",
        "Multi-Language Script Tasks",
        "AI Tools",
        "No-Code",
        "Version Control & CI/CD",
        "Plugin Developer Guide",
        "How-to Guides"
    ],
    "Scale with Kestra": [
        "Cloud & Enterprise Edition",
        "Task Runners",
        // "Worker Groups",
        "Best Practices"
    ],
    "Manage Kestra": [
        "Administrator Guide",
        "Migration Guide",
        "Performance"
    ],
    "Reference Docs": [
        "Configuration",
        "Releases & LTS Policy",
        "Expressions",
        "API Reference",
        "Terraform Provider",
        "Kestra CLI"
    ]
}


export function getNavigationTree(docsPages: { id: string, data: { title: string } }[]) {
    // build the initial tree structure by finding each title in the navigationTree
    // then build the navigation tree
    const navigationTreeResult: NavigationItem[] = [];
    for (const [section, titles] of Object.entries(navigationTree)) {
        const sectionPage = docsPages.find(page => section === page.data.title);
        const sectionNode: NavigationItem = {
            title: section,
            isSection: true,
            path: sectionPage ? `/docs/${sectionPage.id}` : '#',
            children: titles.map(title => {
                const page = docsPages.find(page => title === page.data.title);
                return page ? {
                    title: page.data.title,
                    path: `/docs/${page.id}`,
                    children: recursivelyBuildChildren(page.id, docsPages)
                } : undefined;
            }).filter((a) => a !== undefined)
        };
        navigationTreeResult.push(sectionNode);
    }

    return navigationTreeResult;
}

function recursivelyBuildChildren(parentId: string, docsPages: { id: string, data: { title: string } }[]): NavigationItem[] | undefined {
    const children = docsPages.filter(page => {
        const parentPath = parentId.endsWith('/') ? parentId : parentId + '/';
        return page.id.startsWith(parentPath) && page.id !== parentId && !page.id.slice(parentPath.length).includes('/');
    });

    if(children.length === 0) {
        return undefined;
    }

    return children.map(child => ({
        title: child.data.title,
        path: `/docs/${child.id}`,
        children: recursivelyBuildChildren(child.id, docsPages)
    }));
}