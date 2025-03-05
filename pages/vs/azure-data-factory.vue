<template>
    <div>
        <Head>
            <Title>Kestra Alternative to Azure Data Factory</Title>
            <Meta name="description" content="What are the differences between Kestra and Azure Data Factory" />
        </Head>

        <Header />
        <Main />
    </div>
</template>

<script setup>

</script>

<script>
    import Header from '~/components/vs/azure-data-factory/Header.vue';
    import Main from '~/components/vs/azure-data-factory/Main.vue';

    export default {
        components: {Header, Main}
    }
</script>
