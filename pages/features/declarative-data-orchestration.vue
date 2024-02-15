<template>
    <div>
        <Head>
            <Title>Declarative Data Orchestration with Kestra</Title>
            <Meta name="description" content="Simplified Data Workflow Creation and Execution with YAML" />
        </Head>

        <Header />
        <Main />
        <Features />
        <Empower />
        <HomePlugins />
        <LayoutFooterContact
            title="Getting Started with  Declarative Orchestration"
            darkButtonText="Read the docs"
            purpleButtonText="Get started!"
        />
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
            { name: 'twitter:image', content: `${origin}/landing/features/declarative/header-bg.svg` },
            { name: 'twitter:image:alt', content: "Declarative Data Orchestration with Kestra" }
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
