<template>
    <div>
        <Head>
            <Title>Airflow vs Kestra</Title>
            <Meta name="description" content="What are the differences between Kestra and AWS Step Function" />
        </Head>

        <Header />
        <Main />
    </div>
</template>

<script setup>

</script>

<script>
    import Header from '~/components/vs/aws-step-function/Header.vue';
    import Main from '~/components/vs/aws-step-function/Main.vue';

    export default {
        components: {Header, Main}
    }
</script>
