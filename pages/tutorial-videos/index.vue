<template>
    <div>
        <Head>
            <Title>All Things Kestra in Video</Title>
            <Meta name="description"
                  content="Discover all our video tutorials, hands-on video, and more"/>
        </Head>
        <VideosTutorialsList :videos="videos" />
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()
    const config = useRuntimeConfig();
    const videos = ref([])
    const {data: tutorialVideo} = await useAsyncData(`tutorial-videos`, () => {
      return $fetch(`${config.public.apiUrl}/tutorial-videos`)
    });


    const setVideos = (data, total) => {
      videos.value = data.map((item) => ({ ...item , iframeUrl: embedUrl(item.url) }))
      console.log(videos.value)
    }

    const embedUrl = (url) => {
      const videoId = url.split('v=')[1];
      return "https://www.youtube.com/embed/" + videoId;
    }

    if(tutorialVideo.value) {
      setVideos(tutorialVideo.value.results, tutorialVideo.value.total)
    }
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "All Things Kestra in Video" },
            {
                name: 'twitter:description',
                content: "Discover all our video tutorials, hands-on video, and more"
            },
            { name: 'twitter:image', content: `${origin}/landing/careers/header.svg` },
            {
                name: 'twitter:image:alt',
                content: "Discover all our video tutorials, hands-on video, and more"
            }
        ]
    })
</script>
