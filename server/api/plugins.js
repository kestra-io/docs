import {parseMarkdown} from '@nuxtjs/mdc/runtime'
import url from "node:url";

function toNuxtContent(parsedMarkdown) {
    return {
        body: {
            toc: parsedMarkdown.toc,
            ...parsedMarkdown.body
        },
        description: parsedMarkdown.data.description,
        title: parsedMarkdown.data.title,
    };
}

function generateSubMenu(baseUrl, group, items) {
    return generateSubMenuWithGroupProvider(baseUrl, () => group, items);
}

function generateSubMenuWithGroupProvider(baseUrl, groupProviderFromItem, items) {
    let itemsBySubmenu = items.reduce((m, item) => {
        const subMenuSplitter = item.lastIndexOf(".");
        if (subMenuSplitter === -1) {
            m[item] = {
                title: toNavTitle(item),
                _path: `${baseUrl}/${groupProviderFromItem(item)}.${item}`.toLowerCase(),
                isPage: true,
            }
        } else {
            let subMenuName = item.substring(0, subMenuSplitter);
            if (!m[subMenuName]) {
                const subGroup = `${groupProviderFromItem(item)}.${subMenuName}`;
                m[subMenuName] = generateSubMenu(
                    `${baseUrl}/${subMenuName}`,
                    subGroup,
                    items.filter(i => i.startsWith(subMenuName + "."))
                        .map(i => i.substring(subMenuName.length + 1))
                );
            }
        }
        return m;
    }, {});

    return Object.entries(itemsBySubmenu).map(([key, value]) => {
        if (Array.isArray(value)) {
            return {
                title: toNavTitle(key),
                _path: `${baseUrl}/${key}`.toLowerCase(),
                isPage: false,
                children: value
            }
        }
        return value;
    });
}

function toNavTitle(title) {
    return title.split(".")
        .map(string => string.charAt(0).toUpperCase() + string.slice(1))
        .join("");
}

const pluginCategories = ['tasks', 'triggers', 'conditions', 'controllers', 'storages', 'secrets', 'guides'];

export default defineEventHandler(async (event) => {
    try {
        const requestUrl = new url.URL("http://localhost" + event.node.req.url);
        const page = requestUrl.searchParams.get("page");
        const type = requestUrl.searchParams.get("type");
        const config = useRuntimeConfig();

        if (type === 'definitions') {
            let pageData = await $fetch(`${config.public.apiUrl}/plugins/definitions/${page}`);

            const parsedMarkdown = await parseMarkdown(pageData.markdown);

            return toNuxtContent(parsedMarkdown);
        }
        if (type === 'plugin') {
            let pageData = await $fetch(`${config.public.apiUrl}/plugins/${page}`);

            const parsedMarkdown = await parseMarkdown(pageData.body);

            return toNuxtContent(parsedMarkdown);
        }
        if (type === 'navigation') {
            const plugins = await $fetch(`${config.public.apiUrl}/plugins`);
            let sortedPluginsHierarchy = plugins.map(plugin => {
                let rootPluginUrl = '/plugins/' + plugin.name;
                const children = pluginCategories
                    .flatMap(category => {
                        let children;
                        if (plugin.name === "core") {
                            if (category === "tasks") {
                                children = generateSubMenu(
                                    `${rootPluginUrl}/${category}`,
                                    plugin.group,
                                    plugin[category].map(item => item.split(".").slice(-2).join("."))
                                );
                            } else {
                                const fqnByClassName = {};
                                children = generateSubMenuWithGroupProvider(
                                    `${rootPluginUrl}/${category}`,
                                    (item) => {
                                        const fqn = fqnByClassName[item];

                                        return fqn.substring(0, fqn.lastIndexOf("."));
                                    },
                                    plugin[category].map(item => {
                                        const className = item.substring(item.lastIndexOf(".") + 1);
                                        fqnByClassName[className] = item;
                                        return className;
                                    })
                                );
                            }
                        } else {
                            children = generateSubMenu(
                                `${rootPluginUrl}/${category}`,
                                `${plugin.group}`,
                                plugin[category].map(item => item.substring(plugin.group.length + 1))
                            );
                        }

                        if (children.length === 0) {
                            return [];
                        }

                        return {
                            title: toNavTitle(category),
                            _path: `${rootPluginUrl}/${category}`.toLowerCase(),
                            isPage: false,
                            children
                        }
                    });
                return {
                    title: toNavTitle(plugin.title),
                    _path: rootPluginUrl.toLowerCase(),
                    children
                };
            }).sort((a, b) => {
                const nameA = a.title.toLowerCase(),
                    nameB = b.title.toLowerCase();

                if (nameA === "core") {
                    return -1;
                }
                if (nameB === "core") {
                    return 1;
                }

                return nameA === nameB ? 0 : nameA < nameB ? -1 : 1;
            });
            return [{
                title: "Plugins",
                _path: "/plugins",
                children: sortedPluginsHierarchy
            }];
        }
    } catch (error) {
        return {
            message: 'Failed to fetch or parse data',
            error: error,
        };
    }
});