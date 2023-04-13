<script>
    import {hash} from "ohash";
    import {useAsyncData, fetchContentNavigation, useContent} from "#imports";
    import {NuxtLink} from "#components";

    export default defineComponent({
        props: {
            header: {
                type: Boolean,
                default: false
            },
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
            const {header, pageUrl, max} = toRefs(props);
            const route = useRoute()
            const {navDirFromPath} = useContentHelpers()

            let currentPage = null;

            if (pageUrl.value) {
                currentPage = pageUrl.value;
            } else {
                const {page} = useContent();
                currentPage = page.value._path;
            }

            const queryBuilder = queryContent(currentPage);

            const {data: navigation} = await useAsyncData(
                `ChildTableOfContents-${hash(currentPage)}`,
                () => fetchContentNavigation(queryBuilder)
            );

            const routePath = route.path.endsWith("/") ? route.path.slice(0, -1) : route.path;
            const dir = (navDirFromPath(routePath, navigation.value) || [])
                .filter(value => value._path !== currentPage)

            return {dir, max, header};
        },

        render(ctx) {
            const slots = useSlots();
            const {dir, max} = ctx;

            const renderLink = (link) => h(NuxtLink, {to: link._path}, () => link.title);

            const renderLinks = (data, level) => {
                return h(
                    "ul",
                    level ? {"data-level": level} : null,
                    (data || []).map((link) => {
                        if (link.children &&
                            (max === undefined || max <= level) &&
                            (link.children.length > 1 || link.children.length === 1 && link.children[0]._path !== link._path)
                        ) {
                            return h("li", null, [renderLink(link), renderLinks(link.children, level + 1)]);
                        }

                        return h("li", null, renderLink(link));
                    })
                );
            };

            const defaultNode = (data) => renderLinks(data, 0);

            return slots?.default ? slots.default({dir, ...this.$attrs}) : defaultNode(dir);
        }
    });
</script>
