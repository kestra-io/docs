import type { NavigationItem } from "../../components/docs/RecursiveNavSidebar.vue";

const navigationTree = {
    "Get Started with Kestra": [
        "Getting Started",
        "Tutorial",
        "Architecture",
        "Installation Guide",
        "User Interface"
        // "Video Tutorials"
    ],
    "Build with Kestra": [
        "Concepts",
        "Workflow Components",
        "Multi-Language Script Tasks",
        "AI Tools",
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
        "Expressions",
        "API Reference",
        "Terraform Provider",
        "Server CLI",
        "Kestra EE CLI"
    ],
}


export function getNavigationTree(docsPages: { id: string, data: { title: string } }[]) {
    // build the initial tree structure by finding each title in the navigationTree
    // then build the navigation tree
    const navigationTreeResult: NavigationItem[] = [];
    for (const [section, titles] of Object.entries(navigationTree)) {
        const sectionPages = docsPages.find(page => section === page.data.title);
        const sectionNode: NavigationItem = {
            title: section,
            path: sectionPages ? sectionPages.id : '',
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