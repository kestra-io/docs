<template>
    <div>
        <Head>
            <Title>Prefect vs Kestra</Title>
            <Meta name="description" content="What are the differences between Kestra and Prefect" />
        </Head>

        <Header />
        <Main />
    </div>
</template>

<script setup>

</script>

<script>
    import Header from '~/components/vs/prefect/Header.vue';
    import Main from '~/components/vs/prefect/Main.vue';

    export default {
        components: {Header, Main}
    }
</script>
