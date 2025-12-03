<template>
    <div>
        <Head>
            <Title>All Things Kestra in Video</Title>
            <Meta name="description"
                  content="Discover all our video tutorials, hands-on video, and more"/>
        </Head>
        <VideosTutorialsList
            :tutorialVideo
            :page
            :itemsPerPage
            @update:currentCategory="async (newCategory) => {
                router.push(`/tutorial-videos/${newCategory}`)
            }"
        >
            <template #pagination>
                <CommonPagination
                    :current-url="route.fullPath"
                    :current-page="page"
                    :total-pages="tutorialVideo.totalPages"
                    @update:currentPage="async (newPage) => {
                        router.push({
                            params: { ...route.params, slug: currentCategory.value },
                            query: { ...route.query, page: newPage, size: itemsPerPage }
                        })
                    }"
                />
            </template>
        </VideosTutorialsList>
    </div>
</template>

<script setup>
    import { computed } from 'vue'
    import VideosTutorialsList from '~/components/videos/TutorialsList.vue'
    import CommonPagination from '~/components/common/Pagination.vue'

    const router = useRouter()

    const { origin } = useRequestURL()

    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "All Things Kestra in Video" },
            {
                name: 'twitter:description',
                content: "Discover all our video tutorials, hands-on video, and more"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Get in Touch With the Team" },
            { property: 'og:title', content: "All Things Kestra in Video" },
            {
                property: 'og:description',
                content: "Discover all our video tutorials, hands-on video, and more"
            },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "All Things Kestra in Video" },
        ]
    })

    const config = useRuntimeConfig()

    const route = useRoute()
    const currentCategory = computed(() => route.params.slug)

    const page = computed(() => {
        const pageParam = route.query.page
        return pageParam ? Number(pageParam) : 1
    })

    const itemsPerPage = computed(() => {
        const sizeParam = route.query.size
        return sizeParam ? Number(sizeParam) : 25
    })

    const { data: tutorialVideo } = await useFetch(
        () => `${config.public.apiUrl}/tutorial-videos?page=${page.value}&size=${itemsPerPage.value}&category=${currentCategory.value}`
    )
</script>
