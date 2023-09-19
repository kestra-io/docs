<template>
    <div>
        <Head>
            <Title>Dagster vs Kestra</Title>
            <Meta name="description" content="What are the differences between Kestra and Dagster" />
        </Head>

        <Header />
        <Main />
    </div>
</template>

<script setup>

</script>

<script>
    import Header from '~/components/vs/dagster/Header.vue';
    import Main from '~/components/vs/dagster/Main.vue';

    export default {
        components: {Header, Main}
    }
</script>