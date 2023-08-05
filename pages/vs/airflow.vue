<template>
    <div>
        <Head>
            <Title>Airflow vs Kestra</Title>
            <Meta name="description" content="What are the differences between Kestra and Airflow" />
        </Head>

        <Header />
        <Main />
    </div>
</template>

<script setup>

</script>

<script>
    import Header from '~/components/vs/airflow/Header.vue';
    import Main from '~/components/vs/airflow/Main.vue';

    export default {
        components: {Header, Main}
    }
</script>
