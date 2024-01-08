<template>
    <div class="container bd-gutter bd-layout margin">
        <NavSideBar v-if="navigation" :type="type" :navigation="navigation" />
        <div class="container" v-if="slug === '/plugins/'">
            <PluginsLists :plugins="plugins" :categories="categories" />
        </div>
        <article v-else-if="page" class="bd-main order-1" :class="{'full': page.rightBar === false , 'docs' : isDoc}">
            <ContentRenderer :value="page">
                <div class="bd-title">
                    <Breadcrumb :slug="slug" :pageList="pageList"/>
                    <h1 v-html="transformTitle(page.title)" class="py-0 title "></h1>
                </div>

                <NavToc :page="page"/>

                <div class="bd-content">
                    <ContentRendererMarkdown
                        class="bd-markdown"
                        :value="page"
                        data-bs-spy="scroll"
                        data-bs-target="#nav-toc"
                    />
                    <PrevNext v-if="prevNext" :base-path="`/${type}`"/>
                </div>
            </ContentRenderer>
        </article>
    </div>
</template>

<script setup>
    import PrevNext from "~/components/layout/PrevNext.vue";
    import NavSideBar from "~/components/docs/NavSideBar.vue";
    import Breadcrumb from "~/components/layout/Breadcrumb.vue";
    import NavToc from "~/components/docs/NavToc.vue";
    import {hash} from "ohash";
    import {fetchContentNavigation, useAsyncData} from "#imports";
    import { kestraInstance } from "~/utils/api.js";

    let plugins;
    let categories;

    const props = defineProps({
        type: {
            type: String,
            required: true
        },
        prevNext: {
            type: Boolean,
            required: false,
            default: true
        },
    })

    const isDoc = computed(() => props.type === 'docs');

    const route = useRoute()
    const slug = computed(() => `/${props.type}/${route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug}`);
    let page;
    watch(slug, () => {
        fetchPageContent();
    });

    await fetchPageContent();

    const {navigation, pageList} = await fetchNavigation();

    useContentHead(page);

    async function fetchPageContent() {
        if (slug.value === '/plugins/') {
            const {data: pluginsData} = await useAsyncData('plugins', () => {
                return kestraInstance.get(`/plugins`);
            });
            plugins = ref(pluginsData.value.data);

            const {data: categoriesData} = await useAsyncData('plugin-categories', () => {
                return kestraInstance.get(`/plugins/categories`);
            });

            categories = ref(categoriesData.value.data);
        }

        const parts = slug.value.split('/');
        const pageName = parts[parts.length - 1];
        if (props.type === 'plugins' && pageName) {
            const {data: pluginInformation} = await useAsyncData(`Container-${hash(slug.value)}`, () => {
                if (parts.length === 3) {
                    return $fetch(`/api/plugins?page=${pageName}&type=plugin`)
                } else {
                    return $fetch(`/api/plugins?page=${pageName}&type=definitions`)
                }
            });
            page = pluginInformation.value.descriptionAsMd;
        } else {
            const {data, error} = await useAsyncData(`Container-${hash(slug.value)}`, () => {
                try {
                    return queryContent(slug.value).findOne();
                } catch (error) {
                    throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
                }
            });
            page = data.value;

            if (error && error.value) {
                throw error.value;
            }
        }
    }

    function generateSubMenu(baseUrl, group, items) {
        return generateSubMenuWithGroupProvider(baseUrl, () => group, items);
    }

    function generateSubMenuWithGroupProvider(baseUrl, groupProviderFromItem, items) {
        let itemsBySubmenu = items.reduce((m, item) => {
            const subMenuSplitter = item.lastIndexOf(".");
            if (subMenuSplitter === -1) {
                m[item] = {
                    title: capitalize(item),
                    _path: `${baseUrl}/${groupProviderFromItem(item)}.${item}`
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
                    title: capitalize(key),
                    _path: `${baseUrl}/${key}`,
                    isPage: false,
                    children: value
                }
            }
            return value;
        });
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function recursivePages(item) {
        const paths = [];
        if (item.isPage ?? true) {
            paths.push(item._path);
        }
        if (item.children) {
            paths.push(...(item.children.flatMap(child => {
                return recursivePages(child);
            })));
        }

        return paths;
    }

    async function fetchNavigation() {
        const queryBuilder = queryContent('/' + props.type + '/').without("body");

        let navigationFetch;
        if (props.type === "plugins") {
            const categories = ['tasks', 'triggers', 'conditions', 'controllers', 'storages', 'secrets', 'guides'];
            navigationFetch = await useAsyncData(
                'plugins',
                () => $fetch(`https://api.kestra.io/v1/plugins`),
                {
                    transform: plugins => {
                        let sortedPluginsHierarchy = plugins.map(plugin => {
                            let rootPluginUrl = '/plugins/' + plugin.name;
                            const children = categories
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
                                        title: capitalize(category),
                                        _path: `${rootPluginUrl}/${category}`,
                                        isPage: false,
                                        children
                                    }
                                });
                            return {
                                title: capitalize(plugin.title),
                                _path: rootPluginUrl,
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
                });
        } else {
            navigationFetch = await useAsyncData(
                `NavSideBar-${hash(props.type)}`,
                () => fetchContentNavigation(queryBuilder)
            );
        }

        const navigation = navigationFetch.data;
        const pageList = recursivePages(navigation.value[0]);
        return {navigation, pageList};
    }

    const transformTitle = (text) => {
        return text
            .replace(/([A-Z])/g, '&#x200B;$1')
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    }
    const {description, title} = page;
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: `${origin}/landing/home/header-bg.png` },
            { name: 'twitter:image:alt', content: title }
        ]
    })
</script>
<style lang="scss" scoped >
@import "../../assets/styles/variable";
.container{
    max-width: 1500px;
    .title{
        font-size: 2.375rem;
        font-weight: 600;
        line-height: 3.25rem;
    }
}
:deep(p){
    font-weight: 400;
    line-height: 1.75rem;
}
:deep(p > a){
    text-decoration: underline;
}
:deep(h2 > a){
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2.375;
    margin: 0;
}
:deep(h3 > a ){
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 2.375;
}


.docs :deep(img){
    width: 100%;
}
</style>



