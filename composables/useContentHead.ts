export default function useContentHead(page: Ref<undefined | {title?:string, description?:string, image?:string, path?:string}>) {
    const title = computed(() => page.value?.title)
    const description = computed(() => page.value?.description)
    const image = computed(() => page.value?.image)
    const path = computed(() => {
        let result = page.value?.path;
        if (result?.startsWith("/")) {
            return result.substring(1);
        }

        return result;
    })

    const {origin} = useRequestURL()

    useHead({
        title: title.value,
        meta: [
            {name: 'description', content: description.value},
            {name: 'og:title', content: title.value},
            {name: 'og:description', content: description.value},
            {name: 'og:image', content: image},
            {name: 'og:image:type', content: "image/svg+xml"},
            {name: 'og:image:alt', content: title.value},
            {name: 'og:url', content: `${origin}/${path.value}`},
            {name: 'twitter:card', content: 'summary_large_image'},
            {name: 'twitter:site', content: '@kestra_io'},
            {name: 'twitter:title', content: title.value},
            {name: 'twitter:description', content: description.value},
            {name: 'twitter:image', content: image},
            {name: 'twitter:image:alt', content: title.value}
        ]
    })
}