export default function useContentHead(page: Ref<{title?:string, description?:string, image?:string}>) {
    const title = computed(() => page.value?.title)
    const description = computed(() => page.value?.description)
    const image = computed(() => page.value?.image)
    useHead({
        title: title.value,
        meta: [
            { hid: 'description', name: 'description', content: description.value },
            { hid: 'og:title', property: 'og:title', content: title.value },
            { hid: 'og:description', property: 'og:description', content: description.value },
            { hid: 'og:image', property: 'og:image', content: image.value },
            { hid: 'twitter:title', name: 'twitter:title', content: title.value },
            { hid: 'twitter:description', name: 'twitter:description', content: description.value },
            { hid: 'twitter:image', name: 'twitter:image', content: image.value },
        ]
    })
}