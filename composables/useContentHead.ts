export default function useContentHead(page: Ref<undefined | {title?:string, description?:string, image?:string, path?:string}>) {
    const title = computed(() => page.value?.title)
    const description = computed(() => page.value?.description)
    const image = computed(() => page.value?.image)
    const path = computed(() => page.value?.path)

    const {origin} = useRequestURL()

    useHead({
        title: title.value,
        meta: [
            {property: 'og:title', content: title.value},
            {property: 'og:description', content: description.value},
            {property: 'og:image', content: image},
            {property: 'og:image:type', content: "image/svg+xml"},
            {property: 'og:image:alt', content: title.value},
            {property: 'og:url', content: `${origin}/${path.value}`},
            {name: 'twitter:card', content: 'summary_large_image'},
            {name: 'twitter:site', content: '@kestra_io'},
            {name: 'twitter:title', content: title.value},
            {name: 'twitter:description', content: description.value},
            {name: 'twitter:image', content: image},
            {name: 'twitter:image:alt', content: title.value}
        ]
    })
}