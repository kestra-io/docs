import {parseMarkdown} from '@nuxtjs/mdc/runtime'
import url from "node:url";
import {camelToKebabCase} from "~/utils/url.js";
import {aw} from "../../.output/public/_nuxt/DDuKEP5a";

function toNuxtContent(parsedMarkdown, pluginGroup) {
    return {
        body: {
            toc: parsedMarkdown.toc,
            ...parsedMarkdown.body
        },
        description: parsedMarkdown.data.description,
        title: parsedMarkdown.data.title,
        icon: `data:image/svg+xml;base64,${parsedMarkdown.data.icon}` ?? null,
        ogImage: `icons/${pluginGroup}`
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
    let startCaseTitle = title;
    if (title.match(/^[a-z]+[A-Z][a-z]/)) {
        startCaseTitle = title.replace(/[A-Z][a-z]/, match => " " + match);
    }
    return startCaseTitle.split(".")
        .map(string => string.charAt(0).toUpperCase() + string.slice(1))
        .join("");
}

const pluginCategories = ['tasks', 'triggers', 'conditions', 'controllers', 'storages', 'secrets', 'guides', 'taskRunners'];

export default defineEventHandler(async (event) => {
    try {
        const requestUrl = new url.URL("http://localhost" + event.node.req.url);
        const page = requestUrl.searchParams.get("page");
        const type = requestUrl.searchParams.get("type");
        const config = useRuntimeConfig();
        const plugins = await $fetch(`${config.public.apiUrl}/plugins`);
        const pluginGroup = plugins.find(plugin => plugin.name === page)?.group;

        if (type === 'definitions') {
            let pageData = await $fetch(`${config.public.apiUrl}/plugins/definitions/${page}`);

            const parsedMarkdown = await parseMarkdown(pageData.markdown);

            return toNuxtContent(parsedMarkdown, pluginGroup);
        }
        if (type === 'plugin') {
            let pageData = await $fetch(`${config.public.apiUrl}/plugins/${page}`);

            const parsedMarkdown = await parseMarkdown(pageData.body);

            return toNuxtContent(parsedMarkdown, pluginGroup);
        }
        if (type === 'navigation') {
            const plugins = await $fetch(`${config.public.apiUrl}/plugins`);
            let sortedPluginsHierarchy = plugins.map(plugin => {
                let rootPluginUrl = '/plugins/' + plugin.name;
                const children = pluginCategories
                    .flatMap(category => {
                        let children;
                        let kebabCasedCategory = camelToKebabCase(category);
                        const taskList = (plugin[category] || []);
                        if (plugin.name === "core") {
                            if (category === "tasks") {
                                children = generateSubMenu(
                                    `${rootPluginUrl}/${kebabCasedCategory}`,
                                    plugin.group,
                                    taskList.map(item => item.split(".").slice(-2).join("."))
                                );
                            } else {
                                const fqnByClassName = {};
                                children = generateSubMenuWithGroupProvider(
                                    `${rootPluginUrl}/${kebabCasedCategory}`,
                                    (item) => {
                                        const fqn = fqnByClassName[item];

                                        return fqn.substring(0, fqn.lastIndexOf("."));
                                    },
                                    taskList.map(item => {
                                        const className = item.substring(item.lastIndexOf(".") + 1);
                                        fqnByClassName[className] = item;
                                        return className;
                                    })
                                );
                            }
                        } else {
                            const coreTaskByFqn = {};
                            const coreTaskQualifier = "io.kestra.core.tasks";
                            children = generateSubMenuWithGroupProvider(
                                `${rootPluginUrl}/${kebabCasedCategory}`,
                                (item) => {
                                    let fqnTask = coreTaskByFqn[item];
                                    if (fqnTask !== undefined) {
                                        return coreTaskQualifier;
                                    }
                                    return plugin.group;
                                },
                                taskList.map(item => {
                                    if (item.startsWith(coreTaskQualifier)) {
                                        let relativeItem = item.substring(coreTaskQualifier.length + 1);
                                        coreTaskByFqn[relativeItem] = item;
                                        return relativeItem;
                                    }
                                    return item.substring(plugin.group.length + 1);
                                })
                            );
                        }

                        if (children.length === 0) {
                            return [];
                        }

                        return {
                            title: toNavTitle(category),
                            _path: `${rootPluginUrl}/${kebabCasedCategory}`.toLowerCase(),
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