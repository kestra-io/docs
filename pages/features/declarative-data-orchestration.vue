<template>
    <div>
        <Head>
            <Title>Declarative Orchestration with Kestra</Title>
            <Meta name="description" content="Bring Infrastructure as Code Best Practices to All Workflows" />
        </Head>

        <Header />
        <NuxtLazyHydrate when-visible>
            <Main />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <Features />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <Empower />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <HomePlugins />
        </NuxtLazyHydrate>
        <NuxtLazyHydrate when-visible>
            <LayoutFooterContact
                title="Getting Started with  Declarative Orchestration"
                darkButtonText="Read the docs"
                purpleButtonText="Get started"
            />
        </NuxtLazyHydrate>
    </div>
</template>

<script setup>
    const { origin } = useRequestURL()
    useHead({
        meta: [
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@kestra_io' },
            { name: 'twitter:title', content: "Declarative Data Orchestration with Kestra" },
            {
                name: 'twitter:description',
                content: "Simplified Data Workflow Creation and Execution with YAML"
            },
            { name: 'twitter:image', content: `${origin}/og-image.png` },
            { name: 'twitter:image:alt', content: "Declarative Data Orchestration with Kestra" },
            { property: 'og:title', content: data.value.title },
            { property: 'og:description', content: data.value.description },
            { property: 'og:image', content: `${origin}/og-image.png` },
            { property: 'og:image:type', content: "image/svg+xml" },
            { property: 'og:image:alt', content: data.value.title },
        ]
    })
</script>

<script>
    import Header from '../../components/features/declaratives/Header.vue';
    import Main from '../../components/features/declaratives/Main.vue';
    import Features from '../../components/features/declaratives/Features.vue';
    import Empower from '../../components/features/declaratives/Empower.vue';

    export default {
        components: {Header, Main, Features, Empower}
    }
</script>
