<template>
    <div>
        <Head>
            <Title>Join Us and Shape the Future of Data Orchestration</Title>
            <Meta name="description"
                  content="Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of data orchestration"/>
        </Head>

        <CareersHeader/>
        <template v-if="slug === '/careers/'">
            <CareersPositions/>
            <CareersPerks/>
        </template>
        <div v-else class="container bd-gutter mt-3 my-md-4 bd-layout">
            <article class="bd-main order-1">
                <ContentDoc />
            </article>
        </div>
        <CareersApply :title="title"/>
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()

    const route = useRoute()
    const slug = "/careers/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const title = ref();

    if (slug === '/careers/') {
        useHead({
            meta: [
                { name: 'twitter:card', content: 'summary-large-image' },
                { name: 'twitter:site', content: '@kestra_io' },
                { name: 'twitter:title', content: "Join Us and Shape the Future of Data Orchestration" },
                {
                    name: 'twitter:description',
                    content: "Discover exciting career opportunities at Kestra. Join our passionate team and help us shape the future of data orchestration"
                },
                { name: 'twitter:image', content: `${origin}/landing/careers/header.svg` },
                {
                    name: 'twitter:image:alt',
                    content: "A square with circles inside with emojis in It representing Kestra's inclusive and dynamic workplace culture"
                }
            ]
        })
    } else {
        const {data, error} = await useAsyncData(`Careers-Page-Item-${slug}`, () => {
            try {
                return queryContent(slug).findOne();
            } catch (error) {
                throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
            }
        });

        if (error && error.value) {
            throw error.value;
        }

        useContentHead(data.value)

        useHead({
            meta: [
                { name: 'twitter:card', content: 'summary-large-image' },
                { name: 'twitter:site', content: '@kestra_io' },
                { name: 'twitter:title', content: data.value.title },
                { name: 'twitter:description', content: data.value.description },
                { name: 'twitter:image:alt', content: data.value.title }
            ]
        })

        title.value = data.value.title;

        console.log(data)
    }

</script>
