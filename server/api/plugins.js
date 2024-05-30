import {parseMarkdown} from '@nuxtjs/mdc/runtime'
import url from "node:url";
import {camelToKebabCase} from "~/utils/url.js";

function toNuxtContent(parsedMarkdown, type) {
    return {
        body: {
            toc: parsedMarkdown.toc,
            ...parsedMarkdown.body
        },
        pluginType: type,
        description: parsedMarkdown.data.description,
        title: parsedMarkdown.data.title,
        icon: `data:image/svg+xml;base64,${parsedMarkdown.data.icon}` ?? null
    };
}

function toNuxtBlocks(data, type) {
    const { $schema, required, title, description, $examples, $deprecated, $beta, $metrics, ...pageData } = data;

    if ($examples) {
        pageData.examples = $examples;
    }

    if ($metrics) {
        pageData.metrics = $metrics;
    }
    return {
        body: {
            children: pageData,
            toc: {
                links: navTocData(pageData)
            },
        },
        pluginType: type,
        description,
        deprecated: $deprecated,
        title,
    };
}

const generateNavTocChildren = (properties) => {
    const children = [];

    for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
            children.push({
                id: key,
                depth: 3,
                text: properties[key].name ?  properties[key].name : key,
                required: properties[key].$required || false
            })
        }
    }

    children.sort((a, b) => b.required - a.required);
    console.log('children', children);
    return children.map(({ required, ...rest }) => rest);
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const navTocData = (pageData) => {
    console.log('pageData', pageData);
    const links = [{
        id: 'examples',
        depth: 2,
        text: 'Examples',
    }];

    for (const key in pageData) {
        if (pageData.hasOwnProperty(key) && key !== 'examples' && key.split('')[0] !== '$') {
            const data = {
                id: key,
                depth: 2,
                text: capitalizeFirstLetter(key),
            }

            if (Object.keys(pageData[key]).length > 0) {
                data.children = generateNavTocChildren(pageData[key]);
            }

            links.push(data)
        }
    }

    return links;
};

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
        if (type === 'definitions') {
            let pageData = await $fetch(`${config.public.apiUrl}/plugins/definitions/${page}`);

            if (pageData.schema.outputs && pageData.schema.outputs.properties) {
                pageData.schema.properties.outputs = pageData.schema.outputs.properties;
            }

            if (pageData.schema.definitions && Object.keys(pageData.schema.definitions).length) {
                pageData.schema.properties.definitions = pageData.schema.definitions;
            }

            if (pageData.schema['examples']) {
                pageData.schema.properties.examples = pageData.schema['examples']
            }

            return toNuxtBlocks(pageData.schema.properties, type);
        }
        if (type === 'plugin') {
            let pageData = await $fetch(`${config.public.apiUrl}/plugins/${page}`);

            const parsedMarkdown = await parseMarkdown(pageData.body);

            return toNuxtContent(parsedMarkdown, type);
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