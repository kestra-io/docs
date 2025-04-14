<template>
    <div>
        <Head>
            <Title>Google Workflows vs Kestra</Title>
            <Meta name="description" content="What are the differences between Kestra and Google Workflows" />
        </Head>

        <Header />
        <Main />
    </div>
</template>

<script setup>

</script>

<script>
    import Header from '~/components/vs/google-workflows/Header.vue';
    import Main from '~/components/vs/google-workflows/Main.vue';

    export default {
        components: {Header, Main}
    }
</script>
