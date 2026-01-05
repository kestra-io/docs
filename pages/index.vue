<template>
    <div class="content">
        <Head>
            <Title>Kestra, Open Source Declarative Orchestration Platform</Title>
            <Meta name="description"
                  content="Use declarative language to build simpler, faster, scalable and flexible workflows"/>
        </Head>
        <HomeHeader/>
        <HomeLogosTable :logos="logos" />
        <HomeOpenSource v-bind="githubData" :error="githubError" />
        <HomeOpenSourceQuotes :quotes="randomizedQuotes" />
        <NuxtLazyHydrate when-visible>
            <HomeFeatures/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeEveryDev/>
            <HomeExperience/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomePlugins/>
            <HomeBlueprints/>
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomeEnterprise :stories/>
            <HomeEnterpriseQuotes />
            <HomeCTA/>
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>

    definePageMeta({
        transparentHeader: true,
    })
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Kestra, Open Source Declarative Orchestration" },
            {
                name: 'twitter:description',
                content: "Use declarative language to build simpler, faster, scalable and flexible workflows"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "kaestra" },
            { property: 'og:title', content: "Kestra, Open Source Declarative Orchestration" },
            { property: 'og:description', content: "Use declarative language to build simpler, faster, scalable and flexible workflows" },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: "Kestra, Open Source Declarative Orchestration" },
            { property: 'og:url', content: `${origin}` },
        ]
    })

    const companies = import.meta.glob('~/public/landing/home/trusted-companies/*.svg', {
        import: "default",
        query: 'url',
    })

    const {data: logos} = await useAsyncData(() => {
        // get all svg/png files in the /public/landing/companies folder
        return Promise.all(Object.entries(companies).map(([filePath, mod]) => {
            return mod().then((img) => {
                return {
                    name: filePath.split('/').pop()?.split('.').shift(),
                    url: img,
                }
            })
        })).then((imgs) => imgs.toSorted(() => 0.5 - Math.random()))
    })

    // fetch the number of contributors from the GitHub API
    const {data:githubData, error: githubError} = await useFetch("/api/github", {
        pick:["stargazers", "contributors"],
    })

    const {data:randomizedQuotes} = await useAsyncData('randomizedQuotes-oss', () => {
        return import('@/data/oss-quotes.json').then((quotes) => quotes.default.sort(() => Math.random() - 0.5))
    })

    const config = useRuntimeConfig();
    const {data: storiesData} = await useFetch(`${config.public.apiUrl}/customer-stories-v2?featured=true`);
    const stories = computed(() => storiesData.value?.results);

</script>

<style lang="scss" scoped>
    .content {
        margin-top: -67px;
    }
</style>
