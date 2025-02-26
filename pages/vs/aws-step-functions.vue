<template>
    <div>
        <Head>
            <Title>Kestra Alternative to AWS Step Functions</Title>
            <Meta name="description" content="What are the differences between Kestra and AWS Step Functions" />
        </Head>

        <Header />
        <Main />
    </div>
</template>

<script setup>

</script>

<script>
    import Header from '~/components/vs/aws-step-functions/Header.vue';
    import Main from '~/components/vs/aws-step-functions/Main.vue';

    export default {
        components: {Header, Main}
    }
</script>
