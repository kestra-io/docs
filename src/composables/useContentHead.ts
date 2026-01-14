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

    useSeoMeta({
        title: title.value,
        description: description.value,
        ogTitle: title.value,
        ogDescription: description.value,
        ogImage: image.value,
        ogUrl: `${origin}/${path.value}`,
        twitterCard: 'summary_large_image',
        twitterSite: '@kestra_io',
        twitterTitle: title.value,
        twitterDescription: description.value,
        twitterImage: image.value,
        twitterImageAlt: title.value
    })
}