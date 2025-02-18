<script>
    import {hash} from "ohash";
    import {useAsyncData} from "#imports";
    import {NuxtLink} from "#components";
    const {public:{CollectionNames}} = useRuntimeConfig()

    export default defineComponent({
        props: {
            pageUrl: {
                type: String,
                default: undefined
            },
            max: {
                type: Number,
                default: undefined
            },
        },
        async setup(props) {
            const {pageUrl, max} = toRefs(props);
            const route = useRoute()

            let currentPage = null;

            if (pageUrl.value) {
                currentPage = pageUrl.value;
            } else {
                currentPage = route.path;
            }

            currentPage = currentPage.endsWith("/") ? currentPage.slice(0, -1) : currentPage;

            const {data: navigation} = await useAsyncData(
                `ChildTableOfContents-${hash(currentPage)}`,
                () => queryCollectionNavigation(CollectionNames.docs).andWhere(query =>
                    query
                        .where('path', 'LIKE', `${currentPage}/%`)
                        .where('path', '<>', currentPage)
                )
            );

            const dir = computed(() => {
                const extractLeafChildrenPages = (children) => {
                    return children.map((child) => {
                        if (child.children?.length) {
                            return extractLeafChildrenPages(child.children);
                        }
                        return child;
                    }).flat();
                };

                return extractLeafChildrenPages(navigation.value)
            });

            return {dir, max};
        },

        render(ctx) {
            const {dir, max} = ctx;

            const renderLink = (link) => h(NuxtLink, {to: link.path}, () => link.title);

            const renderLinks = (data, level) => {
                return h(
                    "ul",
                    level ? {"data-level": level} : null,
                    (data || []).map((link) => {
                        if (link.children &&
                            (max === undefined || max <= level) &&
                            (link.children.length > 1 || (link.children.length === 1 && link.children[0].path !== link.path))
                        ) {
                            return h("li", null, [renderLink(link), renderLinks(link.children, level + 1)]);
                        }

                        return h("li", null, renderLink(link));
                    })
                );
            };

            const defaultNode = (data) => renderLinks(data, 0);

            return this.$slots?.default ? this.$slots.default({dir, ...this.$attrs}) : defaultNode(dir);
        }
    });
</script>
